import { prisma } from './prisma';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CALENDAR_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: { email: string }[];
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<GoogleTokenResponse> {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Google Calendar credentials not configured');
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[Google Calendar] Token refresh failed:', error);
    throw new Error('Failed to refresh access token');
  }

  return response.json();
}

/**
 * Get a valid access token, refreshing if necessary
 */
async function getValidAccessToken(): Promise<string> {
  const connection = await prisma.googleCalendarConnection.findFirst({
    where: { isActive: true },
  });

  if (!connection) {
    throw new Error('Google Calendar not connected');
  }

  // Check if token is expired (with 5 minute buffer)
  const now = new Date();
  const expiresAt = new Date(connection.tokenExpiresAt);
  const bufferMs = 5 * 60 * 1000;

  if (expiresAt.getTime() - bufferMs <= now.getTime()) {
    // Token expired or about to expire, refresh it
    const newTokens = await refreshAccessToken(connection.refreshToken);

    // Update the connection with new token
    await prisma.googleCalendarConnection.update({
      where: { id: connection.id },
      data: {
        accessToken: newTokens.access_token,
        tokenExpiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
      },
    });

    return newTokens.access_token;
  }

  return connection.accessToken;
}

/**
 * Get busy times from Google Calendar
 */
async function getFreeBusy(
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<{ start: string; end: string }[]> {
  const accessToken = await getValidAccessToken();

  const response = await fetch(`${GOOGLE_CALENDAR_API}/freeBusy`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: 'America/New_York',
      items: [{ id: calendarId }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[Google Calendar] FreeBusy query failed:', error);
    throw new Error('Failed to check calendar availability');
  }

  const data = await response.json();
  return data.calendars?.[calendarId]?.busy || [];
}

/**
 * Create a date string in Eastern Time
 * Returns ISO string that represents the given hour in ET
 */
function createEasternTimeSlot(dateStr: string, hour: number, minute: number): string {
  // Create the datetime string in Eastern Time format
  // Format: YYYY-MM-DDTHH:MM:00-05:00 (EST) or -04:00 (EDT)
  const hourStr = hour.toString().padStart(2, '0');
  const minuteStr = minute.toString().padStart(2, '0');

  // Determine if we're in EST or EDT (simplified - assumes EST for Jan/Feb)
  const month = parseInt(dateStr.split('-')[1], 10);
  const offset = (month >= 3 && month <= 11) ? '-04:00' : '-05:00';

  return `${dateStr}T${hourStr}:${minuteStr}:00${offset}`;
}

/**
 * Get available time slots for demo booking
 * Returns slots for the next 14 days, 9 AM - 5 PM EST, 30-minute slots
 */
export async function getAvailableSlots(
  startDate?: Date,
  daysToShow: number = 14
): Promise<{ date: string; slots: TimeSlot[] }[]> {
  const calendarId = process.env.GOOGLE_SHARED_CALENDAR_ID || 'primary';

  // Get current date in Eastern Time
  const now = new Date();
  const etFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Parse today's date in ET
  const todayET = etFormatter.format(now);
  const [year, month, day] = todayET.split('-').map(Number);

  // Start from tomorrow in ET
  const startDay = new Date(year, month - 1, day + 1);

  // Calculate end date for freeBusy query
  const endDay = new Date(startDay);
  endDay.setDate(endDay.getDate() + daysToShow);

  // Get busy times from Google Calendar
  let busyTimes: { start: string; end: string }[] = [];
  try {
    const startISO = createEasternTimeSlot(
      `${startDay.getFullYear()}-${String(startDay.getMonth() + 1).padStart(2, '0')}-${String(startDay.getDate()).padStart(2, '0')}`,
      0, 0
    );
    const endISO = createEasternTimeSlot(
      `${endDay.getFullYear()}-${String(endDay.getMonth() + 1).padStart(2, '0')}-${String(endDay.getDate()).padStart(2, '0')}`,
      23, 59
    );

    busyTimes = await getFreeBusy(calendarId, startISO, endISO);
  } catch (error) {
    console.error('[Book Demo] Failed to get busy times:', error);
  }

  const results: { date: string; slots: TimeSlot[] }[] = [];

  for (let dayOffset = 0; dayOffset < daysToShow; dayOffset++) {
    const currentDate = new Date(startDay);
    currentDate.setDate(startDay.getDate() + dayOffset);

    // Skip weekends
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const slots: TimeSlot[] = [];

    // Generate 30-minute slots from 9 AM to 5 PM ET
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = createEasternTimeSlot(dateStr, hour, minute);
        const slotEnd = createEasternTimeSlot(dateStr, minute === 30 ? hour + 1 : hour, minute === 30 ? 0 : 30);

        // Check if this slot overlaps with any busy time
        const slotStartTime = new Date(slotStart).getTime();
        const slotEndTime = new Date(slotEnd).getTime();

        const isAvailable = !busyTimes.some((busy) => {
          const busyStart = new Date(busy.start).getTime();
          const busyEnd = new Date(busy.end).getTime();
          return slotStartTime < busyEnd && slotEndTime > busyStart;
        });

        slots.push({
          start: slotStart,
          end: slotEnd,
          available: isAvailable,
        });
      }
    }

    results.push({ date: dateStr, slots });
  }

  return results;
}

/**
 * Create a demo booking event on Google Calendar
 */
export async function createDemoBooking(params: {
  dealershipName: string;
  email: string;
  phone: string;
  startTime: string;
  endTime: string;
}): Promise<{ eventId: string; meetLink?: string }> {
  const accessToken = await getValidAccessToken();
  const calendarId = process.env.GOOGLE_SHARED_CALENDAR_ID || 'primary';

  const event: CalendarEvent = {
    summary: `IQ Auto Deals Demo - ${params.dealershipName}`,
    description: `Demo booking for IQ Auto Deals

Dealership: ${params.dealershipName}
Email: ${params.email}
Phone: ${params.phone}

Booked via iqautodeals.com/for-dealers/book-demo`,
    start: {
      dateTime: params.startTime,
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: params.endTime,
      timeZone: 'America/New_York',
    },
    attendees: [{ email: params.email }],
  };

  const response = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        conferenceData: {
          createRequest: {
            requestId: `demo-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('[Google Calendar] Failed to create event:', error);
    throw new Error('Failed to book demo');
  }

  const createdEvent = await response.json();

  return {
    eventId: createdEvent.id,
    meetLink: createdEvent.hangoutLink || createdEvent.conferenceData?.entryPoints?.[0]?.uri,
  };
}
