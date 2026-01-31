'use client';

import Link from 'next/link';
import Footer from '../components/Footer';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black shadow-md sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
          </Link>
          <nav className="hidden lg:flex gap-6 text-sm font-semibold">
            <Link href="/cars" className="text-gray-300 hover:text-primary transition-colors">
              Cars for Sale
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors">
              Blog
            </Link>
          </nav>
          <div className="flex gap-3">
            <Link href="/login" className="text-gray-300 hover:text-primary px-5 py-2.5 rounded-lg transition-colors font-semibold">
              Sign In
            </Link>
            <Link href="/register" className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary p-3 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Terms and Conditions of Use</h1>
            </div>
            <p className="text-gray-300">
              Last Updated: January 25, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">

            {/* Table of Contents */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-12">
              <h2 className="text-xl font-bold text-dark mt-0 mb-4">Table of Contents</h2>
              <ol className="list-decimal pl-6 space-y-2 text-primary">
                <li><a href="#acceptance" className="hover:underline">Acceptance of Terms</a></li>
                <li><a href="#eligibility" className="hover:underline">Eligibility</a></li>
                <li><a href="#account" className="hover:underline">Account Registration</a></li>
                <li><a href="#services" className="hover:underline">Description of Services</a></li>
                <li><a href="#customer-terms" className="hover:underline">Terms for Customers (Car Buyers)</a></li>
                <li><a href="#dealer-terms" className="hover:underline">Terms for Dealers</a></li>
                <li><a href="#prohibited" className="hover:underline">Prohibited Activities</a></li>
                <li><a href="#intellectual-property" className="hover:underline">Intellectual Property</a></li>
                <li><a href="#disclaimers" className="hover:underline">Disclaimers</a></li>
                <li><a href="#limitation" className="hover:underline">Limitation of Liability</a></li>
                <li><a href="#indemnification" className="hover:underline">Indemnification</a></li>
                <li><a href="#termination" className="hover:underline">Termination</a></li>
                <li><a href="#governing-law" className="hover:underline">Governing Law</a></li>
                <li><a href="#changes" className="hover:underline">Changes to Terms</a></li>
                <li><a href="#contact" className="hover:underline">Contact Information</a></li>
              </ol>
            </div>

            {/* Section 1: Acceptance */}
            <section id="acceptance" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                Welcome to IQ Auto Deals, a service operated by Scibotix Solutions LLC ("Scibotix Solutions," "we," "us," or "our"). By accessing or using the website located at www.iqautodeals.com (the "Site") and any services offered through the Site (collectively, the "Services"), you agree to be bound by these Terms and Conditions of Use (the "Terms").
              </p>
              <p className="text-gray-700">
                If you do not agree to these Terms, you must not access or use the Site or Services. These Terms constitute a legally binding agreement between you and Scibotix Solutions LLC.
              </p>
              <p className="text-gray-700">
                Please also review our <Link href="/privacy" className="text-primary hover:underline">Privacy Notice</Link>, which describes how we collect, use, and share your information.
              </p>
            </section>

            {/* Section 2: Eligibility */}
            <section id="eligibility" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">2. Eligibility</h2>
              <p className="text-gray-700">
                You must be at least 18 years of age to use the Site and Services. By using the Site, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You are not prohibited from using the Site under any applicable law</li>
                <li>If you are a dealer, you are a licensed automotive dealer in good standing in your jurisdiction</li>
              </ul>
            </section>

            {/* Section 3: Account */}
            <section id="account" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">3. Account Registration</h2>
              <p className="text-gray-700">
                To access certain features of the Services, you must create an account. When you create an account, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password confidential and secure</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized access or use of your account</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We reserve the right to suspend or terminate your account at any time for any reason, including violation of these Terms.
              </p>
            </section>

            {/* Section 4: Services */}
            <section id="services" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">4. Description of Services</h2>
              <p className="text-gray-700">
                IQ Auto Deals is an online automotive marketplace that connects car buyers with certified dealers. Our Services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Vehicle Search:</strong> Browse used car listings from certified dealers</li>
                <li><strong>Deal List Feature:</strong> Select up to 4 vehicles and receive competing offers from dealers</li>
                <li><strong>Check Availability:</strong> Inquire about specific vehicles</li>
                <li><strong>Test Drive Scheduling:</strong> Schedule test drives for accepted deals</li>
                <li><strong>Dealer Portal:</strong> Tools for dealers to manage inventory and respond to customer requests</li>
                <li><strong>AI Chat:</strong> AI-powered assistance for vehicle searches</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Important:</strong> IQ Auto Deals is a marketplace platform only. We do not own, sell, lease, or finance vehicles. All vehicle transactions are between you and the dealer. We are not a party to any vehicle purchase agreement.
              </p>
            </section>

            {/* Section 5: Customer Terms */}
            <section id="customer-terms" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">5. Terms for Customers (Car Buyers)</h2>

              <h3 className="text-xl font-semibold text-dark mt-6">Deal Requests</h3>
              <p className="text-gray-700">When you submit a deal request:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You authorize us to share your contact information with relevant dealers</li>
                <li>You understand that dealers may contact you regarding your request</li>
                <li>You acknowledge that dealer offers are not guaranteed and may change</li>
                <li>You understand that accepting an offer does not constitute a binding purchase agreement until you complete the transaction at the dealership</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark mt-6">No Purchase Obligation</h3>
              <p className="text-gray-700">
                Using the Site does not obligate you to purchase any vehicle. You are free to accept or decline any dealer offer at your sole discretion.
              </p>

              <h3 className="text-xl font-semibold text-dark mt-6">Vehicle Information</h3>
              <p className="text-gray-700">
                Vehicle information, including prices, specifications, and availability, is provided by dealers and may contain errors. We recommend verifying all information directly with the dealer before making a purchase decision.
              </p>
            </section>

            {/* Section 6: Dealer Terms */}
            <section id="dealer-terms" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">6. Terms for Dealers</h2>

              <h3 className="text-xl font-semibold text-dark mt-6">Dealer Requirements</h3>
              <p className="text-gray-700">As a dealer on IQ Auto Deals, you represent and warrant that:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You are a licensed automotive dealer in good standing</li>
                <li>All vehicles you list are legally available for sale</li>
                <li>All vehicle information you provide is accurate and complete</li>
                <li>You have the authority to sell the vehicles you list</li>
                <li>You will honor offers submitted through the platform (subject to vehicle availability)</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark mt-6">Listing Accuracy</h3>
              <p className="text-gray-700">
                You are solely responsible for the accuracy of your vehicle listings, including prices, descriptions, photos, and availability. Misleading or inaccurate listings may result in account suspension or termination.
              </p>

              <h3 className="text-xl font-semibold text-dark mt-6">Lead Handling</h3>
              <p className="text-gray-700">
                You agree to respond to customer inquiries in a timely and professional manner. Customer information received through the platform must be handled in accordance with applicable privacy laws.
              </p>

              <h3 className="text-xl font-semibold text-dark mt-6">Fees</h3>
              <p className="text-gray-700">
                Dealer subscription fees and terms are as agreed upon during registration. We reserve the right to modify fees with 30 days notice.
              </p>
            </section>

            {/* Section 7: Prohibited */}
            <section id="prohibited" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">7. Prohibited Activities</h2>
              <p className="text-gray-700">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide false or misleading information</li>
                <li>Use the Site for any illegal purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to the Site or other users' accounts</li>
                <li>Use automated means to access the Site without our permission</li>
                <li>Interfere with the proper functioning of the Site</li>
                <li>Copy, modify, or distribute Site content without permission</li>
                <li>Use the Site to send spam or unsolicited communications</li>
                <li>Impersonate any person or entity</li>
                <li>Circumvent any security measures</li>
              </ul>
            </section>

            {/* Section 8: IP */}
            <section id="intellectual-property" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">8. Intellectual Property</h2>
              <p className="text-gray-700">
                The Site and its contents, including but not limited to text, graphics, logos, images, and software, are the property of Scibotix Solutions LLC or its licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700">
                You are granted a limited, non-exclusive, non-transferable license to access and use the Site for personal, non-commercial purposes. This license does not include the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Modify or copy Site content</li>
                <li>Use Site content for commercial purposes</li>
                <li>Remove any copyright or proprietary notices</li>
                <li>Transfer the content to another person or "mirror" the content on any other server</li>
              </ul>
            </section>

            {/* Section 9: Disclaimers */}
            <section id="disclaimers" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">9. Disclaimers</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700 font-medium">THE SITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.</p>
              </div>
              <p className="text-gray-700 mt-4">We disclaim all warranties, including but not limited to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
                <li>Warranties that the Site will be uninterrupted, error-free, or secure</li>
                <li>Warranties regarding the accuracy or completeness of vehicle listings</li>
                <li>Warranties regarding the conduct of dealers or other users</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Vehicle Disclaimer:</strong> We do not inspect, certify, or guarantee any vehicles listed on the Site. All vehicle information is provided by dealers. You should conduct your own due diligence before purchasing any vehicle.
              </p>
            </section>

            {/* Section 10: Limitation */}
            <section id="limitation" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">10. Limitation of Liability</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SCIBOTIX SOLUTIONS LLC AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR SERVICES.
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                Our total liability for any claims arising from your use of the Site or Services shall not exceed the amount you paid to us, if any, in the twelve (12) months preceding the claim.
              </p>
            </section>

            {/* Section 11: Indemnification */}
            <section id="indemnification" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">11. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify, defend, and hold harmless Scibotix Solutions LLC, its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or related to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Your use of the Site or Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any content you submit to the Site</li>
              </ul>
            </section>

            {/* Section 12: Termination */}
            <section id="termination" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">12. Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your access to the Site and Services at any time, with or without cause, with or without notice. Upon termination:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Your right to use the Site and Services will immediately cease</li>
                <li>Any provisions of these Terms that by their nature should survive termination shall survive</li>
                <li>We may delete your account and all associated data</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You may terminate your account at any time by contacting us at support@iqautodeals.com.
              </p>
            </section>

            {/* Section 13: Governing Law */}
            <section id="governing-law" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">13. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of the State of Georgia, United States, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700">
                Any disputes arising under these Terms shall be resolved in the state or federal courts located in Fulton County, Georgia, and you consent to the personal jurisdiction of such courts.
              </p>
            </section>

            {/* Section 14: Changes */}
            <section id="changes" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">14. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. If we make material changes, we will notify you by posting the updated Terms on the Site and updating the "Last Updated" date.
              </p>
              <p className="text-gray-700">
                Your continued use of the Site after any changes indicates your acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Site.
              </p>
            </section>

            {/* Section 15: Contact */}
            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">15. Contact Information</h2>
              <p className="text-gray-700">If you have any questions about these Terms, please contact us:</p>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold text-dark">Phone:</p>
                    <p className="text-gray-700"><a href="tel:1-678-313-4597" className="text-primary hover:underline">1-678-313-4597</a></p>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Email:</p>
                    <p className="text-gray-700"><a href="mailto:support@iqautodeals.com" className="text-primary hover:underline">support@iqautodeals.com</a></p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-semibold text-dark">Mailing Address:</p>
                    <p className="text-gray-700">
                      Scibotix Solutions LLC<br />
                      (DBA IQ Auto Deals)<br />
                      345 W Washington Ave Ste 301<br />
                      Madison, WI 53703<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Effective Date */}
            <div className="text-center text-gray-500 border-t border-gray-200 pt-8 mt-12">
              <p>These Terms and Conditions are effective as of January 25, 2026.</p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
