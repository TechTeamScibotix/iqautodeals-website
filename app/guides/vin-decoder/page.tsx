import Link from 'next/link';
import { ArrowLeft, CheckCircle, Search, AlertTriangle, FileText } from 'lucide-react';
import type { Metadata } from 'next';
import { LogoWithBeam } from '@/components/LogoWithBeam';
import Footer from '../../components/Footer';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'VIN Decoder Guide: How to Read & Check a VIN Number 2026',
  description: 'Learn how to decode a VIN number and what each digit means. Understand vehicle history reports, spot title issues, and verify car details before buying.',
  keywords: 'VIN decoder, VIN number meaning, how to read VIN, vehicle identification number, VIN check, car history report, Carfax, AutoCheck',
};

export default function VINDecoderGuide() {
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
            VIN Decoder Guide: Understanding Your Vehicle's DNA
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Every vehicle has a unique 17-character VIN (Vehicle Identification Number) that tells its complete story. Learn how to decode it and use vehicle history reports to make informed buying decisions.
            </p>

            {/* What is a VIN */}
            <div className="bg-primary text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Search className="w-6 h-6" />
                What is a VIN?
              </h2>
              <p className="mb-4">
                The VIN is a 17-character code assigned to every vehicle manufactured since 1981. It's like a fingerprint - no two vehicles have the same VIN.
              </p>
              <div className="bg-blue-600 p-4 rounded font-mono text-lg tracking-wider">
                1HGBH41JXMN109186
              </div>
              <p className="text-sm text-gray-300 mt-2">Example VIN breakdown shown below</p>
            </div>

            {/* Where to Find VIN */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Where to Find the VIN</h2>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Dashboard:</strong> Driver's side, visible through windshield</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Driver's door jamb:</strong> Sticker on the door frame</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Title and registration:</strong> Listed on all legal documents</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Insurance card:</strong> Usually printed on your policy</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span><strong>Engine block:</strong> Stamped on the front of the engine</span></li>
              </ul>
            </div>

            {/* VIN Breakdown */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">How to Decode a VIN</h2>
              <p className="text-gray-300 mb-4">Each section of the 17-character VIN reveals specific information:</p>

              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded border-l-4 border-primary">
                  <p className="font-semibold text-white">Positions 1-3: World Manufacturer Identifier (WMI)</p>
                  <p className="text-gray-300 text-sm">Country of origin, manufacturer, and vehicle type</p>
                  <div className="mt-2 text-xs">
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2">1 = USA</span>
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2">J = Japan</span>
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2">W = Germany</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">K = Korea</span>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border-l-4 border-secondary">
                  <p className="font-semibold text-white">Positions 4-8: Vehicle Descriptor Section (VDS)</p>
                  <p className="text-gray-300 text-sm">Model, body type, engine type, and restraint system</p>
                </div>

                <div className="bg-gray-800 p-4 rounded border-l-4 border-green-500">
                  <p className="font-semibold text-white">Position 9: Check Digit</p>
                  <p className="text-gray-300 text-sm">Validates the VIN is legitimate (prevents fraud)</p>
                </div>

                <div className="bg-gray-800 p-4 rounded border-l-4 border-yellow-500">
                  <p className="font-semibold text-white">Position 10: Model Year</p>
                  <p className="text-gray-300 text-sm">Single character representing the year</p>
                  <div className="mt-2 text-xs">
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2">N = 2022</span>
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2">P = 2023</span>
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2">R = 2024</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">S = 2025</span>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded border-l-4 border-purple-500">
                  <p className="font-semibold text-white">Position 11: Assembly Plant</p>
                  <p className="text-gray-300 text-sm">Factory where the vehicle was built</p>
                </div>

                <div className="bg-gray-800 p-4 rounded border-l-4 border-red-500">
                  <p className="font-semibold text-white">Positions 12-17: Serial Number</p>
                  <p className="text-gray-300 text-sm">Unique production sequence number</p>
                </div>
              </div>
            </div>

            {/* Vehicle History Reports */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Vehicle History Reports Explained
              </h2>
              <p className="text-gray-300 mb-4">
                A vehicle history report uses the VIN to compile records from insurance companies, DMVs, repair shops, and other sources.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Carfax</p>
                  <p className="text-gray-300 text-sm mb-2">Most comprehensive database, ~$40 per report</p>
                  <ul className="text-xs space-y-1">
                    <li>• Best for service records</li>
                    <li>• "Buyback Guarantee"</li>
                    <li>• Unlimited reports subscription available</li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">AutoCheck</p>
                  <p className="text-gray-300 text-sm mb-2">Strong auction data, ~$25 per report</p>
                  <ul className="text-xs space-y-1">
                    <li>• Better for auction history</li>
                    <li>• Score-based rating system</li>
                    <li>• Often included by dealers</li>
                  </ul>
                </div>
              </div>

              <h3 className="font-semibold text-white mb-2">What History Reports Reveal:</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Accident and damage history</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Title issues (salvage, rebuilt, flood, lemon)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Odometer readings (detect rollback)</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Number of previous owners</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Service and maintenance records</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Registration history by state</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Recall information</span></li>
              </ul>
            </div>

            {/* Red Flags */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                Red Flags to Watch For
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Salvage/Rebuilt Title</p>
                  <p className="text-gray-300 text-sm">Vehicle was totaled by insurance. May have structural damage. Difficult to insure and resell. Value reduced 20-40%.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Flood Damage</p>
                  <p className="text-gray-300 text-sm">Water damage causes electrical issues, mold, and rust. Often hidden by title washing across states.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Odometer Rollback</p>
                  <p className="text-gray-300 text-sm">Mileage doesn't consistently increase in records. Compare service records to reported mileage.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Lemon Title</p>
                  <p className="text-gray-300 text-sm">Manufacturer bought back due to repeated problems. Often resold at auction.</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Multiple Owners in Short Time</p>
                  <p className="text-gray-300 text-sm">Could indicate chronic problems previous owners discovered.</p>
                </div>
              </div>
            </div>

            {/* Free VIN Checks */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Free VIN Check Resources</h2>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span><strong>NICB VINCheck:</strong> Free theft and total loss check</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span><strong>NHTSA:</strong> Free recall information lookup</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span><strong>VehicleHistory.com:</strong> Basic free report</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span><strong>iSeeCars:</strong> Free vehicle history summary</span></li>
              </ul>
              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Pro Tip:</strong> Free reports are good for basics, but always run a full Carfax or AutoCheck before buying a used car.</p>
              </div>
            </div>

            {/* Verify VIN Matches */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Always Verify VIN Matches</h2>
              <p className="text-gray-300 mb-4">
                Before purchasing, confirm the VIN is identical on:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Dashboard plate</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Door jamb sticker</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Title document</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Registration</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-primary mt-0.5" /><span>Insurance documents</span></li>
              </ul>
              <p className="text-sm text-gray-300 mt-4">
                Mismatched VINs indicate VIN cloning (stolen vehicle) or title fraud.
              </p>
            </div>

            <div className="bg-black text-white rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Shop with Confidence</h3>
              <p className="text-gray-300 mb-6">
                Browse verified vehicles from trusted dealerships. Every listing includes VIN information for your research.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Models to Research</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Link href="/models/toyota-camry" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Toyota Camry</Link>
            <Link href="/models/ford-f150" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Ford F-150</Link>
            <Link href="/models/honda-civic" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Honda Civic</Link>
            <Link href="/models/chevy-silverado" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Chevy Silverado</Link>
            <Link href="/models/toyota-rav4" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Toyota RAV4</Link>
            <Link href="/models/jeep-wrangler" className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition text-center font-semibold text-gray-900">Jeep Wrangler</Link>
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
            <Link href="/guides/pre-purchase-inspection" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">Pre-Purchase Inspection</span>
              <p className="text-sm text-gray-600 mt-1">What to check before buying</p>
            </Link>
            <Link href="/guides/how-to-buy-used-car" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">How to Buy a Used Car</span>
              <p className="text-sm text-gray-600 mt-1">Complete buying guide</p>
            </Link>
            <Link href="/guides/warranty-guide" className="p-4 rounded-lg border hover:border-blue-500 hover:shadow-lg transition">
              <span className="font-semibold text-gray-900">Warranty Guide</span>
              <p className="text-sm text-gray-600 mt-1">Protect your purchase</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
