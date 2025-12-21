import Link from 'next/link';
import { ArrowLeft, CheckSquare, AlertTriangle, Wrench } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pre-Purchase Car Inspection Checklist: What to Check Before Buying',
  description: 'Complete checklist for inspecting a used car before purchase. Check engine, transmission, brakes, body, interior, and more to avoid costly problems.',
  keywords: 'pre-purchase inspection, used car inspection checklist, what to check when buying used car, car inspection guide',
};

export default function PrePurchaseInspectionGuide() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            IQ Auto Deals
          </Link>
          <Link href="/" className="text-primary hover:underline font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            Pre-Purchase Car Inspection Checklist
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              A thorough inspection can save you thousands by revealing hidden problems. Use this comprehensive checklist when evaluating any used car. Print it out and bring it with you!
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <p className="text-gray-800 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                Important: Always get a professional mechanic inspection ($100-150) before buying!
              </p>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6 flex items-center gap-2">
              <CheckSquare className="w-8 h-8 text-primary" />
              Exterior Inspection
            </h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-dark mb-4">Body & Paint</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Look for rust, especially wheel wells and undercarriage</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Check for mismatched paint (sign of accident repair)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Inspect panel gaps - should be even all around</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Look for dents, scratches, and dings</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Check windshield for cracks or chips</span></li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-dark mb-4">Tires & Wheels</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Tread depth (use penny test - Lincoln's head should be partially covered)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Even wear across all tires (uneven = alignment issues)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Check for cracks, bulges, or sidewall damage</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>All 4 tires should match (brand and model)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Inspect wheels for curb rash or damage</span></li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-dark mb-4">Lights & Glass</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Test all lights (headlights, taillights, brake lights, turn signals)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Check for condensation inside headlight/taillight housings</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Inspect all windows for cracks or chips</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Mirrors should be intact and functional</span></li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6 flex items-center gap-2">
              <Wrench className="w-8 h-8 text-primary" />
              Under the Hood
            </h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-dark mb-4">Engine Bay</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Check oil level and condition (should be brownish, not black or milky)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Inspect for oil leaks around engine and seals</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Check coolant level and color (should be bright, not rusty)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Look for fluid leaks on ground under car</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Inspect belts and hoses for cracks or wear</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Battery terminals should be clean (no corrosion)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Listen for unusual noises when engine running</span></li>
              </ul>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
              <p className="font-semibold text-dark mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Critical Red Flags:
              </p>
              <ul className="text-sm space-y-1">
                <li>• Milky oil or coolant (head gasket failure - $2,000+ repair)</li>
                <li>• Blue smoke from exhaust (burning oil - expensive engine work)</li>
                <li>• Sweet smell from exhaust (coolant leak)</li>
                <li>• Knocking or ticking sounds (engine damage)</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Interior Check</h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Test all power windows and locks</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Air conditioning and heating work properly</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>All dashboard lights and gauges function</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Seats adjust and aren't excessively worn</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Seatbelts work and show no fraying</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Radio, touchscreen, and speakers work</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Check for water damage or musty smell (indicates leaks)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Trunk opens and closes properly</span></li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Test Drive Checklist (20+ minutes)</h2>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-dark mb-4">Engine & Transmission</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Engine starts easily (no hesitation or rough idle)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Smooth acceleration with no hesitation</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Transmission shifts smoothly (no clunking or slipping)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>No unusual engine noises or vibrations</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Check engine light stays off</span></li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-dark mb-4">Handling & Brakes</h3>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Steering is responsive (no excessive play)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Car doesn't pull to one side while driving</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Brakes feel firm and stop smoothly (no grinding or squealing)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>No vibrations when braking (warped rotors if present)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-primary mt-0.5" /><span>Test on highway, city streets, and hills</span></li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-dark mt-12 mb-6">Documents to Request</h2>

            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-green-600 mt-0.5" /><span>Service records (proves regular maintenance)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-green-600 mt-0.5" /><span>Vehicle history report (Carfax/AutoCheck)</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-green-600 mt-0.5" /><span>Title (check for "salvage" or "rebuilt")</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-green-600 mt-0.5" /><span>Owner's manual and warranty information</span></li>
                <li className="flex gap-2"><CheckSquare className="w-5 h-5 text-green-600 mt-0.5" /><span>Second key/fob (expensive to replace if missing)</span></li>
              </ul>
            </div>

            <div className="bg-primary text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Find Quality Pre-Inspected Cars</h3>
              <p className="text-blue-100 mb-6">
                Browse thousands of quality used cars on IQ Auto Deals. Many come with inspection reports and warranties for peace of mind.
              </p>
              <Link
                href="/cars"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Browse Cars Now
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
