import Link from 'next/link';
import { ArrowLeft, CheckCircle, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import Footer from '../../components/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'How to Maximize Your Car Trade-In Value: Expert Tips 2026',
  description: 'Get the most money for your trade-in. Learn what dealers look for, how to prepare your car, and negotiation strategies to maximize your trade-in value.',
  keywords: 'car trade-in value, maximize trade-in, trade-in tips, how much is my car worth, trade-in negotiation, car appraisal',
};

export default function TradeInValueGuide() {
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
            How to Maximize Your Car Trade-In Value
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Your trade-in can be worth thousands more with the right preparation and negotiation strategy. Learn what dealers evaluate and how to get top dollar for your vehicle.
            </p>

            {/* What Affects Trade-In Value */}
            <div className="bg-primary text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Factors That Determine Trade-In Value
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">High Impact:</p>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Year, make, model, trim</li>
                    <li>• Mileage</li>
                    <li>• Condition (exterior/interior)</li>
                    <li>• Accident history</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Medium Impact:</p>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Service history</li>
                    <li>• Color (neutral colors sell better)</li>
                    <li>• Optional features</li>
                    <li>• Local market demand</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 1: Know Your Value */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">1</span>
                Know Your Car's Value Before You Go
              </h2>
              <p className="text-gray-300 mb-4">
                Never walk into a dealership without knowing what your car is worth. Use multiple sources:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Kelley Blue Book (KBB):</strong> Most widely used, get "Trade-In Value"</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Edmunds:</strong> Often more accurate, offers "True Market Value"</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>CarGurus:</strong> Shows local market pricing</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Carvana/CarMax:</strong> Get instant cash offers for comparison</span></li>
              </ul>
              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Pro Tip:</strong> Get a CarMax offer first. It's free, valid for 7 days, and gives you a guaranteed floor price to negotiate from.</p>
              </div>
            </div>

            {/* Step 2: Prepare Your Car */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">2</span>
                Prepare Your Car for Appraisal
              </h2>
              <p className="text-gray-300 mb-4">
                First impressions matter. A clean car signals that it's been well-maintained.
              </p>

              <h3 className="font-semibold text-white mb-2">Essential Prep (Do This):</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Wash and wax exterior ($20-50 or DIY)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Vacuum and clean interior thoroughly</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Clean windows inside and out</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Remove personal items and clutter</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Fix burned-out lights and replace wipers</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Top off all fluids</span></li>
              </ul>

              <h3 className="font-semibold text-white mb-2">Skip These (Not Worth It):</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" /><span>Major mechanical repairs (dealers do it cheaper)</span></li>
                <li className="flex gap-2"><AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" /><span>Dent/scratch repair (unless very cheap)</span></li>
                <li className="flex gap-2"><AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" /><span>New tires (won't recoup the cost)</span></li>
              </ul>
            </div>

            {/* Step 3: Gather Documents */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">3</span>
                Gather Your Documentation
              </h2>
              <p className="text-gray-300 mb-4">
                Complete records increase buyer confidence and your trade-in value.
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Title (or loan payoff information)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Service records (oil changes, repairs)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Owner's manual and spare keys</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Window sticker (if you have it)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Warranty transfer documentation</span></li>
              </ul>
            </div>

            {/* Step 4: Negotiate Separately */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">4</span>
                Negotiate Trade-In Separately
              </h2>
              <p className="text-gray-300 mb-4">
                This is the most important negotiation tip: <strong>Never discuss your trade-in until you've agreed on the new car's price.</strong>
              </p>
              <div className="bg-black p-4 rounded">
                <p className="font-semibold text-white mb-2">The Right Order:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Negotiate the purchase price of new vehicle</li>
                  <li>Lock in the price in writing</li>
                  <li>Then negotiate trade-in value separately</li>
                  <li>Finally, discuss financing (if needed)</li>
                </ol>
              </div>
              <div className="bg-black p-4 rounded mt-4">
                <p className="font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Common Dealer Tactics to Avoid:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• "What monthly payment are you looking for?" (Focus on total price)</li>
                  <li>• Inflating new car price while offering "great" trade-in value</li>
                  <li>• Lowballing trade-in, then "finding" more money later</li>
                </ul>
              </div>
            </div>

            {/* Step 5: Get Multiple Offers */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">5</span>
                Get Multiple Offers
              </h2>
              <p className="text-gray-300 mb-4">
                Competition is your friend. Get at least 3 trade-in appraisals before committing.
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>CarMax (instant offer, no obligation)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Carvana (online offer in minutes)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>2-3 local dealerships</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Private sale (typically 10-20% more, but more effort)</span></li>
              </ul>
              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Pro Tip:</strong> Tell each dealer you have other offers. Show them (but don't reveal numbers first).</p>
              </div>
            </div>

            {/* Tax Benefits */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                Trade-In Tax Advantage
              </h2>
              <p className="text-gray-300 mb-4">
                In most states, you only pay sales tax on the <strong>difference</strong> between your new car and trade-in value.
              </p>
              <div className="bg-gray-800 p-4 rounded">
                <p className="font-semibold text-white mb-2">Example (7% tax rate):</p>
                <ul className="text-sm space-y-1">
                  <li>New car price: $30,000</li>
                  <li>Trade-in value: $10,000</li>
                  <li>Taxable amount: $20,000</li>
                  <li>Tax saved: $700 (vs. selling privately and buying)</li>
                </ul>
              </div>
              <p className="text-sm text-gray-300 mt-4">
                Note: Not all states offer this benefit. Check your state's rules.
              </p>
            </div>

            {/* When to Sell Privately */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Trade-In vs. Private Sale</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white mb-2">Choose Trade-In If:</p>
                  <ul className="text-sm space-y-1">
                    <li>• You want convenience</li>
                    <li>• Your car has issues</li>
                    <li>• Tax savings offset lower price</li>
                    <li>• You owe more than it's worth</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white mb-2">Choose Private Sale If:</p>
                  <ul className="text-sm space-y-1">
                    <li>• You have time to sell</li>
                    <li>• Car is in excellent condition</li>
                    <li>• It's a desirable/rare model</li>
                    <li>• Difference is $2,000+</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black text-white rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Upgrade?</h3>
              <p className="text-gray-300 mb-6">
                Browse our selection of quality used cars. Get pre-approved financing and find your next vehicle today.
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

      {/* Popular Models */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Trade-In Models</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href="/models/ford-f150" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Ford F-150</Link>
            <Link href="/models/chevy-silverado" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Chevy Silverado</Link>
            <Link href="/models/toyota-tacoma" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Toyota Tacoma</Link>
            <Link href="/models/honda-accord" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Honda Accord</Link>
            <Link href="/models/toyota-camry" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Toyota Camry</Link>
            <Link href="/models/honda-cr-v" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Honda CR-V</Link>
          </div>
          <div className="mt-6">
            <Link href="/cars" className="text-blue-600 font-semibold hover:underline">Browse all used cars →</Link>
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/guides/how-to-buy-used-car" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">How to Buy a Used Car</span>
              <p className="text-sm text-gray-600 mt-1">Complete buying guide</p>
            </Link>
            <Link href="/guides/car-financing-guide" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">Car Financing Guide</span>
              <p className="text-sm text-gray-600 mt-1">Get the best auto loan</p>
            </Link>
            <Link href="/guides/vin-decoder" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">VIN Decoder Guide</span>
              <p className="text-sm text-gray-600 mt-1">Decode any vehicle&apos;s history</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
