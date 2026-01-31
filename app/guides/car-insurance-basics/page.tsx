import Link from 'next/link';
import { ArrowLeft, CheckCircle, Shield, AlertTriangle, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';
import { LogoWithBeam } from '@/components/LogoWithBeam';

export const metadata: Metadata = {
  title: 'Car Insurance Basics: Coverage Types & How to Save Money 2025',
  description: 'Understand auto insurance: liability, collision, comprehensive coverage explained. Learn how much coverage you need and tips to lower your premium.',
  keywords: 'car insurance, auto insurance coverage, liability insurance, collision insurance, comprehensive coverage, how to save on car insurance',
};

export default function CarInsuranceGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black shadow-md sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
          </Link>
          <Link href="/cars" className="text-gray-300 hover:text-white font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Browse Cars
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            Car Insurance Basics: Everything You Need to Know
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Car insurance can be confusing with all its coverage types and options. This guide breaks down what you need, what's optional, and how to save money without sacrificing protection.
            </p>

            {/* Coverage Overview */}
            <div className="bg-primary text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                The Three Main Types of Coverage
              </h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-600 p-3 rounded">
                  <p className="font-semibold">Liability</p>
                  <p className="text-gray-300">Pays for damage you cause to others (Required)</p>
                </div>
                <div className="bg-blue-600 p-3 rounded">
                  <p className="font-semibold">Collision</p>
                  <p className="text-gray-300">Pays for your car after an accident</p>
                </div>
                <div className="bg-blue-600 p-3 rounded">
                  <p className="font-semibold">Comprehensive</p>
                  <p className="text-gray-300">Pays for theft, weather, vandalism</p>
                </div>
              </div>
            </div>

            {/* Liability Coverage */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Liability Coverage (Required)</h2>
              <p className="text-gray-300 mb-4">
                Liability pays for damage and injuries you cause to others. Every state requires minimum liability coverage.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Bodily Injury Liability</p>
                  <p className="text-gray-300 text-sm">Covers medical bills, lost wages, pain and suffering for people you injure</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Property Damage Liability</p>
                  <p className="text-gray-300 text-sm">Covers damage to other vehicles, buildings, fences, etc.</p>
                </div>
              </div>

              <h3 className="font-semibold text-white mb-2">Understanding Liability Limits (Example: 100/300/100)</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>$100,000:</strong> Maximum per person for bodily injury</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>$300,000:</strong> Maximum per accident for bodily injury</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>$100,000:</strong> Maximum for property damage</span></li>
              </ul>

              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Recommendation:</strong> State minimums are too low. Get at least 100/300/100 to protect your assets from lawsuits.</p>
              </div>
            </div>

            {/* Collision Coverage */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Collision Coverage (Optional)</h2>
              <p className="text-gray-300 mb-4">
                Collision pays to repair or replace your car after an accident, regardless of fault. You pay the deductible first.
              </p>

              <div className="bg-gray-800 p-4 rounded mb-4">
                <p className="font-semibold text-white">Example:</p>
                <p className="text-gray-300 text-sm">Your car has $8,000 in damage. With a $500 deductible, insurance pays $7,500.</p>
              </div>

              <h3 className="font-semibold text-white mb-2">Common Deductible Options:</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="bg-gray-800 p-2 rounded">$250</div>
                <div className="bg-gray-800 p-2 rounded">$500</div>
                <div className="bg-gray-800 p-2 rounded border-2 border-primary">$1,000</div>
                <div className="bg-gray-800 p-2 rounded">$2,000</div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">Higher deductible = lower premium (most people choose $1,000)</p>
            </div>

            {/* Comprehensive Coverage */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Comprehensive Coverage (Optional)</h2>
              <p className="text-gray-300 mb-4">
                Comprehensive covers damage from non-collision events. Often called "other than collision" coverage.
              </p>

              <h3 className="font-semibold text-white mb-2">What's Covered:</h3>
              <div className="grid md:grid-cols-2 gap-2">
                <ul className="space-y-1">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Theft</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Vandalism</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Hail damage</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Flood damage</span></li>
                </ul>
                <ul className="space-y-1">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Fire</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Falling objects</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Animal collisions</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Windshield damage</span></li>
                </ul>
              </div>
            </div>

            {/* Other Coverage Types */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Additional Coverage Types</h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Uninsured/Underinsured Motorist (UM/UIM)</p>
                  <p className="text-gray-300 text-sm">Covers you if hit by someone with no/insufficient insurance. <strong>Highly recommended.</strong></p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Medical Payments / Personal Injury Protection (PIP)</p>
                  <p className="text-gray-300 text-sm">Covers medical bills for you and passengers regardless of fault.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Rental Reimbursement</p>
                  <p className="text-gray-300 text-sm">Pays for a rental car while yours is being repaired. Usually $30-50/day.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Roadside Assistance</p>
                  <p className="text-gray-300 text-sm">Towing, flat tire help, lockout service. Often $10-20/year.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Gap Insurance</p>
                  <p className="text-gray-300 text-sm">Covers the difference if you owe more than your car is worth. Important for new cars and long loans.</p>
                </div>
              </div>
            </div>

            {/* When to Drop Coverage */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">When to Drop Collision/Comprehensive</h2>
              <p className="text-gray-300 mb-4">
                Full coverage isn't always worth it on older cars. Use this rule of thumb:
              </p>

              <div className="bg-gray-800 p-4 rounded mb-4">
                <p className="font-semibold text-white">The 10% Rule:</p>
                <p className="text-gray-300">If annual premium for collision + comprehensive exceeds 10% of your car's value, consider dropping it.</p>
              </div>

              <div className="bg-primary/20 border-l-4 border-primary p-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Example:</strong> Car worth $5,000. Collision + comprehensive costs $600/year (12%). That's too much. Drop coverage and save $600.</p>
              </div>
            </div>

            {/* How to Save Money */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                15 Ways to Lower Your Insurance Premium
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Shop around every 6-12 months</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Raise your deductible to $1,000</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Bundle home and auto</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Ask about all discounts</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Maintain good credit score</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Take defensive driving course</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Pay annually vs monthly</span></li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Use usage-based insurance apps</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Low mileage discount</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Good student discount</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Anti-theft device discount</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Safety features discount</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Paperless/autopay discount</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Loyalty discount (sometimes)</span></li>
                </ul>
              </div>
            </div>

            {/* What Affects Rates */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">What Affects Your Insurance Rate</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-white mb-2">You Can Control:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Coverage levels and deductibles</li>
                    <li>• Credit score</li>
                    <li>• Driving record</li>
                    <li>• Vehicle choice</li>
                    <li>• Annual mileage</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">You Can't Control:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Age</li>
                    <li>• Gender (in some states)</li>
                    <li>• Location/ZIP code</li>
                    <li>• Claims in your area</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black text-white rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Find Your Next Car</h3>
              <p className="text-gray-300 mb-6">
                Browse quality used vehicles and get quotes from trusted dealerships. Remember to factor insurance into your budget!
              </p>
              <Link
                href="/cars"
                className="inline-block bg-primary text-white px-8 py-4 rounded-pill font-bold hover:bg-primary-dark transition-colors"
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
