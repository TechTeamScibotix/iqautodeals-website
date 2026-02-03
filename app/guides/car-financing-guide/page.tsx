import Link from 'next/link';
import { ArrowLeft, DollarSign, TrendingUp, Shield } from 'lucide-react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import FinancingCalculator from '@/app/components/FinancingCalculator';
import { LogoWithBeam } from '@/components/LogoWithBeam';

// Force static generation for SEO
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Car Financing Guide: How to Get the Best Auto Loan in 2025',
  description: 'Complete guide to car financing: improve your credit, compare lenders, negotiate rates, and avoid common mistakes. Get the best deal on your auto loan.',
  keywords: 'car financing guide, auto loan tips, car loan rates, financing a car, best auto loan, improve credit score for car loan',
};

export default function CarFinancingGuide() {
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
            Car Financing Guide: Get the Best Auto Loan
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Getting the right financing can save you thousands on your car purchase. This guide shows you how to qualify for the best rates and avoid costly mistakes.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Understanding auto financing is essential for making a smart car purchase. Whether you are buying new or used, the loan you choose affects your monthly payments, total cost of ownership, and financial flexibility. This comprehensive guide covers everything from calculating your budget to negotiating with lenders and avoiding common financing pitfalls. Follow these steps to secure the best auto loan for your situation.
            </p>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6 flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-primary" />
              Calculate Your Budget First
            </h2>

            <div className="bg-gray-100 rounded-xl p-6 mb-8">
              <Suspense fallback={<div className="text-gray-500">Loading calculator...</div>}>
                <FinancingCalculator />
              </Suspense>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">The 20/4/10 Rule</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong className="text-gray-900">20% Down:</strong> Put down at least 20% to avoid being underwater</li>
                <li><strong className="text-gray-900">4 Years Max:</strong> Finance for no more than 48 months</li>
                <li><strong className="text-gray-900">10% of Income:</strong> Total car expenses under 10% of gross monthly income</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">5 Steps to the Best Auto Loan</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">1. Check and Improve Your Credit Score</h3>
                <p className="text-gray-700">
                  Get your free credit report and fix errors. Pay down credit card balances below 30% utilization. Even a 50-point improvement can save you 2-3% on interest rates.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">2. Shop Multiple Lenders</h3>
                <p className="text-gray-700 mb-2">
                  Get quotes from at least 3-5 lenders within 14 days (counts as one credit inquiry):
                </p>
                <ul className="list-disc ml-6 text-gray-700">
                  <li>Your credit union (typically lowest rates)</li>
                  <li>Your bank</li>
                  <li>Online lenders (Lightstream, AutoPay)</li>
                  <li>Dealer financing (for comparison)</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">3. Get Pre-Approved</h3>
                <p className="text-gray-700">
                  Pre-approval tells you exactly how much you can borrow and at what rate. Use this to negotiate confidently with dealers.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">4. Negotiate the Purchase Price First</h3>
                <p className="text-gray-700">
                  Never discuss financing until after you have agreed on the car price. Dealers can hide profit in monthly payments.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">5. Read All Documents Carefully</h3>
                <p className="text-gray-700">
                  Verify the APR, term, total amount financed, and monthly payment match what was agreed. Watch for add-ons you did not request.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6 flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              Avoid These Common Mistakes
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <ul className="space-y-3 text-gray-700">
                <li><strong className="text-red-600">Focusing only on monthly payment:</strong> Longer loans mean more interest paid</li>
                <li><strong className="text-red-600">Accepting first offer:</strong> Always shop around and compare at least 3 lenders</li>
                <li><strong className="text-red-600">Not reading the fine print:</strong> Watch for prepayment penalties and fees</li>
                <li><strong className="text-red-600">Financing the full price:</strong> Put down at least 10-20% to save on interest</li>
                <li><strong className="text-red-600">Extending the loan term:</strong> 72-84 month loans cost thousands more in interest</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">What Interest Rate Should You Expect?</h2>

            <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-200 px-4 py-3 text-left text-gray-900 bg-gray-100 font-bold">Credit Score</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-gray-900 bg-gray-100 font-bold">New Car Rate</th>
                    <th className="border border-gray-200 px-4 py-3 text-left text-gray-900 bg-gray-100 font-bold">Used Car Rate</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="bg-green-50">
                    <td className="border border-gray-200 px-4 py-3 font-medium">781-850 (Excellent)</td>
                    <td className="border border-gray-200 px-4 py-3 text-green-700 font-semibold">4.5% - 6%</td>
                    <td className="border border-gray-200 px-4 py-3 text-green-700 font-semibold">5.5% - 7.5%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 font-medium">661-780 (Good)</td>
                    <td className="border border-gray-200 px-4 py-3">6% - 8%</td>
                    <td className="border border-gray-200 px-4 py-3">7.5% - 10%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-medium">601-660 (Fair)</td>
                    <td className="border border-gray-200 px-4 py-3">9% - 13%</td>
                    <td className="border border-gray-200 px-4 py-3">10% - 15%</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="border border-gray-200 px-4 py-3 font-medium">500-600 (Poor)</td>
                    <td className="border border-gray-200 px-4 py-3 text-red-700 font-semibold">14% - 18%</td>
                    <td className="border border-gray-200 px-4 py-3 text-red-700 font-semibold">15% - 20%+</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-primary text-white rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Find Your Car?</h3>
              <p className="text-blue-100 mb-6">
                Get pre-approved, then browse quality used cars on IQ Auto Deals. Compare prices from local dealers and find your perfect vehicle without the hassle of traditional car shopping.
              </p>
              <Link
                href="/cars"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
