'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, UserPlus, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export default function DealerTeam() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add member form
  const [showForm, setShowForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

    // Only account owners can manage team (not team members themselves)
    if (parsed.parentDealerId) {
      router.push('/dealer');
      return;
    }

    setUser(parsed);
    loadTeamMembers(parsed.id);
  }, [router]);

  const loadTeamMembers = async (dealerId: string) => {
    try {
      const res = await fetch(`/api/dealer/team?dealerId=${dealerId}`);
      const data = await res.json();
      if (res.ok) {
        setTeamMembers(data.teamMembers || []);
      } else {
        setError(data.error || 'Failed to load team members');
      }
    } catch {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAdding(true);

    try {
      const res = await fetch('/api/dealer/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId: user.id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to add team member');
        setAdding(false);
        return;
      }

      setTeamMembers([data.teamMember, ...teamMembers]);
      setFormData({ name: '', email: '', phone: '', password: '' });
      setShowForm(false);
      setSuccess(`${data.teamMember.name} has been added to your team!`);
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to add team member');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (memberId: string) => {
    setError('');
    setDeleting(true);

    try {
      const res = await fetch('/api/dealer/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId: user.id,
          teamMemberId: memberId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to remove team member');
        setDeleting(false);
        setDeleteConfirm(null);
        return;
      }

      setTeamMembers(teamMembers.filter((m) => m.id !== memberId));
      setSuccess('Team member removed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to remove team member');
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
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
              Team Members
            </h1>
            <p className="text-xs md:text-sm text-gray-600">
              Add team members who can access your dealership account
            </p>
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
            {success}
          </div>
        )}

        {/* Add Member Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition flex items-center justify-center gap-2 mb-6"
          >
            <UserPlus className="w-5 h-5" />
            Add Team Member
          </button>
        )}

        {/* Add Member Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-primary">
              <UserPlus className="w-5 h-5" />
              Add New Team Member
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Team members can log in with their own email and password to access your dealership&apos;s inventory, deal requests, and reporting.
            </p>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {adding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Add Member
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', email: '', phone: '', password: '' });
                  }}
                  className="px-6 py-2.5 border-2 border-gray-200 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Team Members List */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-secondary">
            <Users className="w-5 h-5" />
            Your Team ({teamMembers.length})
          </h2>

          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg font-medium">No team members yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Add team members to give them access to your dealership account
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                    <p className="text-sm text-gray-600 truncate">{member.email}</p>
                    {member.phone && (
                      <p className="text-sm text-gray-500">{member.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-xs text-gray-400 hidden md:block">
                      Added {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                    {deleteConfirm === member.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-600 font-medium">Remove?</span>
                        <button
                          onClick={() => handleDelete(member.id)}
                          disabled={deleting}
                          className="text-red-600 hover:text-red-800 text-xs font-bold px-2 py-1 bg-red-50 rounded transition disabled:opacity-50"
                        >
                          {deleting ? 'Removing...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-gray-500 hover:text-gray-700 text-xs font-bold px-2 py-1 bg-gray-100 rounded transition"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(member.id)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Remove team member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-medium text-blue-800 mb-1">How team accounts work</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>&bull; Team members log in with their own email and password</li>
            <li>&bull; They can view and manage your dealership&apos;s inventory and deals</li>
            <li>&bull; You can configure which team members receive notifications in Settings &gt; Team Notifications</li>
            <li>&bull; Only the account owner can add or remove team members</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
