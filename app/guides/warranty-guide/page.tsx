import Link from 'next/link';
import { ArrowLeft, CheckCircle, Shield, AlertTriangle, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import Footer from '../../components/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Car Warranty Guide: CPO vs Extended Warranty Explained 2026',
  description: 'Understand car warranties: manufacturer, CPO, and extended warranties compared. Learn what\'s covered, what to avoid, and whether extended warranties are worth it.',
  keywords: 'car warranty, CPO warranty, certified pre-owned, extended warranty, vehicle service contract, warranty coverage, powertrain warranty',
};

export default function WarrantyGuide() {
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
            Car Warranty Guide: CPO vs Extended Warranties
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Understanding warranty coverage can save you thousands in repair costs. Learn the differences between manufacturer warranties, CPO programs, and extended warranties to make the right choice for your situation.
            </p>

            {/* Warranty Types Overview */}
            <div className="bg-primary text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Types of Car Warranties
              </h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-600 p-3 rounded">
                  <p className="font-semibold">Manufacturer Warranty</p>
                  <p className="text-gray-300">Comes with new cars, typically 3-5 years</p>
                </div>
                <div className="bg-blue-600 p-3 rounded">
                  <p className="font-semibold">CPO Warranty</p>
                  <p className="text-gray-300">Extended coverage for certified used cars</p>
                </div>
                <div className="bg-blue-600 p-3 rounded">
                  <p className="font-semibold">Extended Warranty</p>
                  <p className="text-gray-300">Third-party or dealer coverage you purchase</p>
                </div>
              </div>
            </div>

            {/* Manufacturer Warranty */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Manufacturer (Factory) Warranty</h2>
              <p className="text-gray-300 mb-4">
                Every new car includes a manufacturer warranty. It typically has two components:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Bumper-to-Bumper</p>
                  <p className="text-gray-300 text-sm mb-2">Covers most components</p>
                  <p className="text-xs">Typical: 3 years / 36,000 miles</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Powertrain</p>
                  <p className="text-gray-300 text-sm mb-2">Engine, transmission, drivetrain</p>
                  <p className="text-xs">Typical: 5 years / 60,000 miles</p>
                </div>
              </div>

              <h3 className="font-semibold text-white mb-2">Best Manufacturer Warranties:</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span><strong>Hyundai/Kia:</strong> 5yr/60k bumper-to-bumper, 10yr/100k powertrain</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span><strong>Genesis:</strong> 5yr/60k bumper-to-bumper, 10yr/100k powertrain</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span><strong>Mitsubishi:</strong> 5yr/60k bumper-to-bumper, 10yr/100k powertrain</span></li>
              </ul>

              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Important:</strong> Manufacturer warranties transfer to new owners. Check remaining coverage when buying used!</p>
              </div>
            </div>

            {/* CPO Warranty */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Certified Pre-Owned (CPO) Warranty</h2>
              <p className="text-gray-300 mb-4">
                CPO programs are offered by manufacturers through franchised dealers. They provide extended warranty coverage on qualifying used vehicles.
              </p>

              <h3 className="font-semibold text-white mb-2">CPO Requirements:</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Vehicle age: Typically under 5-6 years old</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Mileage: Usually under 60,000-80,000 miles</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Clean title (no salvage/rebuilt)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Multi-point inspection passed</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Vehicle history report reviewed</span></li>
              </ul>

              <h3 className="font-semibold text-white mb-2">Popular CPO Programs:</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Toyota CPO</p>
                  <p className="text-gray-300 text-sm">12-month/12,000-mile comprehensive + 7-year/100,000-mile powertrain from original date</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Honda CPO</p>
                  <p className="text-gray-300 text-sm">4-year/48,000-mile from original date + 7-year/100,000-mile powertrain</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">BMW CPO</p>
                  <p className="text-gray-300 text-sm">1-year unlimited mileage + remaining factory warranty</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Lexus CPO</p>
                  <p className="text-gray-300 text-sm">3-year/unlimited mileage comprehensive from CPO purchase date</p>
                </div>
              </div>

              <div className="bg-black p-4 rounded mt-4">
                <p className="font-semibold text-white mb-2">CPO Benefits:</p>
                <ul className="text-sm space-y-1">
                  <li>• Backed by manufacturer (not third-party)</li>
                  <li>• Roadside assistance included</li>
                  <li>• Special financing rates often available</li>
                  <li>• Service at any franchised dealer nationwide</li>
                </ul>
              </div>
            </div>

            {/* Extended Warranties */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Extended Warranties (Vehicle Service Contracts)</h2>
              <p className="text-gray-300 mb-4">
                Extended warranties are optional coverage you purchase separately. They can come from the manufacturer, dealer, or third-party providers.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Powertrain Only</p>
                  <p className="text-gray-300 text-sm">Engine, transmission, differential</p>
                  <p className="text-xs text-gray-400 mt-2">Cost: $500-1,500</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Stated Component</p>
                  <p className="text-gray-300 text-sm">Listed parts only covered</p>
                  <p className="text-xs text-gray-400 mt-2">Cost: $1,000-2,500</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Exclusionary</p>
                  <p className="text-gray-300 text-sm">Everything except listed exclusions</p>
                  <p className="text-xs text-gray-400 mt-2">Cost: $2,000-4,000+</p>
                </div>
              </div>

              <div className="bg-black p-4 rounded">
                <p className="font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Watch Out For:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• High deductibles ($100-250 per visit)</li>
                  <li>• Exclusions for pre-existing conditions</li>
                  <li>• Requirements to use specific repair shops</li>
                  <li>• Waiting periods before coverage starts</li>
                  <li>• Companies that go out of business</li>
                </ul>
              </div>
            </div>

            {/* Is It Worth It? */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-primary" />
                Are Extended Warranties Worth It?
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black p-4 rounded">
                  <p className="font-semibold text-white mb-2">Consider If:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Buying a luxury/European brand</li>
                    <li>• Vehicle known for costly repairs</li>
                    <li>• Keeping the car 5+ years</li>
                    <li>• Can't afford surprise $3,000+ repairs</li>
                    <li>• Peace of mind matters to you</li>
                  </ul>
                </div>
                <div className="bg-black p-4 rounded">
                  <p className="font-semibold text-white mb-2">Skip If:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Buying Toyota/Honda (high reliability)</li>
                    <li>• Remaining factory warranty exists</li>
                    <li>• You can self-insure (savings account)</li>
                    <li>• Planning to sell within 2-3 years</li>
                    <li>• The numbers don't make sense</li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Do the Math:</strong> If a warranty costs $2,500 and average claim is $1,200, you need 2+ major repairs to break even. Research your specific model's reliability.</p>
              </div>
            </div>

            {/* Buying Tips */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Extended Warranty Buying Tips</h2>
              <ul className="space-y-3">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Never buy at the dealer:</strong> Negotiate or buy direct from warranty companies for 30-50% less</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Manufacturer-backed is best:</strong> Toyota, Honda, Hyundai sell extended warranties directly</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Research the provider:</strong> Check BBB rating and reviews before buying</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Read exclusions carefully:</strong> Understand exactly what's covered and what's not</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>You can cancel:</strong> Most warranties are refundable (pro-rated) if you change your mind</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Wait until factory expires:</strong> No need to overlap coverage</span></li>
              </ul>
            </div>

            {/* What's Not Covered */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">What Warranties DON'T Cover</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-white mb-2">Wear Items:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Brake pads and rotors</li>
                    <li>• Tires</li>
                    <li>• Wiper blades</li>
                    <li>• Light bulbs</li>
                    <li>• Batteries</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">Maintenance Items:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Oil changes</li>
                    <li>• Filters</li>
                    <li>• Fluid flushes</li>
                    <li>• Alignments</li>
                    <li>• Tune-ups</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black text-white rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Find Your Next Car</h3>
              <p className="text-gray-300 mb-6">
                Browse quality used cars with remaining factory warranty or CPO certification from trusted dealerships.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Models Worth the Warranty</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href="/models/lexus-rx350" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Lexus RX 350</Link>
            <Link href="/models/bmw-x5" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">BMW X5</Link>
            <Link href="/models/mercedes-g-wagon" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Mercedes G-Wagon</Link>
            <Link href="/models/audi-q5" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Audi Q5</Link>
            <Link href="/models/bmw-x3" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">BMW X3</Link>
            <Link href="/models/toyota-4runner" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Toyota 4Runner</Link>
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
            <Link href="/guides/vehicle-maintenance" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">Vehicle Maintenance</span>
              <p className="text-sm text-gray-600 mt-1">Keep your car running</p>
            </Link>
            <Link href="/guides/pre-purchase-inspection" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">Pre-Purchase Inspection</span>
              <p className="text-sm text-gray-600 mt-1">What to check before buying</p>
            </Link>
            <Link href="/guides/car-insurance-basics" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">Car Insurance Basics</span>
              <p className="text-sm text-gray-600 mt-1">Coverage you need</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
