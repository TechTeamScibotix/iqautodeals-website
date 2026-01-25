'use client';

import Link from 'next/link';

interface TCPAConsentProps {
  /** The action that triggers consent (e.g., "Check Availability", "Sign Up", "Schedule Test Drive") */
  actionText: string;
  /** Optional: Specify the dealer/seller name for customer-facing forms */
  sellerName?: string;
  /** Optional: Whether this is for dealers (changes the wording slightly) */
  isDealer?: boolean;
  /** Optional: Additional class names */
  className?: string;
}

/**
 * TCPA (Telephone Consumer Protection Act) Consent Disclaimer
 * Required for compliance with FCC regulations regarding text/call marketing
 */
export default function TCPAConsent({
  actionText,
  sellerName,
  isDealer = false,
  className = ''
}: TCPAConsentProps) {
  if (isDealer) {
    // Dealer registration consent
    return (
      <p className={`text-xs text-gray-500 leading-relaxed ${className}`}>
        By clicking &quot;{actionText}&quot;, you authorize IQ Auto Deals and its partners to contact you by
        text/calls which may include marketing and may be by autodialer. Calls may be prerecorded.
        You also agree to our{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>
        . Consent is not required to use our services. Message & data rates may apply.
      </p>
    );
  }

  // Customer-facing consent (Check Availability, Test Drive, Registration)
  return (
    <p className={`text-xs text-gray-500 leading-relaxed ${className}`}>
      By clicking &quot;{actionText}&quot;, you authorize IQ Auto Deals
      {sellerName ? ` and ${sellerName}` : ' and its sellers/partners'} to contact you by
      text/calls which may include marketing and may be by autodialer. Calls may be prerecorded.
      You also agree to our{' '}
      <Link href="/privacy" className="text-primary hover:underline">
        Privacy Policy
      </Link>
      . Consent is not required to purchase goods/services. Message & data rates may apply.
    </p>
  );
}
