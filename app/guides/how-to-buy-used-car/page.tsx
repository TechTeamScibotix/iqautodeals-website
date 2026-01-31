import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';
import { LogoWithBeam } from '@/components/LogoWithBeam';

export const metadata: Metadata = {
  title: 'How to Buy a Used Car: Complete Step-by-Step Guide 2025',
  description: 'Expert guide to buying a used car: research, inspection, negotiation, and paperwork. Avoid common pitfalls and get the best deal on your next vehicle.',
  keywords: 'how to buy a used car, used car buying guide, buying used car checklist, used car tips, negotiate used car price',
};

export default function HowToBuyUsedCarGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black shadow-md sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
          </Link>
          <Link href="/" className="text-gray-300 hover:text-white font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            How to Buy a Used Car: Complete Step-by-Step Guide
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Buying a used car can save you thousands, but it requires careful research and inspection. Follow this proven 10-step process to avoid problems and get the best deal.
            </p>

            {/* Step 1 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">1</span>
                Set Your Budget
              </h2>
              <p className="text-gray-300 mb-4">
                Determine the maximum you can spend including taxes, registration, and insurance. Use the 20/4/10 rule: 20% down payment, finance for no more than 4 years, and keep total monthly car expenses under 10% of your gross income.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Include sales tax (6-10% of price)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Factor in higher insurance for first year</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Set aside $1,000-1,500 for maintenance</span></li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">2</span>
                Research Reliable Models
              </h2>
              <p className="text-gray-300 mb-4">
                Focus on models with proven reliability. Check Consumer Reports, J.D. Power, and owner forums for common problems.
              </p>
              <p className="font-semibold text-white">Top Reliable Brands: Toyota, Honda, Mazda, Lexus, Subaru</p>
            </div>

            {/* Step 3 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">3</span>
                Check Market Prices
              </h2>
              <p className="text-gray-300 mb-4">
                Use Kelley Blue Book, Edmunds, and IQ Auto Deals to see fair market value. This gives you negotiating power and helps spot overpriced listings.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">4</span>
                Get Pre-Approved for Financing
              </h2>
              <p className="text-gray-300 mb-4">
                Apply with your bank, credit union, and online lenders before shopping. Pre-approval gives you leverage and prevents dealer financing markups.
              </p>
              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Pro Tip:</strong> Credit unions typically offer 1-2% lower rates than dealerships.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">5</span>
                Find the Right Car
              </h2>
              <p className="text-gray-300 mb-4">
                Look for cars with complete service records, single owners, and no accident history. Ideal mileage: 10,000-12,000 miles per year of age.
              </p>
              <div className="bg-red-900/30 border border-red-800 p-4 rounded mt-4">
                <p className="font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Red Flags to Avoid:
                </p>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Multiple owners in short time</li>
                  <li>• Rebuilt/salvage title</li>
                  <li>• Mismatched paint (signs of major repairs)</li>
                  <li>• Reluctant seller (won't allow inspection)</li>
                </ul>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">6</span>
                Get Vehicle History Report
              </h2>
              <p className="text-gray-300 mb-4">
                Always run a Carfax or AutoCheck report ($40). Look for accidents, title issues, odometer problems, and service records.
              </p>
            </div>

            {/* Step 7 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">7</span>
                Inspect and Test Drive
              </h2>
              <p className="text-gray-300 mb-4">
                Bring a checklist and inspect in daylight. Test drive for at least 20 minutes on various road types.
              </p>
              <Link href="/guides/pre-purchase-inspection" className="text-primary font-semibold hover:underline">
                → View Complete Inspection Checklist
              </Link>
            </div>

            {/* Step 8 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">8</span>
                Get Pre-Purchase Inspection
              </h2>
              <p className="text-gray-300 mb-4">
                <strong className="text-white">Never skip this step!</strong> Pay a mechanic $100-150 to inspect the car. They'll find issues you'd miss and can save you thousands in future repairs.
              </p>
            </div>

            {/* Step 9 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">9</span>
                Negotiate the Price
              </h2>
              <p className="text-gray-300 mb-4">
                Start 10-15% below asking price. Use market research and inspection findings as leverage. Be willing to walk away.
              </p>
              <div className="bg-green-900/30 border border-green-800 p-4 rounded mt-4">
                <p className="font-semibold text-white mb-2">Negotiation Tips:</p>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Focus on out-the-door price, not monthly payment</li>
                  <li>• Negotiate price before discussing trade-in</li>
                  <li>• Don't show too much enthusiasm</li>
                  <li>• Be ready to leave if you can't agree</li>
                </ul>
              </div>
            </div>

            {/* Step 10 */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg">10</span>
                Complete the Purchase
              </h2>
              <p className="text-gray-300 mb-4">
                Review all paperwork carefully. Verify the VIN matches on title, registration, and car. Get two keys and all manuals.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Title must be clear (no liens)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Get bill of sale with "as-is" clause</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Register and insure before driving</span></li>
              </ul>
            </div>

            <div className="bg-black text-white rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Start Your Search on IQ Auto Deals</h3>
              <p className="text-gray-300 mb-6">
                Browse thousands of quality used cars with verified history. Compare prices from multiple dealers and get the best deal.
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
