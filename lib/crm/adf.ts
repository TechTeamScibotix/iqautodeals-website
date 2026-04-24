import nodemailer from 'nodemailer';

const PROVIDER_SOURCE = 'IQ Auto Deals';
const PROVIDER_URL = 'https://iqautodeals.com';
const PROVIDER_EMAIL = 'leads@iqautodeals.com';
const REPLY_TO = 'noreply@iqautodeals.com';

export interface AdfVehicle {
  year: number;
  make: string;
  model: string;
  vin?: string | null;
  trim?: string | null;
  stock?: string | null;
  mileage?: number | null;
  price?: number | null;
}

export interface AdfCustomer {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  zipCode?: string | null;
  comments?: string | null;
}

export interface AdfVendor {
  name: string;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

export interface AdfLead {
  leadId: string;
  vehicle: AdfVehicle;
  customer: AdfCustomer;
  vendor: AdfVendor;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isoWithOffset(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const tzMin = -date.getTimezoneOffset();
  const sign = tzMin >= 0 ? '+' : '-';
  const abs = Math.abs(tzMin);
  const offset = `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${offset}`;
}

export function buildAdfXml(lead: AdfLead): string {
  const { vehicle: v, customer: c, vendor: d, leadId } = lead;

  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<?ADF VERSION="1.0"?>');
  lines.push('<adf>');
  lines.push('  <prospect status="new">');
  lines.push(`    <id sequence="1" source="${xmlEscape(PROVIDER_SOURCE)}">${xmlEscape(leadId)}</id>`);
  lines.push(`    <requestdate>${isoWithOffset()}</requestdate>`);

  lines.push('    <vehicle interest="buy" status="used">');
  lines.push(`      <year>${v.year}</year>`);
  lines.push(`      <make>${xmlEscape(v.make)}</make>`);
  lines.push(`      <model>${xmlEscape(v.model)}</model>`);
  if (v.trim) lines.push(`      <trim>${xmlEscape(v.trim)}</trim>`);
  if (v.vin) lines.push(`      <vin>${xmlEscape(v.vin)}</vin>`);
  if (v.stock) lines.push(`      <stock>${xmlEscape(v.stock)}</stock>`);
  if (typeof v.mileage === 'number' && v.mileage > 0) {
    lines.push(`      <odometer status="replaced" units="miles">${v.mileage}</odometer>`);
  }
  if (typeof v.price === 'number' && v.price > 0) {
    lines.push(`      <price type="asking" currency="USD">${v.price.toFixed(2)}</price>`);
  }
  lines.push('    </vehicle>');

  lines.push('    <customer>');
  lines.push('      <contact primarycontact="1">');
  lines.push(`        <name part="first">${xmlEscape(c.firstName)}</name>`);
  lines.push(`        <name part="last">${xmlEscape(c.lastName)}</name>`);
  if (c.email) lines.push(`        <email>${xmlEscape(c.email)}</email>`);
  if (c.phone) lines.push(`        <phone type="voice" preferredcontact="1">${xmlEscape(c.phone)}</phone>`);
  if (c.zipCode) {
    lines.push('        <address type="home">');
    lines.push(`          <postalcode>${xmlEscape(c.zipCode)}</postalcode>`);
    lines.push('          <country>US</country>');
    lines.push('        </address>');
  }
  lines.push('      </contact>');
  if (c.comments) lines.push(`      <comments>${xmlEscape(c.comments)}</comments>`);
  lines.push('    </customer>');

  lines.push('    <vendor>');
  lines.push(`      <vendorname>${xmlEscape(d.name)}</vendorname>`);
  if (d.email || d.city || d.state || d.zip) {
    lines.push('      <contact>');
    lines.push(`        <name part="full">${xmlEscape(d.name)}</name>`);
    if (d.email) lines.push(`        <email>${xmlEscape(d.email)}</email>`);
    if (d.city || d.state || d.zip) {
      lines.push('        <address>');
      if (d.city) lines.push(`          <city>${xmlEscape(d.city)}</city>`);
      if (d.state) lines.push(`          <regioncode>${xmlEscape(d.state)}</regioncode>`);
      if (d.zip) lines.push(`          <postalcode>${xmlEscape(d.zip)}</postalcode>`);
      lines.push('          <country>US</country>');
      lines.push('        </address>');
    }
    lines.push('      </contact>');
  }
  lines.push('    </vendor>');

  lines.push('    <provider>');
  lines.push(`      <name part="full">${xmlEscape(PROVIDER_SOURCE)}</name>`);
  lines.push('      <service>Online Used-Car Marketplace</service>');
  lines.push(`      <url>${PROVIDER_URL}</url>`);
  lines.push(`      <email>${PROVIDER_EMAIL}</email>`);
  lines.push('    </provider>');

  lines.push('  </prospect>');
  lines.push('</adf>');

  return lines.join('\n');
}

function createTransporter() {
  const smtpPass = process.env.SMTP_PASS_B64
    ? Buffer.from(process.env.SMTP_PASS_B64, 'base64').toString('utf8')
    : process.env.SMTP_PASS?.trim();

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim(),
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: smtpPass,
    },
    tls: { rejectUnauthorized: false },
  });
}

export async function sendAdfLead(crmEmail: string, lead: AdfLead): Promise<void> {
  const xml = buildAdfXml(lead);
  const subject = `ADF ${lead.vehicle.year} ${lead.vehicle.make} ${lead.vehicle.model} - ${lead.customer.firstName} ${lead.customer.lastName}`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"${PROVIDER_SOURCE}" <${process.env.SMTP_USER || REPLY_TO}>`,
    to: crmEmail,
    replyTo: REPLY_TO,
    subject,
    text: xml,
  });
}
