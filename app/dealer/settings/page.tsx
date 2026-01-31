'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Building2, MapPin, Globe, Clock, Save, Loader2, MessageSquare, Mail } from 'lucide-react';

export default function DealerSettings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notificationEmail: '',
    businessName: '',
    websiteUrl: '',
    showCustomMessage: false,
    availabilityMessage: '',
    address: '',
    city: '',
    state: 'GA',
    zip: '',
    workHoursStart: '09:00',
    workHoursEnd: '18:00',
    workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
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
    // Use effectiveDealerId for team members to load parent dealer's settings
    loadProfile(parsed.effectiveDealerId || parsed.id);
  }, [router]);

  const loadProfile = async (dealerId: string) => {
    try {
      const res = await fetch(`/api/dealer/profile?dealerId=${dealerId}`);
      const data = await res.json();

      if (data.user) {
        const workDays = data.user.workDays ? JSON.parse(data.user.workDays) : formData.workDays;
        setFormData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          notificationEmail: data.user.notificationEmail || '',
          businessName: data.user.businessName || '',
          websiteUrl: data.user.websiteUrl || '',
          showCustomMessage: data.user.showCustomMessage || false,
          availabilityMessage: data.user.availabilityMessage || '',
          address: data.user.address || '',
          city: data.user.city || '',
          state: data.user.state || 'GA',
          zip: data.user.zip || '',
          workHoursStart: data.user.workHoursStart || '09:00',
          workHoursEnd: data.user.workHoursEnd || '18:00',
          workDays,
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch('/api/dealer/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId: user.effectiveDealerId || user.id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save');
        setSaving(false);
        return;
      }

      // Update local storage with new user data
      const updatedUser = {
        ...user,
        name: data.user.name,
        businessName: data.user.businessName,
        websiteUrl: data.user.websiteUrl,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

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
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/dealer')}
            className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-xs md:text-sm text-gray-600">Manage your profile and business information</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
            Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary">
              <User className="w-5 h-5" />
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-secondary">
              <Building2 className="w-5 h-5" />
              Business Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-secondary" />
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://www.yourdealership.com"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your website will be linked on all your vehicle listings for SEO benefits
                </p>
              </div>
            </div>
          </div>

          {/* Notification Email */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-secondary">
              <Mail className="w-5 h-5" />
              Notification Email
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address for Notifications
                </label>
                <input
                  type="email"
                  value={formData.notificationEmail}
                  onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
                  placeholder={user?.email || 'notifications@yourdealership.com'}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Customer notifications (availability requests, deal requests, offer declines, cancellations) will be sent to this email instead of your login email. Leave blank to use your login email.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Messages */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-accent">
              <MessageSquare className="w-5 h-5" />
              Customer Messages
            </h2>

            <div className="space-y-4">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Show Custom Message</p>
                  <p className="text-sm text-gray-500">Display your personalized message to customers after they request availability</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, showCustomMessage: !formData.showCustomMessage })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.showCustomMessage ? 'bg-accent' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.showCustomMessage ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Custom Message Textarea - only shown when toggle is on */}
              {formData.showCustomMessage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Custom Message
                  </label>
                  <textarea
                    value={formData.availabilityMessage}
                    onChange={(e) => setFormData({ ...formData, availabilityMessage: e.target.value })}
                    placeholder="Thank you for your interest! We'll contact you within 24 hours to schedule your test drive. Feel free to call us directly at (555) 123-4567 for faster assistance."
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This message will be shown to customers after they submit an availability request for your vehicles
                  </p>
                </div>
              )}

              {/* Preview of default message when toggle is off */}
              {!formData.showCustomMessage && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Default Message (shown to customers):</p>
                  <p className="text-sm text-blue-700">
                    &quot;Your availability request has been sent. The dealer will contact you shortly to schedule your test drive.&quot;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-secondary">
              <MapPin className="w-5 h-5" />
              Address
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                    required
                  >
                    <option value="GA">GA</option>
                    <option value="FL">FL</option>
                    <option value="AL">AL</option>
                    <option value="SC">SC</option>
                    <option value="NC">NC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                  <input
                    type="text"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                    required
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-secondary">
              <Clock className="w-5 h-5" />
              Business Hours
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                  <input
                    type="time"
                    value={formData.workHoursStart}
                    onChange={(e) => setFormData({ ...formData, workHoursStart: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                  <input
                    type="time"
                    value={formData.workHoursEnd}
                    onChange={(e) => setFormData({ ...formData, workHoursEnd: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const newWorkDays = formData.workDays.includes(day)
                          ? formData.workDays.filter(d => d !== day)
                          : [...formData.workDays, day];
                        setFormData({ ...formData, workDays: newWorkDays });
                      }}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${
                        formData.workDays.includes(day)
                          ? 'bg-secondary text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
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
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
