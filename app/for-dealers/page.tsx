'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Zap,
  Search,
  Globe,
  BarChart3,
  Shield,
  Clock,
  Award,
  Bot,
  Target,
  Rocket,
} from 'lucide-react';
import Footer from '../components/Footer';
import { LogoWithBeam } from '@/components/LogoWithBeam';

export default function ForDealersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dark shadow-md sticky top-0 z-50 h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center h-full py-1">
            <LogoWithBeam className="h-full" />
          </Link>
          <nav className="hidden lg:flex gap-6 text-sm font-semibold">
            <Link href="/cars" className="text-gray-300 hover:text-primary transition-colors">
              Cars for Sale
            </Link>
            <Link href="/for-dealers" className="text-primary transition-colors">
              For Dealers
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-primary transition-colors">
              About Us
            </Link>
          </nav>
          <div className="flex gap-3">
            <Link href="/login" className="text-gray-300 hover:text-primary px-5 py-2.5 rounded-lg transition-colors font-semibold">
              Dealer Login
            </Link>
            <Link href="/register?type=dealer" className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
              Start Free Pilot
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark via-gray-900 to-dark text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Native Automotive Marketplace</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Future-Proof Your Dealership:<br />
              <span className="text-primary">Get More Leads, Close More Sales</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              In just <strong className="text-white">40+ days</strong> after launch, IQ Auto Deals generated over{' '}
              <strong className="text-white">40,000 clicks</strong> and consistently ranked{' '}
              <strong className="text-white">top 3 in AI searches</strong> — all with dummy inventory.
              Imagine what it can do with your real vehicles.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/for-dealers/book-demo"
                className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/25"
              >
                <Rocket className="w-5 h-5" />
                Book Demo Now
              </Link>
              <Link
                href="/register?type=dealer"
                className="bg-white text-dark px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Sign Up for 90-Day Free Pilot
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Text */}
            <p className="text-sm text-gray-400">
              Risk-free 90-day pilot • No obligation • Seamless inventory integration • Exclusive "family pricing" for early adopters
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">40,000+</div>
              <div className="text-sm text-gray-600">Clicks in 40 Days</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">Top 3</div>
              <div className="text-sm text-gray-600">AI Search Rankings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">80%</div>
              <div className="text-sm text-gray-600">AI-Generated Descriptions</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">$0</div>
              <div className="text-sm text-gray-600">Paid Ads Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* The AI Shift Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                The Auto Industry Is Changing Fast — Are You Ready?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Younger buyers aren't searching on Google anymore — they're using AI platforms like{' '}
                <strong>ChatGPT</strong> and <strong>Perplexity</strong> to find their next car.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Legacy Platforms */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-dark">Legacy Marketplaces</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Traditional listing sites
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Stuck on outdated platforms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Slow to adapt to AI search
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    Missing AI search traffic
                  </li>
                </ul>
              </div>

              {/* IQ Auto Deals */}
              <div className="bg-primary/5 p-8 rounded-xl border-2 border-primary shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark">IQ Auto Deals</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>First AI-native</strong> digital marketplace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Built to evolve and self-optimize</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Captures massive AI search traffic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Boosts your website SEO rankings</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/for-dealers/book-demo"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-colors"
              >
                <Rocket className="w-5 h-5" />
                Book Demo Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Superior Technology That Drives Real Results
            </h2>
            <p className="text-lg text-gray-600">
              Why leading dealers are choosing IQ Auto Deals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Agentic AI SEO</h3>
              <p className="text-gray-600 leading-relaxed">
                One-click (or automatic) unique descriptions optimized for local searches using Google's algorithm.
                No more duplicate content penalties — maximize visibility and relevance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Proactive Customer Engagement</h3>
              <p className="text-gray-600 leading-relaxed">
                We're the <strong>only platform</strong> that lets you initiate contact with shoppers browsing your inventory.
                Automatic leads when customers view 3+ vehicles — turn browsers into buyers fast.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">SEO Boost for Your Website</h3>
              <p className="text-gray-600 leading-relaxed">
                Verified backlinks + authority building = higher rankings on your own site.
                Your dealership naturally appears at the top of AI overviews — no paid ads required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Dealers Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Join Leading Dealers Already Seeing Results
            </h2>
            <p className="text-lg text-gray-600">
              Trusted pilot partners testing the future of automotive sales
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto mb-12">
            {[
              'Turpin Dodge',
              'Lexus of Nashville',
              'Lexus of Cool Springs',
              'Interstate Motors',
              'Portage Ford',
            ].map((dealer) => (
              <div
                key={dealer}
                className="bg-white px-8 py-4 rounded-xl border border-gray-200 shadow-sm"
              >
                <span className="text-lg font-semibold text-dark">{dealer}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            These forward-thinking dealerships are testing the future — and getting extra leads with{' '}
            <strong>zero risk</strong>.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Start Free for 90 Days — Then Lock in Exclusive Early-Adopter Pricing
            </h2>
            <p className="text-lg text-gray-600">
              No surprises. No long-term contracts during the pilot. Just real results and the lowest cost in the industry.
            </p>
          </div>

          {/* Pricing Table */}
          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 shadow-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-gray-600 font-medium"></th>
                  <th className="px-6 py-4 text-center">
                    <div className="bg-primary/10 rounded-lg py-2 px-4">
                      <span className="text-primary font-bold">90-Day Risk-Free Pilot</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-gray-700 font-semibold">After Pilot<br />(Early Adopter Rate)</th>
                  <th className="px-6 py-4 text-center text-gray-500 font-medium">Typical Legacy<br />Competitors</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-dark">Monthly Subscription</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-2xl font-bold text-green-600">$0</span>
                    <p className="text-xs text-gray-500 mt-1">Completely free for 90 days</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xl font-bold text-dark">$2,500</span>
                    <span className="text-gray-500">/month</span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-500">$3,500 – $4,000+/month</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-dark">Full Marketplace Listing</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-gray-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-dark">Agentic AI SEO & Unique Descriptions</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-gray-500 text-sm">Not available or extra cost</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-dark">Proactive Customer Engagement Leads</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-gray-500 text-sm">Not available</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-4 font-medium text-dark">Commitment</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">None — cancel anytime</td>
                  <td className="px-6 py-4 text-center text-gray-600">Month-to-month</td>
                  <td className="px-6 py-4 text-center text-gray-500 text-sm">12–36 month contracts</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 font-bold text-dark">Total First 90 Days</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-2xl font-bold text-green-600">$0</span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">—</td>
                  <td className="px-6 py-4 text-center text-gray-500">$10,000 – $15,000+ upfront</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Value Highlight */}
          <div className="max-w-3xl mx-auto mt-8 text-center">
            <p className="text-lg text-gray-700 mb-6">
              Most dealerships will save <strong className="text-primary">$10,000 – $15,000 per month</strong> by
              consolidating outdated tools with our all-in-one Dealer Agentics suite — while getting superior
              AI-driven leads competitors can't match.
            </p>

            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-8">
              <Award className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">
                Exclusive "family pricing" locked in forever for dealers who join during the pilot phase.
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register?type=dealer"
                className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/25"
              >
                Sign Up for 90-Day Pilot Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/for-dealers/book-demo"
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Book a Quick Demo
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Free 90-day pilot with full marketplace access.
              You only pay monthly if you choose to continue after the pilot.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              What Dealers Are Saying
            </h2>
            <p className="text-lg text-gray-600">
              Early feedback from our pilot partners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 italic mb-6">
                "The AI SEO and proactive leads are game-changers. We're already seeing traffic we never got before."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark">Early Pilot Dealer</p>
                  <p className="text-sm text-gray-500">Pilot Partner</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 italic mb-6">
                "Consolidating tools with Dealer Agentics will save us thousands monthly while giving better insights."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark">Used Car Manager</p>
                  <p className="text-sm text-gray-500">Pilot Partner</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 italic mb-6">
                "AI-native platforms like this are essential for survival in today's market."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-dark">Rafael Martinez</p>
                  <p className="text-sm text-gray-500">Industry Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk-Free Pilot Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Try It Free for 90 Days — No Risk, All Reward
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join the future of automotive sales today
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Seamless inventory setup</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Full marketplace access</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Extra leads & sales</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Family pricing locked in</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register?type=dealer"
                className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Sign Up for Free Pilot Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/for-dealers/book-demo"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-lg"
              >
                Book a Quick Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Don't Get Left Behind in the AI Era
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            More leads. Higher rankings. Better tools. Lower costs. Start your free pilot today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/for-dealers/book-demo"
              className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Rocket className="w-5 h-5" />
              Book Demo Now
            </Link>
            <Link
              href="/register?type=dealer"
              className="bg-white text-dark px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-lg"
            >
              Sign Up Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <p className="text-sm text-gray-400">
            Powered by experienced auto veterans (Derek Furrer, Joe Duran) • Focused on authentic culture and family values
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
