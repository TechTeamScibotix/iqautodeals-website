'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Save, Loader2, Users, Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface Preferences {
  availabilityRecipients: string[];
  dealRequestRecipients: string[];
  offerDeclinedRecipients: string[];
  dealCancelledRecipients: string[];
  alwaysNotifyOwner: boolean;
}

type NotificationType = 'availabilityRecipients' | 'dealRequestRecipients' | 'offerDeclinedRecipients' | 'dealCancelledRecipients';

const notificationTypes: { key: NotificationType; label: string; description: string }[] = [
  {
    key: 'availabilityRecipients',
    label: 'Availability Requests',
    description: 'When customers request availability for a vehicle',
  },
  {
    key: 'dealRequestRecipients',
    label: 'Deal Requests',
    description: 'When customers submit a deal request for vehicles',
  },
  {
    key: 'offerDeclinedRecipients',
    label: 'Offer Declined',
    description: 'When customers decline an offer you submitted',
  },
  {
    key: 'dealCancelledRecipients',
    label: 'Deal Cancelled',
    description: 'When customers cancel a deal or accepted offer',
  },
];

export default function NotificationSettings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    availabilityRecipients: [],
    dealRequestRecipients: [],
    offerDeclinedRecipients: [],
    dealCancelledRecipients: [],
    alwaysNotifyOwner: true,
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(userData);
    if (parsed.userType !== 'dealer') {
      router.push('/customer');
      return;
    }

    setUser(parsed);
    loadPreferences(parsed.effectiveDealerId || parsed.id);
  }, [router]);

  const loadPreferences = async (dealerId: string) => {
    try {
      const res = await fetch(`/api/dealer/notification-preferences?dealerId=${dealerId}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setTeamMembers(data.teamMembers || []);
      setIsOwner(data.isOwner);
      if (data.preferences) {
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
      setError('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipient = (type: NotificationType, memberId: string) => {
    if (!isOwner) return;

    setPreferences(prev => {
      const current = prev[type];
      const updated = current.includes(memberId)
        ? current.filter(id => id !== memberId)
        : [...current, memberId];
      return { ...prev, [type]: updated };
    });
  };

  const toggleAllForType = (type: NotificationType) => {
    if (!isOwner) return;

    setPreferences(prev => {
      const allSelected = teamMembers.every(m => prev[type].includes(m.id));
      const updated = allSelected ? [] : teamMembers.map(m => m.id);
      return { ...prev, [type]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch('/api/dealer/notification-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId: user.id,
          ...preferences,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save');
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/dealer/settings')}
            className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Notification Settings
            </h1>
            <p className="text-xs md:text-sm text-gray-600">
              Choose which team members receive notification emails
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Notification preferences saved successfully!
          </div>
        )}

        {!isOwner && (
          <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Only the account owner can modify notification preferences.
          </div>
        )}

        {teamMembers.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Team Members</h2>
            <p className="text-gray-600 mb-4">
              You don&apos;t have any team members yet. Add team members to configure who receives notification emails.
            </p>
            <button
              onClick={() => router.push('/dealer/team')}
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Manage Team
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Always Notify Owner Toggle */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="font-bold text-gray-900">Always Notify Owner</h2>
                    <p className="text-sm text-gray-600">
                      The account owner will always receive a copy of all notifications
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!isOwner}
                  onClick={() => setPreferences(prev => ({ ...prev, alwaysNotifyOwner: !prev.alwaysNotifyOwner }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.alwaysNotifyOwner ? 'bg-primary' : 'bg-gray-300'
                  } ${!isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.alwaysNotifyOwner ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Notification Type Sections */}
            {notificationTypes.map(({ key, label, description }) => (
              <div key={key} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-secondary" />
                    <div>
                      <h2 className="font-bold text-gray-900">{label}</h2>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                  </div>
                  {isOwner && teamMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => toggleAllForType(key)}
                      className="text-sm text-primary hover:underline"
                    >
                      {teamMembers.every(m => preferences[key].includes(m.id)) ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {teamMembers.map(member => (
                    <label
                      key={member.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                        preferences[key].includes(member.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!isOwner ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <input
                        type="checkbox"
                        checked={preferences[key].includes(member.id)}
                        onChange={() => toggleRecipient(key, member.id)}
                        disabled={!isOwner}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Save Button */}
            {isOwner && (
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Preferences
                  </>
                )}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
