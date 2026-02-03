import Link from 'next/link';
import { Calendar, ArrowLeft, CheckCircle, X, TrendingDown, User } from 'lucide-react';
import type { Metadata } from 'next';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import BlogPostingSchema from '@/app/components/BlogPostingSchema';
import BreadcrumbSchema from '@/app/components/BreadcrumbSchema';
import { authors } from '@/lib/authors';

// Force static generation for SEO
export const dynamic = 'force-static';

// Article metadata
const article = {
  title: 'New vs Used Cars: The Ultimate Guide for First-Time Buyers',
  description: 'Should you buy new or used? Compare costs, depreciation, reliability, and financing. Expert advice to help first-time car buyers make the right choice.',
  datePublished: '2025-09-20',
  dateModified: '2025-12-15',
  author: authors['editorial-team'],
  category: 'Buying Guide',
  readTime: '10 min read',
  wordCount: 2400,
  keywords: ['new vs used cars', 'first time car buyer', 'should I buy new or used', 'car depreciation', 'used car benefits', 'new car warranty', 'certified pre-owned'],
  url: 'https://iqautodeals.com/blog/new-vs-used-cars-first-time-buyers',
};

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  keywords: article.keywords.join(', '),
  authors: [{ name: article.author.name }],
  openGraph: {
    title: article.title,
    description: article.description,
    type: 'article',
    publishedTime: article.datePublished,
    modifiedTime: article.dateModified,
    authors: [article.author.name],
    section: article.category,
  },
};

