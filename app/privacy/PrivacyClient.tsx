'use client';

import Link from 'next/link';
import Footer from '../components/Footer';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyClient() {
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
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Privacy Notice</h2>
            </div>
            <p className="text-gray-300">
              Last Updated: January 25, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">

            {/* Table of Contents */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-12">
              <h2 className="text-xl font-bold text-dark mt-0 mb-4">Table of Contents</h2>
              <ol className="list-decimal pl-6 space-y-2 text-primary">
                <li><a href="#privacy-notice" className="hover:underline">Privacy Notice</a></li>
                <li><a href="#information-we-collect" className="hover:underline">Information We Collect About You and How We Collect It</a></li>
                <li><a href="#how-we-use" className="hover:underline">How We Use Your Information</a></li>
                <li><a href="#disclosure" className="hover:underline">Disclosure of Your Information</a></li>
                <li><a href="#protection" className="hover:underline">How We Protect Your Information</a></li>
                <li><a href="#additional-services" className="hover:underline">IQ Auto Deals Additional Services</a></li>
                <li><a href="#cookies" className="hover:underline">Use of Cookies, Web Beacons, and Similar Technologies</a></li>
                <li><a href="#retention" className="hover:underline">Personal Information Retention</a></li>
                <li><a href="#children" className="hover:underline">Children</a></li>
                <li><a href="#external-links" className="hover:underline">External Links</a></li>
                <li><a href="#choices" className="hover:underline">Exercising Your Choices</a></li>
                <li><a href="#changes" className="hover:underline">Changes to this Privacy Notice</a></li>
                <li><a href="#contact" className="hover:underline">Contact Information</a></li>
                <li><a href="#supplemental" className="hover:underline">Supplemental Privacy Notice</a></li>
              </ol>
            </div>

            {/* Section 1: Privacy Notice */}
            <section id="privacy-notice" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">Privacy Notice</h2>
              <p className="text-gray-700">
                Scibotix Solutions LLC ("Scibotix Solutions," "we," "us," or "our") respects your privacy and the information that you have entrusted to us. IQ Auto Deals is a product and service operated by Scibotix Solutions LLC. This Privacy Notice (the "Privacy Notice") describes our information handling practices in connection with the website located at www.iqautodeals.com and any other websites owned or operated by Scibotix Solutions LLC where this Privacy Notice appears ("Site(s)"), and any other services offered through IQ Auto Deals ("Services"). This Privacy Notice does not apply to applicants applying for open positions with Scibotix Solutions LLC.
              </p>
              <p className="text-gray-700">
                This Privacy Notice does not describe our collection, use, and disclosure of information through means other than the Sites (e.g., off-line) or the collection, use, and disclosure practices of any affiliate or other third parties.
              </p>
              <p className="text-gray-700">
                By using the Sites and the Services, you acknowledge that you have read and agree to this Privacy Notice and expressly consent to our data processing as described below, including its information collection. You additionally agree that you are subject to the IQ Auto Deals Terms and Conditions of Use.
              </p>
              <p className="text-gray-700">
                The Privacy Notice is divided into sections for your convenience. If you are a California resident, see our California Notice at Collection. Residents of Colorado, Connecticut, Delaware, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, New Hampshire, Nebraska, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, and Virginia can find information provided pursuant to each state's data protection law in the supplemental privacy notice below. You may request that we not "sell" or "share" your Personal Information by contacting us at support@iqautodeals.com or calling 1-678-313-4597.
              </p>
            </section>

            {/* Section 2: Information We Collect */}
            <section id="information-we-collect" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">1. Information We Collect About You and How We Collect It</h2>

              <h3 className="text-xl font-semibold text-dark mt-6">Information We Collect About You</h3>
              <p className="text-gray-700">
                We may collect both "non-personal" and "personal" information from you when you interact with our Site and Services. For purposes of this notice:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>"Non-Personal Information"</strong> refers to information that may not by itself be reasonably associated with, linked to, or used to individually identify you or someone else.</li>
                <li><strong>"Personal Information"</strong> refers to information that may be reasonably associated with, linked to, or used to individually identify you or allow you to be personally identified or contacted.</li>
                <li><strong>"Sensitive Personal Information"</strong> refers to Personal Information regarding more sensitive areas, which may include financial information, bank account, credit scores, and/or credit card numbers, depending on the applicable law where you reside.</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark mt-6">Personal Information We Collect from You</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg mt-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-dark border-b">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-dark border-b">Examples</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-dark border-b">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium">Contact Information</td>
                      <td className="px-4 py-3">Name, address, email address, phone number, and ZIP code</td>
                      <td className="px-4 py-3">Account creation, deal requests, availability inquiries, test drive scheduling, demo booking</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="px-4 py-3 font-medium">Account Information</td>
                      <td className="px-4 py-3">Online forms, account information, survey responses, communications with support, user type</td>
                      <td className="px-4 py-3">Website functionality, product/service use, personalization</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium">Business Information (Dealers)</td>
                      <td className="px-4 py-3">Business name, business address, city, state, ZIP code, website URL, operating hours</td>
                      <td className="px-4 py-3">Dealer verification, marketplace listing, lead delivery</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="px-4 py-3 font-medium">Vehicle Information</td>
                      <td className="px-4 py-3">VIN, make, model, year, mileage, color, transmission, price, photos, description</td>
                      <td className="px-4 py-3">Vehicle listings, deal requests, marketplace functionality</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium">Usage Information</td>
                      <td className="px-4 py-3">IP address, browser type, device identifier, pages viewed, searches, filter preferences</td>
                      <td className="px-4 py-3">Website functionality, personalization, advertising</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="px-4 py-3 font-medium">Geolocation Information</td>
                      <td className="px-4 py-3">ZIP code, city, state, and coordinates when using location-based services</td>
                      <td className="px-4 py-3">Deal requests, vehicle search, connecting with nearby dealers</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-dark mt-6">How We Collect This Information</h3>
              <p className="text-gray-700"><strong>Directly from you when you provide it to us,</strong> including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>When you create a customer or dealer account</li>
                <li>When you submit a deal request for vehicles</li>
                <li>When you submit a check availability request</li>
                <li>When you schedule a test drive</li>
                <li>When you book a demo (dealers)</li>
                <li>When you use our AI-powered chat feature</li>
              </ul>
              <p className="text-gray-700 mt-4"><strong>From third parties,</strong> including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Our business partners and affiliated platforms</li>
                <li>Dealer inventory feed providers</li>
                <li>Analytics and advertising partners</li>
              </ul>
              <p className="text-gray-700 mt-4"><strong>Automatically as you navigate the Sites,</strong> including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Search queries and filter selections</li>
                <li>Vehicle views and photo gallery interactions</li>
                <li>Page navigation and time spent on pages</li>
                <li>Advertising campaign parameters (UTM codes, click IDs)</li>
              </ul>
            </section>

            {/* Section 3: How We Use Your Information */}
            <section id="how-we-use" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">2. How We Use Your Information</h2>
              <p className="text-gray-700">We may use your Personal Information for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>To facilitate deal requests and connect you with dealers.</strong> If you submit a deal request through the Site, we share your contact information and vehicle selections with participating dealers so they may submit competing offers to you.</li>
                <li><strong>To process availability inquiries.</strong> When you submit a check availability request, we share your information with the relevant dealer to respond to your inquiry.</li>
                <li><strong>To schedule and manage test drives.</strong> We use your information to coordinate test drive appointments between you and dealers.</li>
                <li><strong>To provide targeted advertising</strong> both on the Site and on third-party advertising platforms.</li>
                <li><strong>To engage in data analytics,</strong> including lead scoring, vehicle views, deal submission frequencies, and performance reporting to dealers.</li>
                <li><strong>To deliver marketing communications</strong> via email or SMS, which you have consented to receive.</li>
                <li><strong>To communicate with you regarding the IQ Auto Deals service</strong> (e.g., emails to confirm a deal request, notify you of dealer offers).</li>
                <li><strong>To assist in Site administration, analysis, research, and development,</strong> including AI-powered features.</li>
              </ul>
            </section>

            {/* Section 4: Disclosure */}
            <section id="disclosure" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">3. Disclosure of Your Information</h2>

              <h3 className="text-xl font-semibold text-dark mt-6">Affiliates and Subsidiaries</h3>
              <p className="text-gray-700">Scibotix Solutions LLC may share your Personal Information with affiliates and/or subsidiaries, including the DealerHub platform, in a manner consistent with this Privacy Notice.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">Deal Requests and Availability Inquiries</h3>
              <p className="text-gray-700">If you submit a deal request or availability inquiry through the Site, you agree that we may share Personal Information with third parties as may be necessary to provide such services. For example, if you submit a deal request for vehicles, we will share your contact information (name, email, phone) and vehicle selections with the relevant dealers.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">Service Providers</h3>
              <p className="text-gray-700">We may work with third parties that provide services on our behalf, including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Analytics providers</strong> (PostHog, Vercel Analytics) for website usage analysis</li>
                <li><strong>Cloud storage providers</strong> (Vercel Blob) for photo and file storage</li>
                <li><strong>Email service providers</strong> (Microsoft Office 365) for transactional and marketing emails</li>
                <li><strong>AI service providers</strong> (Google Gemini) for chat functionality and content generation</li>
                <li><strong>Calendar service providers</strong> (Google Calendar) for demo booking and scheduling</li>
                <li><strong>Advertising platforms</strong> (Google Ads) for conversion tracking and targeted advertising</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark mt-6">Other Requirements</h3>
              <p className="text-gray-700">Scibotix Solutions LLC expressly reserves the right to release Personal Information under the following circumstances:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>When required by law or legal process</li>
                <li>To investigate illegal activity, suspected abuse, or unauthorized use of the Site</li>
                <li>To protect the property or safety of our users or others</li>
                <li>To enforce our Terms and Conditions of Use</li>
                <li>In connection with any sale or transfer of ownership of Scibotix Solutions LLC or IQ Auto Deals</li>
              </ul>
            </section>

            {/* Section 5: Protection */}
            <section id="protection" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">4. How We Protect Your Information</h2>
              <p className="text-gray-700">We use reasonable administrative, technical, and physical safeguards to protect your Personal Information, including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Password Protection:</strong> All passwords are securely hashed using bcrypt before storage. We never store passwords in plaintext.</li>
                <li><strong>Secure Transmission:</strong> All data transmitted between your browser and our servers is encrypted using HTTPS/TLS.</li>
                <li><strong>Database Security:</strong> Our database connections use SSL/TLS encryption, and we use a cloud-hosted PostgreSQL database with industry-standard security measures.</li>
                <li><strong>Access Controls:</strong> We limit access to Personal Information to employees, contractors, and agents who need that information to process it for us.</li>
              </ul>
            </section>

            {/* Section 6: Additional Services */}
            <section id="additional-services" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">5. IQ Auto Deals Additional Services</h2>

              <h3 className="text-xl font-semibold text-dark mt-6">Deal List Feature</h3>
              <p className="text-gray-700">IQ Auto Deals offers you the ability to select up to four (4) vehicles and submit them as a "Deal List" to receive competing offers from dealers. You acknowledge that when you submit a Deal List, your contact information (name, email, phone) will be shared with the dealers associated with the selected vehicles.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">Check Availability Requests</h3>
              <p className="text-gray-700">When you submit an availability request, your contact information and inquiry details will be shared with the relevant dealer.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">AI Chat Feature</h3>
              <p className="text-gray-700">IQ Auto Deals offers an AI-powered chat feature to assist you with vehicle searches. Messages you send through this feature are processed by Google's Gemini AI service. Chat conversations are not permanently stored on our servers, though they may be temporarily processed to provide responses.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">Dealer Demo Booking</h3>
              <p className="text-gray-700">If you book a demo, your contact information (name, email, phone, dealership name) will be used to create calendar events and send meeting invitations via Google Calendar.</p>
            </section>

            {/* Section 7: Cookies */}
            <section id="cookies" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">6. Use of Cookies, Web Beacons, and Similar Technologies</h2>
              <p className="text-gray-700">We use cookies, pixels, and similar technologies as automatic data collection mechanisms. Third parties also place these tools on our Website for security, analytics, and targeted advertising.</p>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg mt-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-dark border-b">Technology</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-dark border-b">Purpose</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-dark border-b">Provider</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium">Analytics Cookies</td>
                      <td className="px-4 py-3">Track website usage, page views, user journeys</td>
                      <td className="px-4 py-3">PostHog, Vercel Analytics</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="px-4 py-3 font-medium">Advertising Cookies</td>
                      <td className="px-4 py-3">Track conversions, enable targeted advertising</td>
                      <td className="px-4 py-3">Google Ads</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium">Functional Cookies</td>
                      <td className="px-4 py-3">Remember preferences and login status</td>
                      <td className="px-4 py-3">IQ Auto Deals</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 8: Retention */}
            <section id="retention" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">7. Personal Information Retention</h2>
              <p className="text-gray-700">We will only retain your Personal Information for as long as necessary to fulfill the purposes for which we collected it, including as required to satisfy legal, accounting, or reporting requirements.</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
                <li><strong>Account Information:</strong> Retained for as long as your account is active and for a reasonable period thereafter</li>
                <li><strong>Deal Request Data:</strong> Retained for reporting and analytics purposes</li>
                <li><strong>Password Reset Tokens:</strong> Automatically expire after a set period</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700 font-medium">Requesting Data Deletion:</p>
                <p className="text-gray-700">To request deletion of your Personal Information, please contact us at <a href="mailto:support@iqautodeals.com" className="text-primary hover:underline">support@iqautodeals.com</a> or call <a href="tel:1-678-313-4597" className="text-primary hover:underline">1-678-313-4597</a>. We will process your request in accordance with applicable law.</p>
              </div>
            </section>

            {/* Section 9: Children */}
            <section id="children" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">8. Children</h2>
              <p className="text-gray-700">IQ Auto Deals does not knowingly collect or use any Personal Information from children under the age of 18. No information should be submitted to IQ Auto Deals by visitors younger than 18 years old. If you are a parent or legal guardian and believe your child under 18 has given us Personal Information, you can email us at <a href="mailto:support@iqautodeals.com" className="text-primary hover:underline">support@iqautodeals.com</a>.</p>
            </section>

            {/* Section 10: External Links */}
            <section id="external-links" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">9. External Links</h2>
              <p className="text-gray-700">The Sites may contain links to other websites, including dealer websites and third-party services. IQ Auto Deals is not responsible for the websites, content, or privacy practices of any third party. Please see the privacy policies of third-party websites to understand their practices for handling your information.</p>
            </section>

            {/* Section 11: Choices */}
            <section id="choices" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">10. Exercising Your Choices</h2>

              <h3 className="text-xl font-semibold text-dark mt-6">Promotional Messages</h3>
              <p className="text-gray-700">You can opt-out of receiving our marketing emails by following the instructions in any promotional message or by contacting us. We will still send you transactional messages about your deal requests.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">Cookies</h3>
              <p className="text-gray-700">You can disable cookies by changing your browser settings. However, this may affect how the Site functions.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">Analytics Opt-Out</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Contact us at <a href="mailto:support@iqautodeals.com" className="text-primary hover:underline">support@iqautodeals.com</a> to request opt-out from analytics tracking</li>
                <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout/</a></li>
              </ul>

              <p className="text-gray-700 mt-4">You may make any privacy requests by emailing <a href="mailto:support@iqautodeals.com" className="text-primary hover:underline">support@iqautodeals.com</a> or calling <a href="tel:1-678-313-4597" className="text-primary hover:underline">1-678-313-4597</a>.</p>
            </section>

            {/* Section 12: Changes */}
            <section id="changes" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">11. Changes to this Privacy Notice</h2>
              <p className="text-gray-700">We reserve the right to update and periodically amend this Privacy Notice at our discretion and at any time. If we make changes, such changes will be posted on our Site. Your continued use of the Site after any such update indicates your agreement to the same.</p>
            </section>

            {/* Section 13: Contact */}
            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">12. Contact Information</h2>
              <p className="text-gray-700">If you have any questions about this Privacy Notice or wish to exercise your rights, please contact us:</p>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold text-dark">Phone:</p>
                    <p className="text-gray-700"><a href="tel:1-678-313-4597" className="text-primary hover:underline">1-678-313-4597</a></p>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Privacy Email:</p>
                    <p className="text-gray-700"><a href="mailto:support@iqautodeals.com" className="text-primary hover:underline">support@iqautodeals.com</a></p>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">General Support:</p>
                    <p className="text-gray-700"><a href="mailto:support@iqautodeals.com" className="text-primary hover:underline">support@iqautodeals.com</a></p>
                  </div>
                  <div>
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

            {/* Section 14: Supplemental */}
            <section id="supplemental" className="mb-12">
              <h2 className="text-2xl font-bold text-dark border-b border-gray-200 pb-2">13. Supplemental Privacy Notice</h2>
              <p className="text-gray-500 text-sm mb-4">Section last updated January 25, 2026</p>

              <p className="text-gray-700">If you reside in California, Colorado, Connecticut, Delaware, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Nevada, Oregon, Rhode Island, Tennessee, Texas, Utah, Virginia, or Canada, this section applies to you and supplements our Privacy Notice.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">California</h3>
              <p className="text-gray-700">California residents have the following rights under the CCPA/CPRA:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Right to Know:</strong> Request disclosure of Personal Information collected</li>
                <li><strong>Right to Delete:</strong> Request deletion of your Personal Information</li>
                <li><strong>Right to Correct:</strong> Request correction of inaccurate Personal Information</li>
                <li><strong>Right to Opt-Out:</strong> Opt-out of the sale or sharing of Personal Information</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your rights</li>
              </ul>
              <p className="text-gray-700 mt-4">You can opt out of the sale or sharing of your Personal Information by contacting us at <a href="mailto:support@iqautodeals.com" className="text-primary hover:underline">support@iqautodeals.com</a> or calling <a href="tel:1-678-313-4597" className="text-primary hover:underline">1-678-313-4597</a>.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">Colorado, Connecticut, Virginia, and Other States</h3>
              <p className="text-gray-700">Residents of these states generally have the following rights:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Right to Access:</strong> Confirm whether we process your personal information and access it</li>
                <li><strong>Right to Correct:</strong> Correct inaccuracies in your personal information</li>
                <li><strong>Right to Delete:</strong> Delete your personal information</li>
                <li><strong>Right to Data Portability:</strong> Obtain your data in a portable format</li>
                <li><strong>Right to Opt Out:</strong> Opt out of targeted advertising and sale of personal information</li>
                <li><strong>Right to Appeal:</strong> Appeal our decision on your privacy request</li>
              </ul>

              <h3 className="text-xl font-semibold text-dark mt-6">Canada</h3>
              <p className="text-gray-700">Canadian residents have the right to request access to and correction of Personal Information. We may process, store, and transfer your Personal Information in the United States. By using our Services, you consent to this transfer.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">Other International Residents</h3>
              <p className="text-gray-700">This Site and Services are intended for use solely in the United States and Canada. IQ Auto Deals does not knowingly collect Personal Information from residents of the European Union, United Kingdom, Switzerland, or other jurisdictions outside the U.S. and Canada.</p>

              <h3 className="text-xl font-semibold text-dark mt-6">Exercising Your Rights</h3>
              <p className="text-gray-700">To exercise your rights, please contact us via <a href="tel:1-678-313-4597" className="text-primary hover:underline">1-678-313-4597</a> or <a href="mailto:support@iqautodeals.com" className="text-primary hover:underline">support@iqautodeals.com</a>. We will respond within 45 days of receipt.</p>
            </section>

            {/* Effective Date */}
            <div className="text-center text-gray-500 border-t border-gray-200 pt-8 mt-12">
              <p>This Privacy Notice is effective as of January 25, 2026.</p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
