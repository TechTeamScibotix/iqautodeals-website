import Link from 'next/link';
import { ArrowLeft, CheckCircle, Wrench, Clock, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Vehicle Maintenance Guide: Schedule & Checklist 2025',
  description: 'Essential car maintenance schedule: oil changes, tire rotation, brake checks, and more. Keep your vehicle running smoothly and avoid costly repairs.',
  keywords: 'car maintenance schedule, vehicle maintenance checklist, oil change frequency, tire rotation, brake inspection, car service intervals',
};

export default function VehicleMaintenanceGuide() {
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
            Complete Vehicle Maintenance Guide
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Regular maintenance is the key to keeping your car reliable and avoiding expensive repairs. Follow this schedule to maximize your vehicle's lifespan and maintain its resale value.
            </p>

            {/* Quick Reference */}
            <div className="bg-primary text-white rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Quick Maintenance Schedule
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Every 3,000-5,000 miles:</p>
                  <p className="text-blue-100">Oil change (conventional) or 7,500-10,000 (synthetic)</p>
                </div>
                <div>
                  <p className="font-semibold">Every 5,000-7,500 miles:</p>
                  <p className="text-blue-100">Tire rotation</p>
                </div>
                <div>
                  <p className="font-semibold">Every 15,000-30,000 miles:</p>
                  <p className="text-blue-100">Air filter, cabin filter</p>
                </div>
                <div>
                  <p className="font-semibold">Every 30,000-60,000 miles:</p>
                  <p className="text-blue-100">Brake pads, transmission fluid</p>
                </div>
              </div>
            </div>

            {/* Oil Changes */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Oil Changes
              </h2>
              <p className="text-gray-700 mb-4">
                Oil is your engine's lifeblood. Fresh oil lubricates moving parts, reduces friction, and prevents overheating.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Conventional Oil</p>
                  <p className="text-gray-600">Every 3,000-5,000 miles</p>
                  <p className="text-sm text-gray-500">Cost: $30-50</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Synthetic Oil</p>
                  <p className="text-gray-600">Every 7,500-10,000 miles</p>
                  <p className="text-sm text-gray-500">Cost: $65-100</p>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <p className="text-sm"><strong>Pro Tip:</strong> Check your owner's manual for the manufacturer's recommended oil type and change interval.</p>
              </div>
            </div>

            {/* Tire Maintenance */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Tire Maintenance
              </h2>
              <p className="text-gray-700 mb-4">
                Proper tire care ensures safety, improves fuel economy, and extends tire life.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Tire Rotation:</span> Every 5,000-7,500 miles. Promotes even wear across all tires.
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Tire Pressure:</span> Check monthly. Proper inflation improves fuel economy by 3%.
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Wheel Alignment:</span> Every 2-3 years or if car pulls to one side.
                  </div>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Tire Replacement:</span> When tread depth reaches 2/32" (penny test).
                  </div>
                </li>
              </ul>
            </div>

            {/* Brake System */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Brake System
              </h2>
              <p className="text-gray-700 mb-4">
                Your brakes are your most critical safety system. Never delay brake maintenance.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Brake Pads</p>
                  <p className="text-gray-600">Replace every 30,000-70,000 miles (depends on driving habits)</p>
                  <p className="text-sm text-gray-500">Cost: $150-300 per axle</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Brake Rotors</p>
                  <p className="text-gray-600">Replace every 50,000-70,000 miles or when grooved/warped</p>
                  <p className="text-sm text-gray-500">Cost: $200-400 per axle</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Brake Fluid</p>
                  <p className="text-gray-600">Flush every 2 years or 30,000 miles</p>
                  <p className="text-sm text-gray-500">Cost: $70-120</p>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded mt-4">
                <p className="font-semibold text-dark mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Warning Signs - Get Brakes Checked Immediately:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Squealing or grinding noise when braking</li>
                  <li>• Vibration in brake pedal or steering wheel</li>
                  <li>• Car pulls to one side when braking</li>
                  <li>• Brake pedal feels soft or spongy</li>
                </ul>
              </div>
            </div>

            {/* Fluids */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Essential Fluids
              </h2>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Transmission Fluid</p>
                  <p className="text-gray-600">Check monthly, replace every 30,000-60,000 miles</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Coolant/Antifreeze</p>
                  <p className="text-gray-600">Flush every 30,000 miles or 2-3 years</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Power Steering Fluid</p>
                  <p className="text-gray-600">Check monthly, flush every 50,000 miles</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Windshield Washer Fluid</p>
                  <p className="text-gray-600">Top off as needed</p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Filters
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Engine Air Filter</p>
                  <p className="text-gray-600">Every 15,000-30,000 miles</p>
                  <p className="text-sm text-gray-500">Cost: $15-30 (DIY)</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Cabin Air Filter</p>
                  <p className="text-gray-600">Every 15,000-25,000 miles</p>
                  <p className="text-sm text-gray-500">Cost: $15-40 (DIY)</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Fuel Filter</p>
                  <p className="text-gray-600">Every 20,000-40,000 miles</p>
                  <p className="text-sm text-gray-500">Cost: $50-150</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">Oil Filter</p>
                  <p className="text-gray-600">Every oil change</p>
                  <p className="text-sm text-gray-500">Included with oil change</p>
                </div>
              </div>
            </div>

            {/* Major Services */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Major Service Intervals
              </h2>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">30,000 Mile Service</p>
                  <p className="text-gray-600">Replace air filter, fuel filter, inspect brakes, rotate tires</p>
                  <p className="text-sm text-gray-500">Cost: $200-400</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">60,000 Mile Service</p>
                  <p className="text-gray-600">Transmission fluid, coolant flush, spark plugs, brake fluid</p>
                  <p className="text-sm text-gray-500">Cost: $400-700</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <p className="font-semibold text-dark">90,000 Mile Service</p>
                  <p className="text-gray-600">Timing belt (if applicable), water pump, comprehensive inspection</p>
                  <p className="text-sm text-gray-500">Cost: $500-1,500</p>
                </div>
              </div>
            </div>

            {/* Money Saving Tips */}
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-dark mb-4">Money-Saving Maintenance Tips</h2>
              <ul className="space-y-2">
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Learn basic DIY: air filters, wiper blades, and oil changes save $50-100 each</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Compare prices between dealers and independent shops</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Don't skip maintenance - small repairs prevent big bills</span></li>
                <li className="flex gap-2"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /><span>Keep records - well-documented maintenance increases resale value</span></li>
              </ul>
            </div>

            <div className="bg-primary text-white rounded-lg p-8 mt-12">
              <h3 className="text-2xl font-bold mb-4">Find a Well-Maintained Used Car</h3>
              <p className="text-blue-100 mb-6">
                Browse our inventory of quality used cars with documented service history from trusted dealerships.
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