export default function NewVsUsedArticle() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://iqautodeals.com' },
    { name: 'Blog', url: 'https://iqautodeals.com/blog' },
    { name: article.title, url: article.url },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema Markup */}
      <BlogPostingSchema
        title={article.title}
        description={article.description}
        datePublished={article.datePublished}
        dateModified={article.dateModified}
        author={article.author}
        url={article.url}
        wordCount={article.wordCount}
        keywords={article.keywords}
        category={article.category}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200 h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full" variant="dark" />
          </Link>
          <Link href="/blog" className="text-primary hover:underline font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <nav className="container mx-auto px-4 py-4 max-w-4xl">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.url} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium truncate max-w-[200px]">{crumb.name}</span>
              ) : (
                <Link href={crumb.url} className="hover:text-primary">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Article Header */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="mb-6">
            <span className="bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            {article.title}
          </h1>

          {/* Author Attribution */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-dark">{article.author.name}</p>
                <p className="text-sm text-gray-500">{article.author.jobTitle}</p>
              </div>
            </div>
            <div className="sm:ml-auto flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.datePublished}>
                  {new Date(article.datePublished).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Buying your first car is exciting, but the decision between new and used can be overwhelming. This comprehensive guide breaks down the real costs, benefits, and drawbacks of each option to help you make an informed choice that fits your budget and lifestyle.
            </p>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">The Quick Answer</h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <p className="text-gray-800 text-lg">
                <strong>For most first-time buyers, a 2-4 year old used car offers the best value.</strong> You avoid the steepest depreciation, get modern features and safety technology, and save 30-40% compared to buying new while still getting years of reliable service.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Cost Comparison: The Real Numbers</h2>

            <h3 className="text-2xl font-bold text-dark mt-8 mb-4">Example: Honda Civic</h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left">Option</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">Purchase Price</th>
                    <th className="border border-gray-300 px-4 py-3 text-right">5-Year Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-semibold">2025 New Civic</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">$28,000</td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-red-600 font-bold">$38,500*</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="border border-gray-300 px-4 py-3 font-semibold">2022 Used Civic (3 years old)</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">$19,500</td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-green-600 font-bold">$24,200*</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-semibold text-primary">Savings with Used</td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-primary font-bold">$8,500</td>
                    <td className="border border-gray-300 px-4 py-3 text-right text-primary font-bold">$14,300</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-600 mt-2">*Includes depreciation, insurance, maintenance, and interest</p>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Understanding Depreciation</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Depreciation is the single biggest cost of car ownership, and it hits new cars hardest:
            </p>

            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-red-600" />
                How New Cars Lose Value
              </h3>
              <ul className="space-y-2 text-gray-800">
                <li><strong>Year 1:</strong> Loses 20-30% of value ($5,600-$8,400 on a $28k car)</li>
                <li><strong>Year 3:</strong> Loses 40-50% of value ($11,200-$14,000)</li>
                <li><strong>Year 5:</strong> Loses 55-65% of value ($15,400-$18,200)</li>
              </ul>
              <p className="mt-4 text-red-700 font-semibold">
                A $28,000 new car becomes worth just $10,000-$13,000 after 5 years!
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              When you buy a 2-3 year old used car, someone else absorbed the steepest depreciation. The car will still lose value, but at a much slower rate.
            </p>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Pros and Cons Breakdown</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* New Car Pros */}
              <div className="border-2 border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  New Car Advantages
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Full manufacturer warranty (3-5 years)</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Latest safety features and technology</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Better fuel efficiency</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Lower interest rates (0-3% financing)</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">No previous owner damage or neglect</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Free maintenance (some brands)</span>
                  </li>
                </ul>
              </div>

              {/* New Car Cons */}
              <div className="border-2 border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <X className="w-6 h-6 text-red-600" />
                  New Car Disadvantages
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Massive depreciation (20-30% year 1)</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Higher insurance costs (15-30% more)</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Higher registration fees</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">More expensive to replace if totaled</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Stress about first scratch or ding</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Potential early model year bugs</span>
                  </li>
                </ul>
              </div>

              {/* Used Car Pros */}
              <div className="border-2 border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Used Car Advantages
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">30-50% lower purchase price</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Slower depreciation rate</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Lower insurance costs</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">More car for your money (luxury brands affordable)</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Proven reliability (no lemon risk)</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">CPO options with warranty available</span>
                  </li>
                </ul>
              </div>

              {/* Used Car Cons */}
              <div className="border-2 border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                  <X className="w-6 h-6 text-red-600" />
                  Used Car Disadvantages
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Unknown maintenance history (unless CPO)</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Shorter remaining warranty</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Higher interest rates (7-12%)</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">May need repairs sooner</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Older technology and safety features</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Requires careful inspection before buying</span>
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">When to Buy New</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A new car makes sense if you:
            </p>
            <ul className="space-y-2 mb-8 ml-6">
              <li className="text-gray-700">✓ Plan to keep the car for 10+ years (spreading depreciation over many years)</li>
              <li className="text-gray-700">✓ Want the absolute latest safety technology (adaptive cruise, blind spot, etc.)</li>
              <li className="text-gray-700">✓ Drive 20,000+ miles/year (warranty covers more of your ownership)</li>
              <li className="text-gray-700">✓ Have excellent credit and can get 0-2% financing</li>
              <li className="text-gray-700">✓ Can afford the higher payment without stretching your budget</li>
              <li className="text-gray-700">✓ Value peace of mind and not worrying about repairs</li>
            </ul>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">When to Buy Used</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A used car is the smarter choice if you:
            </p>
            <ul className="space-y-2 mb-8 ml-6">
              <li className="text-gray-700">✓ Want to maximize value and minimize total cost of ownership</li>
              <li className="text-gray-700">✓ Are on a tight budget or saving for other goals</li>
              <li className="text-gray-700">✓ Can do basic research and vehicle inspection</li>
              <li className="text-gray-700">✓ Don't need the absolute newest features</li>
              <li className="text-gray-700">✓ Are okay with potentially higher maintenance costs in years 5-10</li>
              <li className="text-gray-700">✓ Want to avoid massive depreciation hit</li>
            </ul>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">The Sweet Spot: Certified Pre-Owned (CPO)</h2>
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-dark mb-4">Best of Both Worlds</h3>
              <p className="text-gray-700 mb-4">
                Certified Pre-Owned cars offer a middle ground between new and used:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>2-4 years old</strong> with low mileage (under 50k miles)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Manufacturer-backed warranty</strong> (often 6yr/100k miles)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Rigorous inspection</strong> (150+ point check)</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Roadside assistance</strong> and special financing</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>15-25% cheaper</strong> than new with most depreciation gone</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Final Recommendation</h2>
            <div className="bg-primary text-white rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">For Most First-Time Buyers:</h3>
              <p className="text-blue-100 text-lg mb-4">
                <strong>Buy a 2-4 year old used car (preferably CPO)</strong> with under 40,000 miles from a reliable brand (Toyota, Honda, Mazda, Hyundai, Kia).
              </p>
              <p className="text-blue-100">
                You'll save $8,000-$15,000, avoid the steepest depreciation, get modern features, and still have years of reliable service ahead. Use the money you save to build an emergency fund, pay down debt, or invest for your future.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Ready to Start Shopping?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you decide on new or used, IQ Auto Deals makes it easy to compare prices from local dealers, get competitive offers, and find the perfect car for your budget.
            </p>

            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Link
                href="/cars"
                className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-colors text-lg"
              >
                Browse Quality Used Cars Now
              </Link>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-dark mb-4">About the Author</h3>
            <div className="flex gap-4 items-start">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-dark">{article.author.name}</p>
                <p className="text-sm text-primary mb-2">{article.author.jobTitle}</p>
                <p className="text-gray-600 text-sm">{article.author.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-dark mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/how-to-finance-used-car-2025" className="group">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                <h3 className="font-bold text-dark group-hover:text-primary mb-2">
                  How to Finance a Used Car in 2025
                </h3>
                <p className="text-sm text-gray-600">Get the best rates and terms on your auto loan</p>
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
