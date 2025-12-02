import Link from 'next/link';
import { Calendar, ArrowLeft, CheckCircle, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';
import FinancingCalculator from '@/app/components/FinancingCalculator';

export const metadata: Metadata = {
  title: 'How to Finance a Used Car in 2025',
  description: 'Learn everything about used car financing: credit scores, interest rates, loan terms, and how to get approved. Expert tips to save thousands on your auto loan.',
  keywords: 'used car financing, auto loan, car loan rates, how to finance a car, used car loan, bad credit car loan, car financing tips',
};

export default function FinanceGuideArticle() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            IQ Auto Deals
          </Link>
          <Link href="/blog" className="text-primary hover:underline font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </header>

      {/* Article Header */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="mb-6">
            <span className="bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              Financing Guide
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            How to Finance a Used Car in 2025: Complete Guide
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>November 1, 2025</span>
            </div>
            <span>•</span>
            <span>8 min read</span>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Financing a used car can save you thousands compared to buying new, but navigating auto loans, interest rates, and credit requirements can be confusing. This comprehensive guide walks you through everything you need to know to get the best deal on your used car loan in 2025.
            </p>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Understanding Auto Loans</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              An auto loan is a secured loan where the car serves as collateral. If you fail to make payments, the lender can repossess the vehicle. Used car loans typically have:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Higher interest rates</strong> than new car loans (typically 1-3% higher)</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Shorter loan terms</strong> (usually 36-60 months vs 60-72 for new cars)</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Age restrictions</strong> (some lenders won't finance cars over 10 years old)</span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Credit Score Requirements</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your credit score is the biggest factor in determining your interest rate and loan approval. Here's what to expect in 2025:
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-dark mb-4">2025 Used Car Loan Rates by Credit Score</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Excellent (750+):</span>
                  <span className="text-primary font-bold">5.5% - 7.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Good (700-749):</span>
                  <span className="text-primary font-bold">7.5% - 10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Fair (650-699):</span>
                  <span className="text-primary font-bold">10% - 15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Poor (600-649):</span>
                  <span className="text-primary font-bold">15% - 20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Bad (&lt;600):</span>
                  <span className="text-red-600 font-bold">20%+ or declined</span>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Steps to Get the Best Financing</h2>

            <h3 className="text-2xl font-bold text-dark mt-8 mb-4">1. Check Your Credit Score</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Before applying for loans, check your credit report for errors. You can get a free report from AnnualCreditReport.com. Dispute any inaccuracies, as even small corrections can improve your score by 20-30 points.
            </p>

            <h3 className="text-2xl font-bold text-dark mt-8 mb-4">2. Get Pre-Approved</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Pre-approval gives you negotiating power and shows dealers you're a serious buyer. Apply with 3-5 lenders within a 14-day window - credit bureaus count multiple auto loan inquiries as a single hit to your score.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <p className="text-gray-800">
                <strong>Pro Tip:</strong> Credit unions typically offer rates 1-2% lower than banks and dealerships. Check with your local credit union before shopping around.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-dark mt-8 mb-4">3. Calculate Your Budget</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Financial experts recommend keeping your monthly car payment below 15-20% of your take-home pay. Use our calculator below to estimate your monthly payment:
            </p>

            {/* Financing Calculator */}
            <div className="my-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <FinancingCalculator />
            </div>

            <h3 className="text-2xl font-bold text-dark mt-8 mb-4">4. Make a Larger Down Payment</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Putting down 20% or more can:
            </p>
            <ul className="space-y-2 mb-6 ml-6">
              <li className="text-gray-700">• Lower your interest rate by 0.5-1%</li>
              <li className="text-gray-700">• Reduce monthly payments significantly</li>
              <li className="text-gray-700">• Prevent being "upside down" on your loan</li>
              <li className="text-gray-700">• Save thousands in total interest</li>
            </ul>

            <h3 className="text-2xl font-bold text-dark mt-8 mb-4">5. Choose the Right Loan Term</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Shorter loans (36-48 months) mean higher monthly payments but much less interest paid overall. A 36-month loan at 8% costs $2,400 less in interest than a 60-month loan on a $20,000 car.
            </p>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Common Financing Mistakes to Avoid</h2>

            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <span className="text-red-600 font-bold text-xl">✗</span>
                  <div>
                    <strong className="text-dark">Not shopping around:</strong>
                    <p className="text-gray-700">Compare at least 3-5 lenders. Rates can vary by 3-5%.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-red-600 font-bold text-xl">✗</span>
                  <div>
                    <strong className="text-dark">Focusing only on monthly payment:</strong>
                    <p className="text-gray-700">Dealers can extend terms to lower payments while you pay more interest.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-red-600 font-bold text-xl">✗</span>
                  <div>
                    <strong className="text-dark">Accepting dealer financing without comparison:</strong>
                    <p className="text-gray-700">Dealer rates are often 1-3% higher than direct lender rates.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-red-600 font-bold text-xl">✗</span>
                  <div>
                    <strong className="text-dark">Skipping the total cost calculation:</strong>
                    <p className="text-gray-700">Always calculate total interest over the life of the loan.</p>
                  </div>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Alternative Financing Options</h2>

            <h3 className="text-2xl font-bold text-dark mt-8 mb-4">Buy Here Pay Here (BHPH) Dealers</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              BHPH dealers finance the car themselves. They approve almost anyone but charge extremely high rates (18-29%). Only consider this as a last resort.
            </p>

            <h3 className="text-2xl font-bold text-dark mt-8 mb-4">Personal Loans</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have good credit, a personal loan from a bank or online lender might offer competitive rates without age restrictions on the vehicle.
            </p>

            <h3 className="text-2xl font-bold text-dark mt-8 mb-4">Co-Signer</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              A co-signer with good credit can help you qualify for better rates, but they're equally responsible for the loan if you default.
            </p>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Final Tips</h2>
            <ul className="space-y-3 mb-8">
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>Read all loan documents carefully before signing</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>Watch for add-ons (extended warranties, gap insurance) that inflate the loan</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>Consider refinancing after 12 months if your credit improves</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>Make extra payments when possible to reduce total interest</span>
              </li>
            </ul>

            <div className="bg-primary text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Shopping?</h3>
              <p className="text-blue-100 mb-6">
                Browse thousands of quality used cars on IQ Auto Deals. Compare prices from local dealers and get competitive financing offers all in one place.
              </p>
              <Link
                href="/register?type=customer"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Start Shopping Now
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-dark mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/new-vs-used-cars-first-time-buyers" className="group">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                <h3 className="font-bold text-dark group-hover:text-primary mb-2">
                  New vs Used Cars: First-Time Buyer Guide
                </h3>
                <p className="text-sm text-gray-600">Learn which option is best for your budget and needs</p>
              </div>
            </Link>
            <Link href="/blog/best-used-cars-under-20k" className="group">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                <h3 className="font-bold text-dark group-hover:text-primary mb-2">
                  Best Used Cars Under $20,000
                </h3>
                <p className="text-sm text-gray-600">Top picks for reliable, affordable vehicles</p>
              </div>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
