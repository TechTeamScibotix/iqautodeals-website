'use client';

import Link from 'next/link';
import { RefreshCw, Users, Car, BarChart } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">IQ Auto Deals Administration</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Inventory Sync */}
          <Link
            href="/admin/inventory-sync"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Inventory Sync</h2>
                <p className="text-sm text-gray-600">
                  Manage automatic inventory imports for dealers
                </p>
              </div>
            </div>
          </Link>

          {/* Dealers - placeholder for future */}
          <div className="bg-white rounded-lg shadow p-6 opacity-50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Dealer Management</h2>
                <p className="text-sm text-gray-600">
                  Approve and manage dealer accounts
                </p>
              </div>
            </div>
          </div>

          {/* Inventory - placeholder for future */}
          <div className="bg-white rounded-lg shadow p-6 opacity-50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Car className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
                <p className="text-sm text-gray-600">
                  View and manage all listed vehicles
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Site
          </Link>
        </div>
      </main>
    </>
  );
}
