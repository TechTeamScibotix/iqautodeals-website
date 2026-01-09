import Link from 'next/link';
import { ArrowLeft, HelpCircle, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'First-Time Car Buyer FAQ: 25 Questions Answered 2025',
  description: 'Everything first-time car buyers need to know: financing, negotiation, insurance, and common mistakes to avoid. Expert answers to your top questions.',
  keywords: 'first time car buyer, buying first car, car buying tips, first car advice, new driver car buying, how to buy first car',
};

export default function FirstTimeBuyerFAQ() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            IQ Auto Deals
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
            First-Time Car Buyer FAQ
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Buying your first car is exciting but can be overwhelming. We've compiled answers to the 25 most common questions from first-time buyers to help you make a confident decision.
            </p>

            {/* Budget Questions */}
            <div className="bg-primary text-white rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Budget & Affordability
              </h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  How much car can I afford?
                </h3>
                <p className="text-gray-700">
                  Follow the <strong>20/4/10 rule</strong>: Put 20% down, finance for no more than 4 years, and keep total car costs (payment + insurance + gas + maintenance) under 10% of your gross monthly income. For example, if you make $4,000/month, your total car costs should stay under $400.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Should I buy new or used for my first car?
                </h3>
                <p className="text-gray-700">
                  <strong>Used is almost always better for first-time buyers.</strong> New cars lose 20-30% of value in the first year. A 2-3 year old certified pre-owned car gives you reliability with significant savings. Save "new car" purchases for when you have more financial stability.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  How much should I put down?
                </h3>
                <p className="text-gray-700">
                  Aim for <strong>at least 10-20%</strong> of the purchase price. A larger down payment means lower monthly payments, less interest paid, and avoiding being "underwater" (owing more than the car is worth). If you can only afford a small down payment, consider a less expensive car.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  What hidden costs should I budget for?
                </h3>
                <p className="text-gray-700 mb-2">Beyond the purchase price, budget for:</p>
                <ul className="space-y-1">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Sales tax (6-10% of price in most states)</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Registration and title fees ($100-500)</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Insurance (often higher for new drivers)</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Maintenance fund ($50-100/month)</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Fuel costs</span></li>
                </ul>
              </div>
            </div>

            {/* Financing Questions */}
            <div className="bg-secondary text-white rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Financing & Credit</h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Can I get a car loan with no credit history?
                </h3>
                <p className="text-gray-700">
                  Yes, but expect higher interest rates. Options include: getting a co-signer with good credit, credit unions (often more flexible), "first-time buyer" programs at dealerships, or building credit first with a secured credit card for 6-12 months.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  What credit score do I need to buy a car?
                </h3>
                <p className="text-gray-700 mb-2">
                  You can get approved with almost any score, but rates vary dramatically:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• <strong>750+:</strong> Best rates (3-6% APR)</li>
                  <li>• <strong>700-749:</strong> Good rates (6-9% APR)</li>
                  <li>• <strong>650-699:</strong> Average rates (9-13% APR)</li>
                  <li>• <strong>600-649:</strong> Subprime (13-18% APR)</li>
                  <li>• <strong>Below 600:</strong> Deep subprime (18%+ APR)</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Should I get pre-approved before shopping?
                </h3>
                <p className="text-gray-700">
                  <strong>Absolutely yes!</strong> Pre-approval from your bank or credit union gives you negotiating power, shows dealers you're serious, and protects you from dealer financing markups. Apply to 2-3 lenders within 14 days (counts as one credit inquiry).
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  How long should my car loan be?
                </h3>
                <p className="text-gray-700">
                  <strong>48 months (4 years) or less is ideal.</strong> Longer loans (60, 72, 84 months) have lower payments but cost thousands more in interest and leave you underwater longer. If you need a 72+ month loan to afford the payment, the car is too expensive.
                </p>
              </div>
            </div>

            {/* Shopping Questions */}
            <div className="bg-green-600 text-white rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Shopping & Negotiating</h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Where should I buy my first car?
                </h3>
                <p className="text-gray-700 mb-2">Each option has pros and cons:</p>
                <ul className="text-sm space-y-1">
                  <li>• <strong>Franchised dealer:</strong> CPO options, financing, but higher prices</li>
                  <li>• <strong>Independent dealer:</strong> Lower prices, less selection</li>
                  <li>• <strong>CarMax/Carvana:</strong> No-haggle, easy process, fair prices</li>
                  <li>• <strong>Private seller:</strong> Best prices, but more risk and no warranty</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  How do I negotiate without experience?
                </h3>
                <p className="text-gray-700 mb-2">Follow these rules:</p>
                <ul className="space-y-1">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Know the fair market value before you go (KBB, Edmunds)</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Focus on OUT-THE-DOOR price, not monthly payment</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Be willing to walk away - there are always other cars</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Get quotes from 3+ dealers via email first</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Don't reveal your budget or monthly payment target</span></li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  What should I look for during a test drive?
                </h3>
                <p className="text-gray-700 mb-2">Test drive for at least 20-30 minutes and check:</p>
                <ul className="space-y-1">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Visibility and blind spots</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Acceleration and braking feel</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Highway driving (noise, stability)</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Parking (size, backup camera)</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Comfort of seats and driving position</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Technology (phone connectivity, navigation)</span></li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Do I need a pre-purchase inspection?
                </h3>
                <p className="text-gray-700">
                  <strong>Yes, for any used car!</strong> Pay $100-150 for a mechanic to inspect it. They'll find issues you'd miss and can save you thousands. Skip this only for CPO cars with warranty. If a seller refuses an inspection, walk away.
                </p>
              </div>
            </div>

            {/* Insurance & Ownership */}
            <div className="bg-purple-600 text-white rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Insurance & Ownership</h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  When do I need insurance?
                </h3>
                <p className="text-gray-700">
                  <strong>Before you drive off the lot.</strong> Get insurance quotes while shopping and have a policy ready to activate. Most dealers won't let you leave without proof of insurance. Your current policy (if any) may cover a new purchase for a few days - check with your insurer.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Why is insurance so expensive for new drivers?
                </h3>
                <p className="text-gray-700 mb-2">
                  Insurance companies base rates on risk. New drivers have no driving history to prove they're safe. To lower costs:
                </p>
                <ul className="space-y-1">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Stay on parents' policy if possible</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Take a defensive driving course</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Choose a car with good safety ratings</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Avoid sports cars and luxury vehicles</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Good student discount (if applicable)</span></li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  What are the best first cars?
                </h3>
                <p className="text-gray-700 mb-2">Look for reliability, safety, and low cost of ownership:</p>
                <ul className="space-y-1">
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Honda Civic/Accord:</strong> Reliable, holds value, affordable parts</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Toyota Corolla/Camry:</strong> Legendary reliability, low maintenance</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Mazda3:</strong> Fun to drive, reliable, great value</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Hyundai Elantra:</strong> Great warranty, affordable</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Subaru Impreza:</strong> AWD, safe, reliable</span></li>
                </ul>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-red-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Top 10 First-Time Buyer Mistakes
              </h2>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Focusing on monthly payment instead of total price</li>
                <li>Not getting pre-approved for financing</li>
                <li>Skipping the pre-purchase inspection</li>
                <li>Buying more car than you can afford</li>
                <li>Forgetting to budget for insurance, gas, and maintenance</li>
                <li>Not researching the car's reliability history</li>
                <li>Falling in love with the first car you see</li>
                <li>Signing without reading all paperwork</li>
                <li>Buying unnecessary add-ons (extended warranty, paint protection)</li>
                <li>Not walking away when the deal isn't right</li>
              </ol>
            </div>

            <div className="bg-primary text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Find Your First Car?</h3>
              <p className="text-blue-100 mb-6">
                Browse thousands of quality used cars from trusted dealerships. Compare prices, check vehicle history, and find the perfect first car.
              </p>
              <Link
                href="/cars"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Start Browsing
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
