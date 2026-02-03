import { Metadata } from 'next';
import { Suspense } from 'react';
import ForgotPasswordClient from './ForgotPasswordClient';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Reset Password - IQ Auto Deals',
  description: 'Reset your IQ Auto Deals account password. Enter your email to receive password reset instructions.',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="sr-only">
        <h1>Reset Your IQ Auto Deals Password</h1>
        <p>Forgot your password? No problem. Enter your email address and we will send you instructions to reset your password and regain access to your IQ Auto Deals account.</p>
        <h2>How Password Reset Works</h2>
        <ol>
          <li>Enter the email address associated with your IQ Auto Deals account</li>
          <li>Click the Send Reset Instructions button</li>
          <li>Check your email inbox for a message from IQ Auto Deals</li>
          <li>Click the secure link in the email to create a new password</li>
          <li>Sign in with your new password and continue your car buying journey</li>
        </ol>
        <h2>Did Not Receive the Email?</h2>
        <p>If you do not receive the password reset email within a few minutes, please check your spam or junk folder. Make sure you entered the correct email address that you used when creating your account. If you continue to have issues, contact our support team for assistance.</p>
        <h2>Account Security</h2>
        <p>IQ Auto Deals takes your account security seriously. Password reset links expire after 24 hours for your protection. We recommend using a strong, unique password that you do not use on other websites. Never share your password with anyone.</p>
        <h2>Need More Help?</h2>
        <p>If you are having trouble accessing your account or did not create an account with this email address, please contact our customer support team. We are here to help you get back to browsing quality vehicles from certified dealers nationwide.</p>
      </div>
      <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center">Loading...</div>}>
        <ForgotPasswordClient />
      </Suspense>
    </>
  );
}
