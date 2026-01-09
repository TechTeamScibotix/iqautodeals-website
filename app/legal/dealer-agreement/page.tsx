'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DealerAgreementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dark shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              IQ Auto Deals
            </Link>
            <Link href="/register?type=dealer" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
              Dealer Sign Up
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-2">Dealer Services Agreement</h1>
          <p className="text-gray-500 mb-8">Last Updated: January 9, 2026</p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg font-medium text-dark">
              This Dealer Services Agreement ("Agreement") is entered into between IQ Auto Deals, a service of Scibotix Solutions LLC ("Company," "we," "us," or "our"), and the automotive dealership ("Dealer," "you," or "your") agreeing to these terms.
            </p>

            <hr className="my-8" />

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">1. Service Overview</h2>
            <p>
              IQ Auto Deals provides an online automotive marketplace platform that connects licensed automotive dealers with consumers seeking to purchase vehicles. Our platform enables dealers to list their inventory, receive purchase inquiries, and connect with qualified buyers.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">2. Subscription Terms</h2>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">2.1 Month-to-Month Agreement</h3>
            <p>
              This Agreement operates on a <strong>month-to-month basis</strong>. There is no long-term commitment required. Your subscription automatically renews each month until cancelled by either party.
            </p>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">2.2 Billing Cycle</h3>
            <p>
              Subscription fees are billed monthly in advance on the same date each month as your initial subscription date. All fees are non-refundable except as expressly provided in this Agreement.
            </p>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">2.3 Cancellation</h3>
            <p>
              Either party may cancel this Agreement at any time with <strong>written notice</strong>. Cancellation will be effective at the end of the current billing cycle. To cancel, contact us at <a href="mailto:dealers@iqautodeals.com" className="text-primary hover:underline">dealers@iqautodeals.com</a> or through your dealer dashboard.
            </p>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">2.4 Free Trial</h3>
            <p>
              New dealers may be eligible for a complimentary trial period. During the trial, you will have full access to platform features. At the end of the trial period, your subscription will automatically convert to a paid subscription unless cancelled.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">3. Inventory Integration Options</h2>
            <p>
              We offer multiple methods to import and manage your vehicle inventory on our platform:
            </p>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.1 Website Import (Automated Sync)</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
              <p className="mb-2">
                <strong>Quick Inventory Exposure:</strong> We can automatically import your inventory directly from your existing dealership website. This option provides:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Automated daily synchronization of your inventory</li>
                <li>No manual data entry required</li>
                <li>Vehicle details, photos, and pricing pulled directly from your site</li>
                <li>Immediate exposure to our buyer network</li>
                <li>Automatic removal of sold vehicles</li>
              </ul>
              <p className="mt-3 text-sm text-gray-600">
                Supported platforms include DealerOn, Dealer.com, DealerInspire, and most major dealership website providers. Contact us to verify compatibility with your website platform.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.2 DMS/IMS Direct Integration</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
              <p className="mb-2">
                <strong>Enterprise Integration:</strong> For dealerships seeking deeper integration, we offer direct connectivity with your Dealer Management System (DMS) or Inventory Management System (IMS):
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Real-time inventory synchronization</li>
                <li>Direct API integration with major DMS providers</li>
                <li>Supported systems: DealerTrack, CDK Global, Reynolds & Reynolds, vAuto, HomeNet, DealerSocket</li>
                <li>Custom integration available upon request</li>
                <li>Automatic price and status updates</li>
                <li>Enhanced vehicle data including history reports and certifications</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.3 Manual Entry</h3>
            <p>
              Dealers may also manually add, edit, and manage individual vehicle listings through the dealer dashboard. VIN decoding is provided to streamline the listing process.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">4. Dealer Obligations</h2>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">4.1 Licensing Requirements</h3>
            <p>
              Dealer represents and warrants that it is a licensed automotive dealer in good standing in all jurisdictions where it conducts business. Dealer agrees to maintain all required licenses throughout the term of this Agreement.
            </p>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">4.2 Inventory Accuracy</h3>
            <p>
              Dealer is responsible for ensuring that all vehicle listings are accurate, current, and comply with all applicable laws and regulations. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Accurate vehicle descriptions, specifications, and conditions</li>
              <li>Current and truthful pricing information</li>
              <li>Timely removal or update of sold or unavailable vehicles</li>
              <li>Authentic photographs of actual vehicles</li>
              <li>Disclosure of any material defects, accidents, or title issues</li>
            </ul>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">4.3 Customer Interactions</h3>
            <p>
              Dealer agrees to respond to customer inquiries in a timely and professional manner. Dealer shall honor all pricing and offers submitted through the platform, subject to vehicle availability.
            </p>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">4.4 Compliance</h3>
            <p>
              Dealer agrees to comply with all applicable federal, state, and local laws and regulations, including but not limited to FTC regulations, state consumer protection laws, and advertising guidelines.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">5. Platform Features</h2>
            <p>
              Subject to the terms of this Agreement and payment of applicable fees, Dealer shall have access to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Vehicle listing and inventory management tools</li>
              <li>Customer lead management dashboard</li>
              <li>Deal request and negotiation system</li>
              <li>Analytics and performance reporting</li>
              <li>Customer communication tools</li>
              <li>Integration with Scibotix Dealer Portal (Vynalytics, ShowRoom AI, etc.)</li>
            </ul>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">6. Fees and Payment</h2>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.1 Subscription Fees</h3>
            <p>
              Dealer agrees to pay the monthly subscription fee according to the selected plan (Silver, Gold, or Platinum). Current pricing is available at <Link href="/pricing" className="text-primary hover:underline">iqautodeals.com/pricing</Link> or upon request.
            </p>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.2 Payment Method</h3>
            <p>
              Dealer shall provide a valid credit card or bank account for automatic monthly payments. Dealer authorizes Company to charge the provided payment method for all applicable fees.
            </p>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.3 Late Payment</h3>
            <p>
              If payment is not received within ten (10) days of the due date, Company reserves the right to suspend Dealer's account until payment is received. Continued non-payment may result in termination of this Agreement.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">7. Intellectual Property</h2>
            <p>
              Dealer grants Company a non-exclusive, royalty-free license to use, display, and distribute Dealer's vehicle listings, photographs, and related content on the platform and in marketing materials. Dealer represents that it has the right to grant such license.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, COMPANY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO THIS AGREEMENT OR THE USE OF THE PLATFORM.
            </p>
            <p className="mt-4">
              Company's total liability under this Agreement shall not exceed the amount of fees paid by Dealer in the twelve (12) months preceding the claim.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">9. Indemnification</h2>
            <p>
              Dealer agrees to indemnify, defend, and hold harmless Company and its officers, directors, employees, and agents from and against any claims, damages, losses, or expenses arising out of or related to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Dealer's breach of this Agreement</li>
              <li>Dealer's violation of any applicable law or regulation</li>
              <li>Any claims related to vehicles sold through the platform</li>
              <li>Any disputes with customers or other dealers</li>
            </ul>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">10. Termination</h2>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">10.1 Termination for Convenience</h3>
            <p>
              Either party may terminate this Agreement for any reason with thirty (30) days written notice. Termination will be effective at the end of the current billing cycle.
            </p>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">10.2 Termination for Cause</h3>
            <p>
              Company may terminate this Agreement immediately if Dealer:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violates any material term of this Agreement</li>
              <li>Engages in fraudulent or illegal activity</li>
              <li>Fails to maintain required dealer licenses</li>
              <li>Receives excessive customer complaints</li>
              <li>Fails to pay fees when due</li>
            </ul>

            <h3 className="text-xl font-semibold text-dark mt-6 mb-3">10.3 Effect of Termination</h3>
            <p>
              Upon termination, Dealer's access to the platform will be disabled, and all vehicle listings will be removed. Dealer remains responsible for any fees incurred prior to termination.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">11. Data and Privacy</h2>
            <p>
              Company will handle Dealer's data and customer information in accordance with our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. Dealer agrees to comply with all applicable data protection laws in its use of customer information obtained through the platform.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">12. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any proprietary or sensitive business information disclosed during the course of this Agreement. This obligation survives termination of the Agreement.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">13. Modifications</h2>
            <p>
              Company reserves the right to modify this Agreement at any time. Dealer will be notified of material changes at least thirty (30) days in advance. Continued use of the platform after such notice constitutes acceptance of the modified terms.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">14. Governing Law</h2>
            <p>
              This Agreement shall be governed by and construed in accordance with the laws of the State of Georgia, without regard to its conflict of law provisions. Any disputes arising under this Agreement shall be resolved in the state or federal courts located in Fulton County, Georgia.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">15. Entire Agreement</h2>
            <p>
              This Agreement, together with any applicable order forms or addenda, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous agreements, representations, or understandings.
            </p>

            <h2 className="text-2xl font-bold text-dark mt-8 mb-4">16. Contact Information</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
              <p className="font-semibold text-dark">IQ Auto Deals - Dealer Support</p>
              <p>A service of Scibotix Solutions LLC</p>
              <p className="mt-2">
                Email: <a href="mailto:dealers@iqautodeals.com" className="text-primary hover:underline">dealers@iqautodeals.com</a>
              </p>
              <p>
                Website: <a href="https://iqautodeals.com" className="text-primary hover:underline">iqautodeals.com</a>
              </p>
            </div>

            <hr className="my-8" />

            <p className="text-sm text-gray-500">
              By registering as a dealer on IQ Auto Deals, you acknowledge that you have read, understood, and agree to be bound by this Dealer Services Agreement.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/register?type=dealer"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Register as a Dealer
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} IQ Auto Deals. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/legal/dealer-agreement" className="hover:text-white transition-colors">Dealer Agreement</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
