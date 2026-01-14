'use client';

import Link from 'next/link';
import { ArrowLeft, Code, Database, Zap, Shield, BookOpen, Download, Terminal, FileCode, UserPlus } from 'lucide-react';
import { LogoWithBeam } from '@/components/LogoWithBeam';

export default function DealerIntegration() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200 h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full" variant="dark" />
          </Link>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4">
              For Enterprise Dealers
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Dealer API Integration
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Programmatically manage your entire inventory with our powerful RESTful API.
              Perfect for dealerships with 50+ vehicles.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#documentation"
                className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                View Documentation
              </a>
              <a
                href="/API_DOCUMENTATION.md"
                download
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download API Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Why Use Our API?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">High Performance</h3>
                <p className="text-gray-600">10,000 requests/hour for enterprise dealers</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bulk Operations</h3>
                <p className="text-gray-600">Add, update, delete hundreds of vehicles at once</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">TLS 1.3 encryption, GDPR & CCPA compliant</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">RESTful JSON</h3>
                <p className="text-gray-600">Simple, standard REST API with JSON responses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Quick Start</h2>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Authenticate & Get Your Dealer ID</h3>
                    <p className="text-gray-600 mb-4">Login with your dealer credentials. Save the user.id - that&apos;s your dealer ID!</p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">
                        <span className="text-blue-400">POST</span> https://iqautodeals.com/api/auth/login<br/>
                        <br/>
                        {'{'}<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"email"</span>: <span className="text-yellow-300">"dealer@dealership.com"</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"password"</span>: <span className="text-yellow-300">"your_password"</span><br/>
                        {'}'}<br/>
                        <br/>
                        <span className="text-gray-500">// Response - Save the user.id!</span><br/>
                        {'{'}<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"user"</span>: {'{'}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"id"</span>: <span className="text-yellow-300">"550e8400-e29b-41d4-a716..."</span>, <span className="text-gray-500">← Your Dealer ID</span><br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"email"</span>: <span className="text-yellow-300">"dealer@dealership.com"</span>,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-400">"userType"</span>: <span className="text-yellow-300">"dealer"</span><br/>
                        &nbsp;&nbsp;{'}'}<br/>
                        {'}'}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Upload Photos (Repeat for Each Photo)</h3>
                    <p className="text-gray-600 mb-4">Upload each vehicle photo individually and collect the URLs</p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">
                        <span className="text-blue-400">POST</span> https://iqautodeals.com/api/upload<br/>
                        <span className="text-purple-400">Content-Type</span>: multipart/form-data<br/>
                        <br/>
                        file: [binary image data]<br/>
                        <br/>
                        <span className="text-gray-500">// Response - Save this URL!</span><br/>
                        {'{'}<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"url"</span>: <span className="text-yellow-300">"https://blob.vercel-storage.com/photo1.jpg"</span><br/>
                        {'}'}<br/>
                        <br/>
                        <span className="text-gray-500">// Repeat for photos 2, 3, etc. (max 15 photos)</span>
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Add Vehicle with Photo URLs</h3>
                    <p className="text-gray-600 mb-4">Create the vehicle listing using your dealer ID and collected photo URLs</p>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">
                        <span className="text-blue-400">POST</span> https://iqautodeals.com/api/dealer/cars<br/>
                        <br/>
                        {'{'}<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"dealerId"</span>: <span className="text-yellow-300">"550e8400..."</span>, <span className="text-gray-500">← From Step 1</span><br/>
                        &nbsp;&nbsp;<span className="text-green-400">"make"</span>: <span className="text-yellow-300">"Honda"</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"model"</span>: <span className="text-yellow-300">"Accord"</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"year"</span>: <span className="text-orange-400">2023</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"vin"</span>: <span className="text-yellow-300">"1HGCV1F30JA123456"</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"mileage"</span>: <span className="text-orange-400">8500</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"color"</span>: <span className="text-yellow-300">"Black"</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"transmission"</span>: <span className="text-yellow-300">"Automatic"</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"salePrice"</span>: <span className="text-orange-400">28900.00</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"description"</span>: <span className="text-yellow-300">"Excellent condition"</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"photos"</span>: [<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">"https://blob.../photo1.jpg"</span>,<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-yellow-300">"https://blob.../photo2.jpg"</span><br/>
                        &nbsp;&nbsp;], <span className="text-gray-500">← From Step 2</span><br/>
                        &nbsp;&nbsp;<span className="text-green-400">"city"</span>: <span className="text-yellow-300">"Los Angeles"</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"state"</span>: <span className="text-yellow-300">"CA"</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"latitude"</span>: <span className="text-orange-400">34.0522</span>,<br/>
                        &nbsp;&nbsp;<span className="text-green-400">"longitude"</span>: <span className="text-orange-400">-118.2437</span><br/>
                        {'}'}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="documentation" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Available Endpoints</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Authentication */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Authentication</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                    <code className="text-gray-700">/api/auth/login</code>
                  </li>
                </ul>
              </div>

              {/* Inventory Management */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Inventory Management</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">GET</span>
                    <code className="text-gray-700">/api/dealer/cars</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                    <code className="text-gray-700">/api/dealer/cars</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">GET</span>
                    <code className="text-gray-700">/api/dealer/cars/:id</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-mono text-xs">PUT</span>
                    <code className="text-gray-700">/api/dealer/cars/:id</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-mono text-xs">DELETE</span>
                    <code className="text-gray-700">/api/dealer/cars/:id</code>
                  </li>
                </ul>
              </div>

              {/* Image Upload */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <FileCode className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Image Upload</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                    <code className="text-gray-700">/api/upload</code>
                  </li>
                  <li className="text-gray-600 text-xs mt-2">
                    Max 10MB per image • JPEG, PNG, WebP
                  </li>
                </ul>
              </div>

              {/* Deal Management */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Code className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Deal Management</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">GET</span>
                    <code className="text-gray-700">/api/dealer/deal-requests</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                    <code className="text-gray-700">/api/dealer/submit-offer</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                    <code className="text-gray-700">/api/dealer/mark-as-sold</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                    <code className="text-gray-700">/api/dealer/dead-deal</code>
                  </li>
                </ul>
              </div>

              {/* Reports & Analytics */}
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Reports & Analytics</h3>
                </div>
                <ul className="space-y-2 text-sm grid md:grid-cols-2 gap-2">
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">GET</span>
                    <code className="text-gray-700">/api/dealer/reports</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">GET</span>
                    <code className="text-gray-700">/api/dealer/outbid-report</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Technical Specifications</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Rate Limits</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between">
                    <span>Standard Tier:</span>
                    <span className="font-semibold">1,000 req/hour</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Enterprise Tier:</span>
                    <span className="font-semibold">10,000 req/hour</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Data Format</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between">
                    <span>Request:</span>
                    <span className="font-semibold">JSON</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Response:</span>
                    <span className="font-semibold">JSON</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Encoding:</span>
                    <span className="font-semibold">UTF-8</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Security</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>TLS 1.3 Encryption</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>AES-256 Data at Rest</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>GDPR & CCPA Compliant</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Email: <a href="mailto:api-support@iqautodeals.com" className="text-primary hover:underline">api-support@iqautodeals.com</a></li>
                  <li>Response Time: 24 hours</li>
                  <li>Enterprise: 4 hour priority</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Sign up for a dealer account and get access to our API immediately.
              90-day free trial included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register?type=dealer"
                className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Sign Up as Dealer
              </Link>
              <a
                href="/API_DOCUMENTATION.md"
                download
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Full Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2025 IQ Auto Deals. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
