'use client';

import Link from 'next/link';
import { Car, Users, DollarSign, Shield, Award, MapPin, CheckCircle, ArrowRight, Building2, Target, Lightbulb } from 'lucide-react';
import Footer from '../components/Footer';
import AboutSchema from './AboutSchema';
import { LogoWithBeam } from '@/components/LogoWithBeam';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AboutSchema />
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
            <Link href="/about" className="text-primary transition-colors">
              About Us
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-primary transition-colors">
              Blog
            </Link>
          </nav>
          <div className="flex gap-3">
            <Link href="/login" className="text-gray-300 hover:text-primary px-5 py-2.5 rounded-lg transition-colors font-semibold">
              Sign In
            </Link>
            <Link href="/register" className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About IQ Auto Deals
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              IQ Auto Deals is an online used car marketplace that connects car buyers with certified dealers across the United States. Our platform enables customers to browse thousands of quality pre-owned vehicles and receive competitive offers from dealers who compete for their business.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-dark mb-8 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              Company Overview
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p>
                <strong>IQ Auto Deals</strong> is a technology company headquartered in Atlanta, Georgia, operating a nationwide online marketplace for used cars. Founded in 2024, the company has quickly established itself as an innovative platform in the automotive retail industry.
              </p>

              <p>
                The platform serves two primary customer segments: car buyers seeking quality pre-owned vehicles at competitive prices, and licensed auto dealers looking to connect with motivated buyers. IQ Auto Deals differentiates itself through its unique dealer competition model, where multiple dealers can submit offers on vehicles that customers are interested in.
              </p>

              <h3 className="text-2xl font-bold text-dark mt-8 mb-4">How IQ Auto Deals Works</h3>

              <p>
                For car buyers, the process is straightforward and free:
              </p>

              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Browse Inventory</strong>: Search thousands of used cars from certified dealers within 50 miles of your location</li>
                <li><strong>Select Vehicles</strong>: Choose up to 4 cars you are interested in purchasing</li>
                <li><strong>Request Offers</strong>: Submit a deal request and receive up to 3 competitive offers per vehicle</li>
                <li><strong>Compare & Choose</strong>: Review offers from different dealers and select the best deal</li>
                <li><strong>Reserve & Purchase</strong>: Accept an offer to reserve your vehicle and complete the purchase at the dealership</li>
              </ol>

              <p>
                For dealers, IQ Auto Deals provides access to pre-qualified, motivated buyers actively shopping for vehicles. New dealers receive a 90-day free trial, then choose from Silver, Gold, or Platinum packages with no additional fees for leads or completed sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark mb-12 text-center">Key Facts About IQ Auto Deals</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="text-4xl font-bold text-primary mb-2">2024</div>
              <div className="text-gray-600 font-medium">Year Founded</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="text-4xl font-bold text-primary mb-2">50</div>
              <div className="text-gray-600 font-medium">States Covered</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="text-4xl font-bold text-primary mb-2">$5,000</div>
              <div className="text-gray-600 font-medium">Average Buyer Savings</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="text-4xl font-bold text-primary mb-2">Free</div>
              <div className="text-gray-600 font-medium">For Car Buyers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                  <Target className="w-7 h-7 text-primary" />
                  Our Mission
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  To make car buying simple, transparent, and affordable for everyone. We believe that every car buyer deserves access to competitive pricing without the hassle of visiting multiple dealerships or negotiating for hours.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                  <Lightbulb className="w-7 h-7 text-primary" />
                  Our Vision
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  To become the most trusted online car marketplace in America, where buyers save thousands and dealers reach motivated customers efficiently. We envision a future where buying a used car is as easy as shopping online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-dark mb-8 text-center">What Makes IQ Auto Deals Different</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">Dealer Competition Model</h3>
                <p className="text-gray-600">
                  Unlike traditional car buying, our platform lets dealers compete for your business. When you request a deal, multiple dealers can submit their best offers, ensuring you get competitive pricing.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">Verified Dealers Only</h3>
                <p className="text-gray-600">
                  Every dealer on our platform is a licensed, certified automotive dealership. We verify credentials, business licenses, and reputation before approval.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">Free for Buyers</h3>
                <p className="text-gray-600">
                  There are no fees, no membership costs, and no obligations for car buyers. Search, compare, and request deals completely free of charge.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">Nationwide Coverage</h3>
                <p className="text-gray-600">
                  Our marketplace covers all 50 states with dealers in over 180 major cities across the United States. Find quality used cars near you, wherever you are.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-dark mb-8">Company Information</h2>

            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <dl className="grid md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Legal Name</dt>
                  <dd className="text-lg font-semibold text-dark mt-1">IQ Auto Deals LLC</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Founded</dt>
                  <dd className="text-lg font-semibold text-dark mt-1">2024</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Headquarters</dt>
                  <dd className="text-lg font-semibold text-dark mt-1">Atlanta, Georgia, USA</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Industry</dt>
                  <dd className="text-lg font-semibold text-dark mt-1">Automotive / E-Commerce / Technology</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Service Area</dt>
                  <dd className="text-lg font-semibold text-dark mt-1">United States (Nationwide)</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Website</dt>
                  <dd className="text-lg font-semibold text-primary mt-1">iqautodeals.com</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Customer Support</dt>
                  <dd className="text-lg font-semibold text-dark mt-1">support@iqautodeals.com</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">Dealer Inquiries</dt>
                  <dd className="text-lg font-semibold text-dark mt-1">dealers@iqautodeals.com</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Perfect Car?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who saved money on their car purchase with IQ Auto Deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cars"
              className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Browse Cars
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register?type=dealer"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Dealer Sign Up
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
