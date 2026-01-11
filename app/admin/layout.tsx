'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';

// Admin emails - in production, use environment variable
const ADMIN_EMAILS = [
  'techteam@scibotixsolutions.com',
  'admin@iqautodeals.com',
  'joe@scibotixsolutions.com',
];

interface User {
  id: string;
  email: string;
  name: string;
  userType: string;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is an admin
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      router.push('/login?redirect=/admin');
      return;
    }

    try {
      const userData = JSON.parse(storedUser) as User;
      setUser(userData);

      // Check if user email is in admin list
      const isAdminUser = ADMIN_EMAILS.some(
        email => email.toLowerCase() === userData.email.toLowerCase()
      );

      if (!isAdminUser) {
        router.push('/');
        return;
      }

      setIsAdmin(true);
    } catch {
      router.push('/login?redirect=/admin');
      return;
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <Link href="/admin" className="text-lg font-bold">IQ Auto Deals</Link>
              <span className="block text-xs text-gray-400">Admin Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-600 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  );
}
