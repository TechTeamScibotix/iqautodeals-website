import Link from 'next/link';
import { Suspense } from 'react';
import {
  Search,
  TrendingDown,
  CheckCircle,
  Users,
  DollarSign,
  Award,
  MapPin,
  Car,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import HomeClient from './HomeClient';
import FAQSchema from './components/FAQSchema';

// Force static generation for SEO
export const dynamic = 'force-static';

// Server component - renders SEO-critical text content for AI crawlers (ChatGPT, Perplexity, Google AI)
// Text sections are server-rendered and passed as props to the client component using the Next.js composition pattern
export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient
        howItWorksSection={
          <section className="container mx-auto px-4 py-10">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">How to Buy New & Pre-Owned Vehicles Online</h2>
              <p className="text-base text-text-secondary">Browse vehicles, request competitive offers from verified dealers, and save thousands.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-black p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">1. Search Locally</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Browse thousands of vehicles from dealers near you.
                </p>
              </div>

              <div className="bg-black p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <TrendingDown className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">2. Request Deals</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Select up to 4 cars and get dealers competing for your business.
                </p>
              </div>

              <div className="bg-black p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">3. Choose & Reserve</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Accept the best offer and reserve your vehicle.
                </p>
              </div>
            </div>
          </section>
        }

        benefitsSection={
          <section className="bg-white py-20 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Why Choose Our Nationwide Car Marketplace?</h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  The trusted online marketplace for new, certified pre-owned, and quality pre-owned vehicles. Compare prices from verified dealers who compete for your business.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* For Buyers */}
                <div className="bg-black p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">For Buyers</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Search thousands of vehicles from local dealers</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Select up to 4 cars and watch dealers compete for your business</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Get up to 4 competitive offers per vehicle</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Reserve your car at the best price</span>
                    </li>
                  </ul>
                </div>

                {/* For Dealers */}
                <div className="bg-black p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">For Dealers</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">90-day free trial - Silver, Gold, Platinum packages</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Connect with serious, motivated buyers</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Submit competitive offers to win deals</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Close more sales faster</span>
                    </li>
                  </ul>
                  <Link
                    href="/for-dealers"
                    className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition-colors"
                  >
                    Learn More About Dealer Benefits
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        }

        resourcesSection={
          <section className="bg-white py-20 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Car Buying Guides & Resources</h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Expert advice to help you make informed decisions about buying your next used car
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/blog/how-to-finance-used-car-2025" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    How to Finance a Used Car
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Complete guide to getting the best auto loan rates and terms
                  </p>
                  <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <ArrowRight className="w-4 h-4" /></span>
                </Link>

                <Link href="/blog/new-vs-used-cars-first-time-buyers" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    New vs Used Cars
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Which option is best for first-time buyers? Compare costs and benefits
                  </p>
                  <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <ArrowRight className="w-4 h-4" /></span>
                </Link>

                <Link href="/blog/best-used-cars-under-20k" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    Best Used Cars Under $20k
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Our expert picks for reliable, affordable vehicles in 2025
                  </p>
                  <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read Article <ArrowRight className="w-4 h-4" /></span>
                </Link>

                <Link href="/guides/how-to-buy-used-car" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-accent transition-colors">
                    How to Buy a Used Car
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Step-by-step guide to avoid problems and get the best deal
                  </p>
                  <span className="text-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">View Guide <ArrowRight className="w-4 h-4" /></span>
                </Link>

                <Link href="/guides/car-financing-guide" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <DollarSign className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-accent transition-colors">
                    Car Financing Guide
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Improve your credit, compare lenders, and negotiate better rates
                  </p>
                  <span className="text-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">View Guide <ArrowRight className="w-4 h-4" /></span>
                </Link>

                <Link href="/guides/pre-purchase-inspection" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-accent transition-colors">
                    Pre-Purchase Inspection
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Complete checklist to inspect any used car before buying
                  </p>
                  <span className="text-accent font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">View Checklist <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/blog"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-pill text-lg font-bold hover:bg-primary-dark transition-colors"
                >
                  View All Articles
                </Link>
              </div>
            </div>
          </section>
        }

        browseSection={
          <section className="bg-white py-20 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Shop Cars by Location or Model
                </h2>
                <p className="text-lg text-text-secondary">Find the perfect vehicle in your area or browse by your favorite make and model</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Browse by Location */}
                <Link href="/locations" className="bg-black rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Browse by Location</h3>
                  </div>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Find used cars from trusted dealers in your city. We cover all 50 states and 180+ major cities across the US.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Atlanta</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Los Angeles</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Houston</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Chicago</span>
                    <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-pill text-sm font-medium">+178 more</span>
                  </div>
                  <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                    View All Locations
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Browse by Model */}
                <Link href="/models" className="bg-black rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                      <Car className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Browse by Model</h3>
                  </div>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Shop used cars by your favorite make and model. Find popular vehicles from Toyota, Honda, Ford, Chevrolet, and more.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Toyota Tacoma</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Honda Civic</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Ford F-150</span>
                    <span className="bg-white/10 px-3 py-1.5 rounded-pill text-sm font-medium text-gray-300">Jeep Wrangler</span>
                    <span className="bg-accent/20 text-accent px-3 py-1.5 rounded-pill text-sm font-medium">+58 more</span>
                  </div>
                  <div className="flex items-center text-accent font-semibold group-hover:gap-3 transition-all">
                    View All Models
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </section>
        }

        faqSection={
          <section className="bg-light-dark py-20 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 flex items-center justify-center gap-3">
                  <HelpCircle className="w-10 h-10 text-primary" />
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-text-secondary">Everything you need to know about buying and selling cars on IQ Auto Deals</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">How does our platform work?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Our nationwide marketplace connects you with the best deals on quality used cars. Browse thousands of vehicles from local dealers within 50 miles, select up to 4 cars you love, and request competitive offers. Dealers compete to win your business by offering their lowest prices. You simply choose the best deal and reserve your car.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">Is it free for car buyers?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Yes! Searching for cars and requesting dealer offers is completely free. There are no hidden fees, no membership costs, and no obligations. You only pay when you decide to purchase a vehicle from a dealer.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">How much can I save with online car shopping?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    By creating competition between dealers, you get their absolute best price upfront without negotiating at multiple dealerships. Dealers bring their A-game to win your business — and you compare up to 4 offers side by side.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">How many dealer offers will I receive?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    You can receive up to 4 competitive offers per vehicle from different dealers. This gives you multiple options to compare and ensures you get the best deal available in your area.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">What types of vehicles are available?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    We offer a wide selection of new and used cars from certified dealers nationwide. Our inventory includes sedans, SUVs, trucks, luxury vehicles, and certified pre-owned cars. All vehicles are inspected and verified by licensed dealerships.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">How do I accept a deal and purchase a car?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Once you receive offers from dealers, you can review and compare them in your dashboard. When you find the best deal, simply accept the offer to reserve the vehicle. The dealer will contact you to schedule a test drive and complete the purchase process at their dealership.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">Can I negotiate the price after receiving an offer?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    While dealers submit their most competitive prices through our platform, you can still communicate directly with them after accepting an offer. However, most buyers find the offers already represent the best possible prices since dealers compete hard to win your business!
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">Are the dealers certified and legitimate?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Yes! All dealers on our marketplace are licensed, certified automotive dealerships. We verify each dealer&apos;s credentials, business license, and reputation before approval. You can buy with confidence knowing you&apos;re working with legitimate, professional dealers.
                  </p>
                </div>
              </div>

              <FAQSchema faqs={[
                {
                  question: 'How does the platform work?',
                  answer: "Our nationwide marketplace connects you with the best deals on quality used cars. Browse thousands of vehicles from local dealers within 50 miles, select up to 4 cars you love, and request competitive offers. Dealers compete to win your business by offering their lowest prices. You simply choose the best deal and reserve your car."
                },
                {
                  question: 'Is it free for car buyers?',
                  answer: 'Yes! Searching for cars and requesting dealer offers is completely free. There are no hidden fees, no membership costs, and no obligations. You only pay when you decide to purchase a vehicle from a dealer.'
                },
                {
                  question: 'How much can I save with online car shopping?',
                  answer: 'By creating competition between dealers, you get their absolute best price upfront without negotiating at multiple dealerships. Compare up to 4 competing offers side by side and choose the best deal.'
                },
                {
                  question: 'How many dealer offers will I receive?',
                  answer: 'You can receive up to 4 competitive offers per vehicle from different dealers. This gives you multiple options to compare and ensures you get the best deal available in your area.'
                },
                {
                  question: 'What types of vehicles are available?',
                  answer: 'We offer a wide selection of new and used cars from certified dealers nationwide. Our inventory includes sedans, SUVs, trucks, luxury vehicles, and certified pre-owned cars.'
                },
                {
                  question: 'How do I accept a deal and purchase a car?',
                  answer: 'Once you receive offers from dealers, you can review and compare them in your dashboard. When you find the best deal, simply accept the offer to reserve the vehicle. The dealer will contact you to schedule a test drive and complete the purchase.'
                },
                {
                  question: 'Can I negotiate the price after receiving an offer?',
                  answer: 'While dealers submit their most competitive prices through our platform, you can still communicate directly with them after accepting an offer. However, most buyers find the offers already represent the best possible prices since dealers compete hard to win your business!'
                },
                {
                  question: 'Are the dealers certified and legitimate?',
                  answer: 'Yes! All dealers on our marketplace are licensed, certified automotive dealerships. We verify each dealer credentials, business license, and reputation before approval.'
                }
              ]} />
            </div>
          </section>
        }
      />
    </Suspense>
  );
}
