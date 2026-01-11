'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Power,
  PowerOff,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Helper to get auth headers for admin API calls
function getAuthHeaders(): HeadersInit {
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const email = user ? JSON.parse(user).email : '';
  return {
    'Content-Type': 'application/json',
    'x-user-email': email,
  };
}

interface Dealer {
  id: string;
  email: string;
  name: string;
  businessName: string | null;
  websiteUrl: string | null;
  city: string | null;
  state: string | null;
  verificationStatus: string | null;
  inventoryFeedUrl: string | null;
  inventoryFeedType: string | null;
  autoSyncEnabled: boolean;
  syncFrequencyDays: number;
  lastSyncAt: string | null;
  lastSyncStatus: string | null;
  lastSyncMessage: string | null;
  _count: { cars: number };
}

interface SyncResult {
  success: boolean;
  summary?: {
    dealerId: string;
    dealerName: string;
    success: boolean;
    error?: string;
    stats: {
      found: number;
      added: number;
      updated: number;
      markedSold: number;
      failed: number;
    };
    duration: number;
  };
  error?: string;
}

export default function InventorySyncAdmin() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [expandedDealer, setExpandedDealer] = useState<string | null>(null);
  const [editingDealer, setEditingDealer] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    inventoryFeedUrl: '',
    inventoryFeedType: 'dealeron',
    autoSyncEnabled: false,
    syncFrequencyDays: 2,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadDealers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dealers?status=approved', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error('Unauthorized');
      }
      const data = await res.json();
      setDealers(data.dealers || []);
    } catch (error) {
      console.error('Failed to load dealers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDealers();
  }, [loadDealers]);

  const handleToggleSync = async (dealer: Dealer) => {
    try {
      const res = await fetch('/api/admin/dealers', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          dealerId: dealer.id,
          autoSyncEnabled: !dealer.autoSyncEnabled,
        }),
      });

      if (res.ok) {
        setMessage({
          type: 'success',
          text: `Auto-sync ${!dealer.autoSyncEnabled ? 'enabled' : 'disabled'} for ${dealer.businessName}`,
        });
        loadDealers();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update sync settings' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const handleTriggerSync = async (dealerId: string) => {
    setSyncing(dealerId);
    setMessage(null);

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dealerId }),
      });

      const data: SyncResult = await res.json();

      if (data.success && data.summary) {
        const stats = data.summary.stats;
        setMessage({
          type: 'success',
          text: `Sync complete! Added: ${stats.added}, Updated: ${stats.updated}, Sold: ${stats.markedSold}`,
        });
      } else {
        setMessage({
          type: 'error',
          text: data.error || data.summary?.error || 'Sync failed',
        });
      }

      loadDealers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to trigger sync' });
    } finally {
      setSyncing(null);
    }
  };

  const handleEditClick = (dealer: Dealer) => {
    setEditingDealer(dealer.id);
    setEditForm({
      inventoryFeedUrl: dealer.inventoryFeedUrl || '',
      inventoryFeedType: dealer.inventoryFeedType || 'dealeron',
      autoSyncEnabled: dealer.autoSyncEnabled,
      syncFrequencyDays: dealer.syncFrequencyDays || 2,
    });
  };

  const handleSaveSettings = async (dealerId: string) => {
    try {
      const res = await fetch('/api/admin/dealers', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          dealerId,
          ...editForm,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
        setEditingDealer(null);
        loadDealers();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading dealers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Sync Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage automatic inventory imports for dealers
              </p>
            </div>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div
          className={`max-w-7xl mx-auto px-4 mt-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Dealers</p>
            <p className="text-2xl font-bold text-gray-900">{dealers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Auto-Sync Enabled</p>
            <p className="text-2xl font-bold text-green-600">
              {dealers.filter((d) => d.autoSyncEnabled).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Feed Configured</p>
            <p className="text-2xl font-bold text-blue-600">
              {dealers.filter((d) => d.inventoryFeedUrl).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Last Sync Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {dealers.filter((d) => d.lastSyncStatus === 'failed').length}
            </p>
          </div>
        </div>

        {/* Dealers List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Approved Dealers</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {dealers.map((dealer) => (
              <div key={dealer.id} className="p-6">
                {/* Main Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Sync Status Icon */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(dealer.lastSyncStatus)}
                    </div>

                    {/* Dealer Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {dealer.businessName || dealer.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {dealer.city}, {dealer.state} &bull; {dealer._count.cars} cars
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Auto-Sync Toggle */}
                    <button
                      onClick={() => handleToggleSync(dealer)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                        dealer.autoSyncEnabled
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={dealer.autoSyncEnabled ? 'Disable auto-sync' : 'Enable auto-sync'}
                    >
                      {dealer.autoSyncEnabled ? (
                        <>
                          <Power className="w-4 h-4" /> On
                        </>
                      ) : (
                        <>
                          <PowerOff className="w-4 h-4" /> Off
                        </>
                      )}
                    </button>

                    {/* Sync Now Button */}
                    <button
                      onClick={() => handleTriggerSync(dealer.id)}
                      disabled={syncing === dealer.id || !dealer.inventoryFeedUrl}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                        dealer.inventoryFeedUrl
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${syncing === dealer.id ? 'animate-spin' : ''}`}
                      />
                      {syncing === dealer.id ? 'Syncing...' : 'Sync Now'}
                    </button>

                    {/* Settings Button */}
                    <button
                      onClick={() => handleEditClick(dealer)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <Settings className="w-5 h-5" />
                    </button>

                    {/* Expand/Collapse */}
                    <button
                      onClick={() =>
                        setExpandedDealer(expandedDealer === dealer.id ? null : dealer.id)
                      }
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      {expandedDealer === dealer.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedDealer === dealer.id && (
                  <div className="mt-4 pl-9 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Feed URL</p>
                      <p className="font-medium">
                        {dealer.inventoryFeedUrl ? (
                          <a
                            href={dealer.inventoryFeedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {dealer.inventoryFeedUrl}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400">Not configured</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Feed Type</p>
                      <p className="font-medium">{dealer.inventoryFeedType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sync Frequency</p>
                      <p className="font-medium">Every {dealer.syncFrequencyDays} days</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Sync</p>
                      <p className="font-medium">{formatDate(dealer.lastSyncAt)}</p>
                    </div>
                    {dealer.lastSyncMessage && (
                      <div className="col-span-2">
                        <p className="text-gray-500">Last Sync Message</p>
                        <p
                          className={`font-medium ${
                            dealer.lastSyncStatus === 'failed' ? 'text-red-600' : 'text-gray-900'
                          }`}
                        >
                          {dealer.lastSyncMessage}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Edit Form */}
                {editingDealer === dealer.id && (
                  <div className="mt-4 pl-9 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Edit Sync Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inventory Feed URL
                        </label>
                        <input
                          type="url"
                          value={editForm.inventoryFeedUrl}
                          onChange={(e) =>
                            setEditForm({ ...editForm, inventoryFeedUrl: e.target.value })
                          }
                          placeholder="https://www.dealer-website.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Feed Type
                        </label>
                        <select
                          value={editForm.inventoryFeedType}
                          onChange={(e) =>
                            setEditForm({ ...editForm, inventoryFeedType: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="dealeron">DealerOn</option>
                          <option value="dealer_com">Dealer.com</option>
                          <option value="xml_feed">XML Feed</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sync Frequency (days)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={editForm.syncFrequencyDays}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              syncFrequencyDays: parseInt(e.target.value) || 2,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editForm.autoSyncEnabled}
                            onChange={(e) =>
                              setEditForm({ ...editForm, autoSyncEnabled: e.target.checked })
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Enable Auto-Sync
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleSaveSettings(dealer.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Save Settings
                      </button>
                      <button
                        onClick={() => setEditingDealer(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {dealers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No approved dealers found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
