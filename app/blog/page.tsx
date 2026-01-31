import Link from 'next/link';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Car Buying Tips & Guides - Expert Advice | IQ Auto Deals Blog',
  description: 'Expert tips on buying used cars, financing, inspections, and getting the best deals. Free guides to help you make smart car buying decisions.',
  keywords: 'car buying tips, used car guide, car financing advice, pre-purchase inspection, best used cars, car buying checklist',
};

const blogPosts = [
  {
    slug: 'how-to-finance-used-car-2025',
    title: 'How to Finance a Used Car in 2025: Complete Guide',
    excerpt: 'Learn everything you need to know about financing a used car, from credit scores to interest rates, and how to get the best deal on your auto loan.',
    date: 'November 1, 2025',
    readTime: '8 min read',
    category: 'Financing',
  },
  {
    slug: 'new-vs-used-cars-first-time-buyers',
    title: 'New vs Used Cars: The Ultimate Guide for First-Time Buyers',
    excerpt: 'Deciding between a new or used car? This comprehensive guide breaks down the pros, cons, and costs to help first-time buyers make the right choice.',
    date: 'November 1, 2025',
    readTime: '10 min read',
    category: 'Buying Guide',
  },
  {
    slug: 'best-used-cars-under-20k',
    title: 'Best Used Cars Under $20,000 in 2025',
    excerpt: 'Discover the most reliable and value-packed used cars you can buy for under $20k. Our expert picks cover sedans, SUVs, and trucks.',
    date: 'November 1, 2025',
    readTime: '7 min read',
    category: 'Recommendations',
  },
];

const guides = [
  {
    slug: 'how-to-buy-used-car',
    title: 'How to Buy a Used Car: Complete Step-by-Step Guide',
    excerpt: 'Follow this proven 10-step process to avoid problems and get the best deal on your next used car purchase.',
    readTime: '12 min read',
    category: 'Buying Guide',
  },
  {
    slug: 'car-financing-guide',
    title: 'Car Financing Guide: Everything You Need to Know',
    excerpt: 'Understand auto loans, interest rates, and how to get the best financing terms for your next vehicle.',
    readTime: '10 min read',
    category: 'Financing',
  },
  {
    slug: 'pre-purchase-inspection',
    title: 'Pre-Purchase Inspection Checklist',
    excerpt: 'Complete checklist of what to inspect before buying a used car. Don\'t miss these critical items.',
    readTime: '8 min read',
    category: 'Inspection',
  },
  {
    slug: 'vehicle-maintenance',
    title: 'Complete Vehicle Maintenance Guide & Schedule',
    excerpt: 'Essential car maintenance schedule: oil changes, tire rotation, brake checks, and more to keep your car running smoothly.',
    readTime: '10 min read',
    category: 'Maintenance',
  },
  {
    slug: 'trade-in-value',
    title: 'How to Maximize Your Car Trade-In Value',
    excerpt: 'Get the most money for your trade-in with expert tips on preparation, negotiation, and timing.',
    readTime: '9 min read',
    category: 'Selling',
  },
  {
    slug: 'vin-decoder',
    title: 'VIN Decoder Guide: Understanding Vehicle History',
    excerpt: 'Learn how to decode a VIN number and use vehicle history reports to make informed buying decisions.',
    readTime: '8 min read',
    category: 'Research',
  },
  {
    slug: 'warranty-guide',
    title: 'Car Warranty Guide: CPO vs Extended Warranties',
    excerpt: 'Understand manufacturer warranties, CPO programs, and extended warranties to protect your investment.',
    readTime: '11 min read',
    category: 'Protection',
  },
  {
    slug: 'car-insurance-basics',
    title: 'Car Insurance Basics: Coverage Types & How to Save',
    excerpt: 'Understand auto insurance coverage types and learn proven strategies to lower your premium.',
    readTime: '10 min read',
    category: 'Insurance',
  },
  {
    slug: 'first-time-buyer-faq',
    title: 'First-Time Car Buyer FAQ: 25 Questions Answered',
    excerpt: 'Everything first-time car buyers need to know about financing, negotiation, insurance, and common mistakes.',
    readTime: '15 min read',
    category: 'Buying Guide',
  },
  {
    slug: 'lease-vs-buy',
    title: 'Lease vs Buy: Which Is Right for You?',
    excerpt: 'Compare the true costs of leasing versus buying a car and find out which option fits your situation.',
    readTime: '12 min read',
    category: 'Buying Guide',
  },
  {
    slug: 'credit-score-auto-loans',
    title: 'Credit Scores & Auto Loans: Get the Best Rate',
    excerpt: 'Understand how credit scores affect auto loan rates and learn strategies to get approved with any credit.',
    readTime: '11 min read',
    category: 'Financing',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black shadow-md sticky top-0 z-50 h-14 md:h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full max-h-8 md:max-h-14" />
          </Link>
          <Link href="/" className="text-gray-300 hover:text-white font-semibold">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Car Buying Blog</h1>
            </div>
            <p className="text-xl text-gray-300">
              Expert tips, guides, and advice to help you buy your next used car with confidence
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-dark mb-8">Latest Articles</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-3">
                  <span className="bg-blue-50 px-3 py-1 rounded-full">{post.category}</span>
                </div>

                <h2 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>

                <div className="mt-4 flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Guides Grid */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-dark mb-8">In-Depth Guides</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-3">
                  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">{guide.category}</span>
                </div>

                <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {guide.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span className="text-green-600 font-medium">Guide</span>
                  <span>{guide.readTime}</span>
                </div>

                <div className="mt-4 flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  Read Guide
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Car?</h2>
          <p className="text-xl text-gray-300 mb-6">
            Browse thousands of quality used cars and get competitive offers from local dealers
          </p>
          <Link
            href="/cars"
            className="inline-block bg-primary text-white px-8 py-4 rounded-pill text-lg font-bold hover:bg-primary-dark transition-colors"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
}
