import { prisma } from '@/lib/prisma';

export type NotificationType = 'availability' | 'dealRequest' | 'offerDeclined' | 'dealCancelled';

export interface NotificationRecipient {
  email: string;
  name: string;
}

/**
 * Get the list of recipients for a specific notification type.
 * Falls back to dealer's default notification email if no preferences are configured.
 */
export async function getNotificationRecipients(
  dealerId: string,
  notificationType: NotificationType
): Promise<NotificationRecipient[]> {
  // Get the dealer with their team members and notification preferences
  const dealer = await prisma.user.findUnique({
    where: { id: dealerId },
    include: {
      teamMembers: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      notificationPreferences: true,
    },
  });

  if (!dealer) {
    return [];
  }

  const preferences = dealer.notificationPreferences;

  // If no preferences configured, fall back to default behavior (owner only)
  if (!preferences) {
    return [{
      email: dealer.notificationEmail || dealer.email,
      name: dealer.businessName || dealer.name,
    }];
  }

  // Get the appropriate recipient IDs based on notification type
  let recipientIds: string[];
  switch (notificationType) {
    case 'availability':
      recipientIds = preferences.availabilityRecipients;
      break;
    case 'dealRequest':
      recipientIds = preferences.dealRequestRecipients;
      break;
    case 'offerDeclined':
      recipientIds = preferences.offerDeclinedRecipients;
      break;
    case 'dealCancelled':
      recipientIds = preferences.dealCancelledRecipients;
      break;
    default:
      recipientIds = [];
  }

  const recipients: NotificationRecipient[] = [];

  // Add selected team members
  for (const teamMember of dealer.teamMembers) {
    if (recipientIds.includes(teamMember.id)) {
      recipients.push({
        email: teamMember.email,
        name: teamMember.name,
      });
    }
  }

  // Always add owner if alwaysNotifyOwner is true
  if (preferences.alwaysNotifyOwner) {
    recipients.push({
      email: dealer.notificationEmail || dealer.email,
      name: dealer.businessName || dealer.name,
    });
  }

  // If no recipients at all (alwaysNotifyOwner is false and no team members selected),
  // fall back to owner to avoid silent failures
  if (recipients.length === 0) {
    return [{
      email: dealer.notificationEmail || dealer.email,
      name: dealer.businessName || dealer.name,
    }];
  }

  // Remove duplicates by email
  const uniqueRecipients = recipients.filter(
    (recipient, index, self) =>
      index === self.findIndex((r) => r.email === recipient.email)
  );

  return uniqueRecipients;
}

/**
 * Get the parent dealer ID for a given user (handles team members).
 */
export async function getParentDealerId(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      parentDealerId: true,
    },
  });

  if (!user) {
    return userId;
  }

  // If user has a parent dealer, return the parent's ID
  return user.parentDealerId || user.id;
}
