import Link from 'next/link';
import { ArrowLeft, CheckCircle, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import Footer from '../../components/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Credit Scores & Auto Loans: How to Get the Best Rate 2026',
  description: 'Understand how credit scores affect auto loan rates. Learn what score you need, how to improve your credit, and strategies to get approved with any credit.',
  keywords: 'credit score auto loan, car loan credit score, improve credit for car loan, auto loan rates by credit score, bad credit car loan, auto financing',
};

export default function CreditScoreAutoLoansGuide() {
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
            Credit Scores & Auto Loans: Your Complete Guide
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Your credit score is the single biggest factor in determining your auto loan interest rate. Understanding how it works can save you thousands of dollars over the life of your loan.
            </p>

            {/* Credit Score Ranges */}
            <div className="bg-primary text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Credit Score Ranges & Auto Loan Rates
              </h2>
              <div className="space-y-3">
                <div className="bg-black0 p-3 rounded flex justify-between items-center">
                  <span className="font-semibold">Excellent (750-850)</span>
                  <span>3-5% APR</span>
                </div>
                <div className="bg-green-400 p-3 rounded flex justify-between items-center">
                  <span className="font-semibold">Good (700-749)</span>
                  <span>5-7% APR</span>
                </div>
                <div className="bg-yellow-500 p-3 rounded flex justify-between items-center text-dark">
                  <span className="font-semibold">Fair (650-699)</span>
                  <span>8-12% APR</span>
                </div>
                <div className="bg-orange-500 p-3 rounded flex justify-between items-center">
                  <span className="font-semibold">Poor (600-649)</span>
                  <span>12-18% APR</span>
                </div>
                <div className="bg-black0 p-3 rounded flex justify-between items-center">
                  <span className="font-semibold">Bad (Below 600)</span>
                  <span>18-25%+ APR</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-4">*Rates vary by lender, loan term, and vehicle age</p>
            </div>

            {/* The Real Cost */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-primary" />
                The Real Cost of a Low Credit Score
              </h2>
              <p className="text-gray-300 mb-4">
                On a $25,000 car loan for 60 months, here's how much you'd pay based on credit score:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="p-3 text-left text-white">Credit Score</th>
                      <th className="p-3 text-left text-white">APR</th>
                      <th className="p-3 text-left text-white">Monthly Payment</th>
                      <th className="p-3 text-left text-white">Total Interest</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-700">
                      <td className="p-3">750+ (Excellent)</td>
                      <td className="p-3">4%</td>
                      <td className="p-3">$460</td>
                      <td className="p-3 text-green-400 font-semibold">$2,600</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-3">700-749 (Good)</td>
                      <td className="p-3">6%</td>
                      <td className="p-3">$483</td>
                      <td className="p-3">$3,980</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-3">650-699 (Fair)</td>
                      <td className="p-3">10%</td>
                      <td className="p-3">$531</td>
                      <td className="p-3">$6,860</td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="p-3">600-649 (Poor)</td>
                      <td className="p-3">15%</td>
                      <td className="p-3">$595</td>
                      <td className="p-3 text-red-400 font-semibold">$10,700</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">That's $8,100 more in interest</strong> for having poor credit vs. excellent credit on the same car!</p>
              </div>
            </div>

            {/* What Affects Your Score */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">What Makes Up Your Credit Score</h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-white">Payment History</p>
                    <span className="bg-primary text-white px-3 py-1 rounded text-sm">35%</span>
                  </div>
                  <p className="text-gray-300 text-sm">On-time payments are the most important factor. One 30-day late payment can drop your score 50-100 points.</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-white">Credit Utilization</p>
                    <span className="bg-primary text-white px-3 py-1 rounded text-sm">30%</span>
                  </div>
                  <p className="text-gray-300 text-sm">How much of your available credit you're using. Keep credit card balances below 30% of limits (under 10% is ideal).</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-white">Credit History Length</p>
                    <span className="bg-primary text-white px-3 py-1 rounded text-sm">15%</span>
                  </div>
                  <p className="text-gray-300 text-sm">Average age of your accounts. Keep old accounts open even if unused.</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-white">Credit Mix</p>
                    <span className="bg-primary text-white px-3 py-1 rounded text-sm">10%</span>
                  </div>
                  <p className="text-gray-300 text-sm">Having different types of credit (cards, loans, mortgage) shows you can handle various debt.</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-white">New Credit</p>
                    <span className="bg-primary text-white px-3 py-1 rounded text-sm">10%</span>
                  </div>
                  <p className="text-gray-300 text-sm">Recent credit inquiries and new accounts. Too many in a short time looks risky.</p>
                </div>
              </div>
            </div>

            {/* Improve Your Score */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">How to Improve Your Credit Score</h2>

              <h3 className="font-semibold text-white mb-2">Quick Wins (1-2 months):</h3>
              <ul className="space-y-2 mb-4 text-gray-300">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Pay down credit card balances below 30% (ideally under 10%)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Check credit reports for errors - dispute any inaccuracies</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Ask for credit limit increases (lowers utilization ratio)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Become an authorized user on someone's old, good account</span></li>
              </ul>

              <h3 className="font-semibold text-white mb-2">Medium-Term (3-6 months):</h3>
              <ul className="space-y-2 mb-4 text-gray-300">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Set up autopay to ensure 100% on-time payments</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Keep old accounts open (even if unused)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Limit new credit applications</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Consider a secured credit card if rebuilding</span></li>
              </ul>

              <h3 className="font-semibold text-white mb-2">Long-Term (6-12 months):</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Build a longer credit history with consistent use</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Diversify credit types (if it makes sense)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Pay off collections if you can negotiate pay-for-delete</span></li>
              </ul>
            </div>

            {/* Getting Approved */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Getting Approved with Less-Than-Perfect Credit</h2>

              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">1. Get Pre-Approved First</p>
                  <p className="text-gray-300 text-sm">Apply to multiple lenders within 14 days - it counts as one inquiry. Try credit unions, banks, and online lenders.</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">2. Make a Larger Down Payment</p>
                  <p className="text-gray-300 text-sm">20%+ down shows commitment and reduces lender risk. Can help offset a lower credit score.</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">3. Consider a Co-Signer</p>
                  <p className="text-gray-300 text-sm">A co-signer with good credit can help you qualify for better rates. They're responsible if you don't pay.</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">4. Buy a Less Expensive Car</p>
                  <p className="text-gray-300 text-sm">Lower loan amount = easier approval. A $15,000 loan is easier to get than $30,000.</p>
                </div>

                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">5. Show Proof of Income</p>
                  <p className="text-gray-300 text-sm">Stable employment and income can offset credit concerns. Bring pay stubs and tax returns.</p>
                </div>
              </div>
            </div>

            {/* Where to Get Auto Loans */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Where to Get an Auto Loan</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-green-400">Best Rates:</p>
                  <ul className="text-sm space-y-1 mt-2 text-gray-300">
                    <li>• Credit unions (often 1-2% lower)</li>
                    <li>• Banks (if you're an existing customer)</li>
                    <li>• Online lenders (competitive rates)</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-orange-400">Use Caution:</p>
                  <ul className="text-sm space-y-1 mt-2 text-gray-300">
                    <li>• Dealer financing (often marked up)</li>
                    <li>• Buy-here-pay-here lots (very high rates)</li>
                    <li>• Subprime lenders (last resort only)</li>
                  </ul>
                </div>
              </div>

              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Pro Tip:</strong> Always get pre-approved from your bank or credit union BEFORE going to the dealer. Use their rate as leverage.</p>
              </div>
            </div>

            {/* Red Flags */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                Auto Loan Red Flags to Avoid
              </h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex gap-2"><AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" /><span><strong className="text-white">Yo-yo financing:</strong> Dealer calls days later saying financing "fell through" and you need worse terms</span></li>
                <li className="flex gap-2"><AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" /><span><strong className="text-white">Packed payments:</strong> Hidden fees and add-ons in the monthly payment</span></li>
                <li className="flex gap-2"><AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" /><span><strong className="text-white">Focusing on monthly payment:</strong> Dealers extend terms to hide high prices</span></li>
                <li className="flex gap-2"><AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" /><span><strong className="text-white">84+ month loans:</strong> You'll be underwater for years</span></li>
                <li className="flex gap-2"><AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" /><span><strong className="text-white">Interest rates over 20%:</strong> Consider waiting to improve credit first</span></li>
              </ul>
            </div>

            {/* Check Your Credit */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Where to Check Your Credit Score (Free)</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong className="text-white">AnnualCreditReport.com:</strong> Free reports from all 3 bureaus (weekly during COVID)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong className="text-white">Credit Karma:</strong> Free TransUnion and Equifax scores</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong className="text-white">Your credit card:</strong> Many provide free FICO scores</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong className="text-white">Your bank:</strong> Often provides free credit monitoring</span></li>
              </ul>
              <p className="text-sm text-gray-400 mt-4">
                Note: There are different credit score models. Auto lenders often use FICO Auto Score, which may differ from what you see on free sites.
              </p>
            </div>

            <div className="bg-black text-white rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Shop?</h3>
              <p className="text-gray-300 mb-6">
                Browse quality used cars and connect with dealerships that work with all credit types. Get pre-qualified and find your next vehicle.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Affordable Models to Finance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href="/models/honda-civic" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Honda Civic</Link>
            <Link href="/models/toyota-camry" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Toyota Camry</Link>
            <Link href="/models/hyundai-sonata" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Hyundai Sonata</Link>
            <Link href="/models/nissan-altima" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Nissan Altima</Link>
            <Link href="/models/chevy-malibu" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Chevy Malibu</Link>
            <Link href="/models/mazda-cx5" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Mazda CX-5</Link>
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
            <Link href="/guides/car-financing-guide" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">Car Financing Guide</span>
              <p className="text-sm text-gray-600 mt-1">Get the best auto loan</p>
            </Link>
            <Link href="/guides/first-time-buyer-faq" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">First-Time Buyer FAQ</span>
              <p className="text-sm text-gray-600 mt-1">Answers for new buyers</p>
            </Link>
            <Link href="/guides/lease-vs-buy" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">Lease vs Buy</span>
              <p className="text-sm text-gray-600 mt-1">Which option is best?</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
