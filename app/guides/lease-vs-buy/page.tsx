import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, DollarSign, Calculator } from 'lucide-react';
import type { Metadata } from 'next';
import { LogoWithBeam } from '@/components/LogoWithBeam';

export const metadata: Metadata = {
  title: 'Lease vs Buy a Car: Complete Comparison Guide 2025',
  description: 'Should you lease or buy your next car? Compare total costs, pros and cons, and find out which option is better for your situation.',
  keywords: 'lease vs buy car, car leasing, should I lease or buy, leasing pros cons, car buying vs leasing, auto lease calculator',
};

export default function LeaseVsBuyGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200 h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full" variant="dark" />
          </Link>
          <Link href="/cars" className="text-primary hover:underline font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Browse Cars
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            Lease vs Buy: Which Is Right for You?
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              The lease vs. buy decision depends on your driving habits, financial situation, and priorities. This guide breaks down the real costs and helps you make the right choice.
            </p>

            {/* Quick Comparison */}
            <div className="bg-primary text-white rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Quick Comparison</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-600 p-4 rounded">
                  <p className="font-semibold text-lg mb-2">Leasing</p>
                  <p className="text-blue-100">Lower monthly payments, always drive new, but you never own it and have mileage limits.</p>
                </div>
                <div className="bg-blue-600 p-4 rounded">
                  <p className="font-semibold text-lg mb-2">Buying</p>
                  <p className="text-blue-100">Higher payments initially, but you build equity and have no restrictions on usage.</p>
                </div>
              </div>
            </div>

            {/* How Leasing Works */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4">How Leasing Works</h2>
              <p className="text-gray-700 mb-4">
                When you lease, you're essentially renting the car for a set period (typically 24-36 months). You pay for the car's depreciation during that time, plus interest (called "money factor") and fees.
              </p>

              <h3 className="font-semibold text-dark mb-2">Key Lease Terms:</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Capitalized Cost (Cap Cost):</strong> The negotiated price of the car</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Residual Value:</strong> What the car is worth at lease end</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Money Factor:</strong> The interest rate (multiply by 2,400 for APR)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Mileage Allowance:</strong> Usually 10,000-15,000 miles/year</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Disposition Fee:</strong> Fee to return the car ($300-500)</span></li>
              </ul>
            </div>

            {/* Leasing Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Leasing Pros
                </h3>
                <ul className="space-y-2">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Lower monthly payments (typically 30-60% less)</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Always drive a new car with latest features</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Factory warranty covers most repairs</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>No trade-in hassle at end</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Lower down payment required</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Tax benefits for business use</span></li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  Leasing Cons
                </h3>
                <ul className="space-y-2">
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>No ownership - always have a payment</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Mileage limits (overage fees: $0.15-0.30/mile)</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Wear and tear charges at return</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Early termination is expensive</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Higher insurance requirements</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>No modifications allowed</span></li>
                </ul>
              </div>
            </div>

            {/* Buying Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Buying Pros
                </h3>
                <ul className="space-y-2">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>You own an asset that has value</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>No mileage restrictions</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Modify or customize as you want</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Payment-free years after loan payoff</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Sell or trade anytime</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Lower insurance requirements</span></li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  Buying Cons
                </h3>
                <ul className="space-y-2">
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Higher monthly payments</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Larger down payment needed</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Responsible for repairs after warranty</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Depreciation (new cars lose 20-30% year 1)</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Trade-in negotiation hassle</span></li>
                  <li className="flex gap-2"><XCircle className="w-5 h-5 text-red-600 mt-0.5" /><span>Technology becomes outdated</span></li>
                </ul>
              </div>
            </div>

            {/* True Cost Comparison */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                True Cost Comparison Example
              </h2>
              <p className="text-gray-700 mb-4">Let's compare leasing vs. buying a $35,000 car over 6 years:</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark mb-2">Leasing (Two 3-year leases)</p>
                  <ul className="text-sm space-y-1">
                    <li>Monthly payment: $350 x 72 months = $25,200</li>
                    <li>Down payments: $2,000 x 2 = $4,000</li>
                    <li>Fees (acquisition, disposition): $1,500</li>
                    <li className="font-semibold border-t pt-1 mt-2">Total cost: $30,700</li>
                    <li className="text-gray-500">Value at end: $0</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark mb-2">Buying (5-year loan, keep 6 years)</p>
                  <ul className="text-sm space-y-1">
                    <li>Monthly payment: $600 x 60 months = $36,000</li>
                    <li>Down payment: $5,000</li>
                    <li>Maintenance/repairs (years 4-6): $2,000</li>
                    <li className="font-semibold border-t pt-1 mt-2">Total cost: $43,000</li>
                    <li className="text-green-600">Car value at 6 years: ~$14,000</li>
                    <li className="text-green-600 font-semibold">Net cost: $29,000</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <p className="text-sm"><strong>Key Insight:</strong> Buying costs more upfront but is usually cheaper long-term because you keep the car's value. The longer you keep a purchased car, the more you save.</p>
              </div>
            </div>

            {/* Decision Guide */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4">Which Should You Choose?</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border-l-4 border-green-500">
                  <p className="font-semibold text-dark mb-2">Lease If You:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Drive less than 12,000 miles/year</li>
                    <li>• Want a new car every 2-3 years</li>
                    <li>• Prefer predictable costs (warranty coverage)</li>
                    <li>• Use the car for business (tax deduction)</li>
                    <li>• Don't want to deal with selling/trading</li>
                    <li>• Keep cars in excellent condition</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                  <p className="font-semibold text-dark mb-2">Buy If You:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Drive 15,000+ miles/year</li>
                    <li>• Keep cars 5+ years</li>
                    <li>• Want to eventually be payment-free</li>
                    <li>• Prefer to own assets</li>
                    <li>• Want to modify your vehicle</li>
                    <li>• Have kids, pets, or rough on interiors</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Buy Used: Best of Both */}
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                The Smart Middle Ground: Buy Used
              </h2>
              <p className="text-gray-700 mb-4">
                Buying a 2-3 year old used car often gives you the best of both worlds:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Someone else paid for the steepest depreciation</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Lower purchase price = lower payments</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Still relatively new with modern features</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>May have remaining factory warranty</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>CPO programs offer extended coverage</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Lower insurance costs than new</span></li>
              </ul>
            </div>

            {/* Leasing Tips */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4">If You Decide to Lease: Negotiation Tips</h2>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Negotiate the cap cost:</strong> It's negotiable just like a purchase price</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Ask about the money factor:</strong> Compare to other rates</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Don't put too much down:</strong> If the car is totaled, you lose it</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Be realistic about mileage:</strong> Excess charges add up fast</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Consider lease specials:</strong> Manufacturers often subsidize leases</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Gap insurance:</strong> Usually included in leases (verify)</span></li>
              </ul>
            </div>

            <div className="bg-primary text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Find Great Deals on Quality Used Cars</h3>
              <p className="text-blue-100 mb-6">
                Skip the lease and build real equity. Browse our selection of pre-owned vehicles from trusted dealerships.
              </p>
              <Link
                href="/cars"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Browse Cars Now
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
