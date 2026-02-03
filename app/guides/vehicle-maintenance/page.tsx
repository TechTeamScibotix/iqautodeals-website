import Link from 'next/link';
import { ArrowLeft, CheckCircle, Wrench, Clock, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';
import { LogoWithBeam } from '@/components/LogoWithBeam';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Vehicle Maintenance Guide & Checklist',
  description: 'Essential car maintenance schedule: oil changes, tire rotation, brake checks, and more. Keep your vehicle running smoothly and avoid costly repairs.',
  keywords: 'car maintenance schedule, vehicle maintenance checklist, oil change frequency, tire rotation, brake inspection, car service intervals',
};

export default function VehicleMaintenanceGuide() {
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
            Complete Vehicle Maintenance Guide
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Regular maintenance is the key to keeping your car reliable and avoiding expensive repairs. Follow this schedule to maximize your vehicle's lifespan and maintain its resale value.
            </p>

            {/* Quick Reference */}
            <div className="bg-primary text-white rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Quick Maintenance Schedule
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Every 3,000-5,000 miles:</p>
                  <p className="text-gray-300">Oil change (conventional) or 7,500-10,000 (synthetic)</p>
                </div>
                <div>
                  <p className="font-semibold">Every 5,000-7,500 miles:</p>
                  <p className="text-gray-300">Tire rotation</p>
                </div>
                <div>
                  <p className="font-semibold">Every 15,000-30,000 miles:</p>
                  <p className="text-gray-300">Air filter, cabin filter</p>
                </div>
                <div>
                  <p className="font-semibold">Every 30,000-60,000 miles:</p>
                  <p className="text-gray-300">Brake pads, transmission fluid</p>
                </div>
              </div>
            </div>

            {/* Oil Changes */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Oil Changes
              </h2>
              <p className="text-gray-300 mb-4">
                Oil is your engine's lifeblood. Fresh oil lubricates moving parts, reduces friction, and prevents overheating.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Conventional Oil</p>
                  <p className="text-gray-300">Every 3,000-5,000 miles</p>
                  <p className="text-sm text-gray-400">Cost: $30-50</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Synthetic Oil</p>
                  <p className="text-gray-300">Every 7,500-10,000 miles</p>
                  <p className="text-sm text-gray-400">Cost: $65-100</p>
                </div>
              </div>
              <div className="bg-primary/20 border-l-4 border-primary p-4 mt-4">
                <p className="text-sm text-gray-300"><strong className="text-white">Pro Tip:</strong> Check your owner's manual for the manufacturer's recommended oil type and change interval.</p>
              </div>
            </div>

            {/* Tire Maintenance */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Tire Maintenance
              </h2>
              <p className="text-gray-300 mb-4">
                Proper tire care ensures safety, improves fuel economy, and extends tire life.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Tire Rotation:</span> Every 5,000-7,500 miles. Promotes even wear across all tires.
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Tire Pressure:</span> Check monthly. Proper inflation improves fuel economy by 3%.
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Wheel Alignment:</span> Every 2-3 years or if car pulls to one side.
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Tire Replacement:</span> When tread depth reaches 2/32" (penny test).
                  </div>
                </li>
              </ul>
            </div>

            {/* Brake System */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Brake System
              </h2>
              <p className="text-gray-300 mb-4">
                Your brakes are your most critical safety system. Never delay brake maintenance.
              </p>
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Brake Pads</p>
                  <p className="text-gray-300">Replace every 30,000-70,000 miles (depends on driving habits)</p>
                  <p className="text-sm text-gray-400">Cost: $150-300 per axle</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Brake Rotors</p>
                  <p className="text-gray-300">Replace every 50,000-70,000 miles or when grooved/warped</p>
                  <p className="text-sm text-gray-400">Cost: $200-400 per axle</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Brake Fluid</p>
                  <p className="text-gray-300">Flush every 2 years or 30,000 miles</p>
                  <p className="text-sm text-gray-400">Cost: $70-120</p>
                </div>
              </div>
              <div className="bg-red-900/30 border border-red-800 p-4 rounded mt-4">
                <p className="font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Warning Signs - Get Brakes Checked Immediately:
                </p>
                <ul className="text-sm space-y-1 text-gray-300">
                  <li>• Squealing or grinding noise when braking</li>
                  <li>• Vibration in brake pedal or steering wheel</li>
                  <li>• Car pulls to one side when braking</li>
                  <li>• Brake pedal feels soft or spongy</li>
                </ul>
              </div>
            </div>

            {/* Fluids */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Essential Fluids
              </h2>
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Transmission Fluid</p>
                  <p className="text-gray-300">Check monthly, replace every 30,000-60,000 miles</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Coolant/Antifreeze</p>
                  <p className="text-gray-300">Flush every 30,000 miles or 2-3 years</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Power Steering Fluid</p>
                  <p className="text-gray-300">Check monthly, flush every 50,000 miles</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Windshield Washer Fluid</p>
                  <p className="text-gray-300">Top off as needed</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Filters
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Engine Air Filter</p>
                  <p className="text-gray-300">Every 15,000-30,000 miles</p>
                  <p className="text-sm text-gray-400">Cost: $15-30 (DIY)</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Cabin Air Filter</p>
                  <p className="text-gray-300">Every 15,000-25,000 miles</p>
                  <p className="text-sm text-gray-400">Cost: $15-40 (DIY)</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Fuel Filter</p>
                  <p className="text-gray-300">Every 20,000-40,000 miles</p>
                  <p className="text-sm text-gray-400">Cost: $50-150</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">Oil Filter</p>
                  <p className="text-gray-300">Every oil change</p>
                  <p className="text-sm text-gray-400">Included with oil change</p>
                </div>
              </div>
            </div>

            {/* Major Services */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Major Service Intervals
              </h2>
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">30,000 Mile Service</p>
                  <p className="text-gray-300">Replace air filter, fuel filter, inspect brakes, rotate tires</p>
                  <p className="text-sm text-gray-400">Cost: $200-400</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">60,000 Mile Service</p>
                  <p className="text-gray-300">Transmission fluid, coolant flush, spark plugs, brake fluid</p>
                  <p className="text-sm text-gray-400">Cost: $400-700</p>
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <p className="font-semibold text-white">90,000 Mile Service</p>
                  <p className="text-gray-300">Timing belt (if applicable), water pump, comprehensive inspection</p>
                  <p className="text-sm text-gray-400">Cost: $500-1,500</p>
                </div>
              </div>
            </div>

            {/* Money Saving Tips */}
            <div className="bg-black rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Money-Saving Maintenance Tips</h2>
              <ul className="space-y-2 text-gray-300">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Learn basic DIY: air filters, wiper blades, and oil changes save $50-100 each</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Compare prices between dealers and independent shops</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Don't skip maintenance - small repairs prevent big bills</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-400 mt-0.5" /><span>Keep records - well-documented maintenance increases resale value</span></li>
              </ul>
            </div>

            <div className="bg-black text-white rounded-xl p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Find a Well-Maintained Used Car</h3>
              <p className="text-gray-300 mb-6">
                Browse our inventory of quality used cars with documented service history from trusted dealerships.
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
    </div>
  );
}
