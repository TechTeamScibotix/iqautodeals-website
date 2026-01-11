/**
 * Admin Authentication Helper
 * Validates admin access for API routes
 */

// Admin emails - should match the ones in app/admin/layout.tsx
const ADMIN_EMAILS = [
  'techteam@scibotixsolutions.com',
  'admin@iqautodeals.com',
  'joe@scibotixsolutions.com',
];

/**
 * Check if an email is an admin email
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.some(
    adminEmail => adminEmail.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Get admin emails list
 */
export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS];
}
