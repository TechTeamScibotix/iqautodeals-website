'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, DollarSign, Calendar, Filter, FileText, Car, User, Phone, Mail, Globe, MousePointerClick, Eye } from 'lucide-react';
import { LogoWithBeam } from '@/components/LogoWithBeam';

interface Sale {
  id: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  car: {
    id: string;
    make: string;
    model: string;
    trim?: string;
    year: number;
    color: string;
    mileage: number;
    vin: string;
    photos: string;
    state: string;
    city: string;
  };
  finalPrice: number;
  verificationCode: string | null;
  source: string;
  deadDeal?: boolean;
}

interface ReportData {
  sales: Sale[];
  summary: {
    totalSales: number;
    totalRevenue: number;
    averagePrice: number;
  };
  filterOptions: {
    makes: string[];
    models: string[];
    years: number[];
  };
}

interface WebsiteClicksData {
  totalClicks: number;
  uniqueVisitors: number;
  from: string;
  to: string;
  period: string;
  vehicleBreakdown: Array<{
    carId: string;
    clicks: number;
    car: {
      id: string;
      make: string;
      model: string;
      trim?: string;
      year: number;
      vin: string;
      slug: string | null;
    } | null;
  }>;
}

interface OutbidData {
  totalOutbid: number;
  outbidVehicles: Array<{
    dealerVehicle: {
      id: string;
      year: number;
      make: string;
      model: string;
      trim?: string;
      vin: string;
      color: string;
      mileage: number;
      askingPrice: number;
      highestOffer: number;
      offerCount: number;
    };
    customer: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
    winningCompetitor: {
      dealerId: string;
      dealerName: string;
      vehicle: {
        year: number;
        make: string;
        model: string;
        trim?: string;
      };
      finalPrice: number;
      acceptedDate: string;
    };
    dealListId: string;
    dealListCreatedAt: string;
  }>;
  competitorBreakdown: Array<{
    dealerName: string;
    dealerId: string;
    timesWon: number;
    totalValue: number;
  }>;
}

export default function DealerReporting() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [weekData, setWeekData] = useState<ReportData | null>(null);
  const [monthData, setMonthData] = useState<ReportData | null>(null);
  const [outbidData, setOutbidData] = useState<OutbidData | null>(null);
  const [showOutbidReport, setShowOutbidReport] = useState(false);
  const [websiteClicks, setWebsiteClicks] = useState<{ week: WebsiteClicksData | null; month: WebsiteClicksData | null }>({ week: null, month: null });

  // Filter state
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    make: '',
    model: '',
    year: '',
    bidStatus: 'all', // all, won, lost, pending, expired, salesArea
  });

  // Location filter state
  const [locationFilters, setLocationFilters] = useState({
    state: '',
    city: '',
  });

  // Available locations from sales data
  const [availableLocations, setAvailableLocations] = useState<{
    states: string[];
    cities: string[];
  }>({ states: [], cities: [] });

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
    // Use effectiveDealerId for team members, fallback to user's own ID
    const dealerId = parsed.effectiveDealerId || parsed.id;
    loadReports(dealerId);
    loadWeekData(dealerId);
    loadMonthData(dealerId);
    loadOutbidData(dealerId);
    loadWebsiteClicks(dealerId);
  }, [router]);

  // Extract unique locations when reportData changes
  useEffect(() => {
    if (reportData && reportData.sales.length > 0) {
      const states = new Set<string>();
      const cities = new Set<string>();

      reportData.sales.forEach(sale => {
        if (sale.car) {
          if (sale.car.state) states.add(sale.car.state);
          if (sale.car.city) cities.add(sale.car.city);
        }
      });

      setAvailableLocations({
        states: Array.from(states).sort(),
        cities: Array.from(cities).sort(),
      });
    }
  }, [reportData]);

  const loadReports = async (dealerId: string, customFilters = filters) => {
    try {
      const params = new URLSearchParams({ dealerId });
      if (customFilters.startDate) params.append('startDate', customFilters.startDate);
      if (customFilters.endDate) params.append('endDate', customFilters.endDate);
      if (customFilters.make) params.append('make', customFilters.make);
      if (customFilters.model) params.append('model', customFilters.model);
      if (customFilters.year) params.append('year', customFilters.year);

      const res = await fetch(`/api/dealer/reports?${params.toString()}`);
      const data = await res.json();
      setReportData(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeekData = async (dealerId: string) => {
    try {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);

      const params = new URLSearchParams({
        dealerId,
        startDate: weekAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
      });

      const res = await fetch(`/api/dealer/reports?${params.toString()}`);
      const data = await res.json();
      setWeekData(data);
    } catch (error) {
      console.error('Failed to load week data:', error);
    }
  };

  const loadMonthData = async (dealerId: string) => {
    try {
      const today = new Date();
      const monthAgo = new Date(today);
      monthAgo.setDate(today.getDate() - 30);

      const params = new URLSearchParams({
        dealerId,
        startDate: monthAgo.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
      });

      const res = await fetch(`/api/dealer/reports?${params.toString()}`);
      const data = await res.json();
      setMonthData(data);
    } catch (error) {
      console.error('Failed to load month data:', error);
    }
  };

  const loadOutbidData = async (dealerId: string, customFilters = filters) => {
    try {
      const params = new URLSearchParams({ dealerId });
      if (customFilters.startDate) params.append('startDate', customFilters.startDate);
      if (customFilters.endDate) params.append('endDate', customFilters.endDate);

      const res = await fetch(`/api/dealer/outbid-report?${params.toString()}`);
      const data = await res.json();
      setOutbidData(data);
    } catch (error) {
      console.error('Failed to load outbid data:', error);
    }
  };

  const loadWebsiteClicks = async (dealerId: string) => {
    try {
      const [weekRes, monthRes] = await Promise.all([
        fetch(`/api/dealer/website-clicks?dealerId=${dealerId}&period=week`),
        fetch(`/api/dealer/website-clicks?dealerId=${dealerId}&period=month`),
      ]);
      const [weekData, monthData] = await Promise.all([weekRes.json(), monthRes.json()]);
      setWebsiteClicks({ week: weekData, month: monthData });
    } catch (error) {
      console.error('Failed to load website clicks:', error);
    }
  };

  const handleApplyFilters = () => {
    if (user) {
      loadReports(user.effectiveDealerId || user.id, filters);
      loadOutbidData(user.effectiveDealerId || user.id, filters);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      startDate: '',
      endDate: '',
      make: '',
      model: '',
      year: '',
      bidStatus: 'all',
    };
    setFilters(clearedFilters);
    setLocationFilters({ state: '', city: '' });
    if (user) {
      loadReports(user.effectiveDealerId || user.id, clearedFilters);
      loadOutbidData(user.effectiveDealerId || user.id, clearedFilters);
    }
  };

  const handleDeadDeal = async (acceptedDealId: string) => {
    if (!confirm('Are you sure you want to mark this deal as dead? This will cancel the deal and make the car available again.')) {
      return;
    }

    try {
      const res = await fetch('/api/dealer/dead-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptedDealId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Deal marked as dead successfully!');
        if (user) {
          loadReports(user.effectiveDealerId || user.id);
        }
      } else {
        alert(data.error || 'Failed to mark deal as dead');
      }
    } catch (error) {
      console.error('Error marking deal as dead:', error);
      alert('Error marking deal as dead');
    }
  };

  const handleExportCSV = () => {
    if (!reportData || reportData.sales.length === 0) {
      alert('No data to export');
      return;
    }

    // CSV headers
    const headers = [
      'Date',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Year',
      'Make',
      'Model',
      'Color',
      'Mileage',
      'VIN',
      'Sale Price',
      'Verification Code',
    ];

    // Convert sales data to CSV rows
    const rows = reportData.sales.map((sale) => [
      new Date(sale.date).toLocaleDateString(),
      sale.customerName,
      sale.customerEmail,
      sale.customerPhone,
      sale.car.year,
      sale.car.make,
      sale.car.model,
      sale.car.color,
      sale.car.mileage,
      sale.car.vin,
      sale.finalPrice,
      sale.verificationCode || 'N/A',
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
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
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          header .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .bg-gray-50 {
            background: white !important;
          }
          .shadow, .shadow-sm, .shadow-lg {
            box-shadow: none !important;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
      {/* Header */}
      <header className="bg-white shadow-sm h-20">
        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <div className="flex items-center gap-3 h-full py-1">
            <Link href="/" className="flex items-center h-full">
              <LogoWithBeam className="h-full" variant="dark" />
            </Link>
            <p className="text-sm text-gray-600">Sales Reporting</p>
          </div>
          <div className="flex items-center gap-4 no-print">
            <button
              onClick={() => router.push('/dealer')}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              My Inventory
            </button>
            <button
              onClick={() => router.push('/dealer/negotiations')}
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              Deal Requests
            </button>
            <span className="text-gray-700">{user?.name}</span>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Sales Reporting & Analytics
        </h2>

        {/* Summary Cards - Week & Month */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* This Week */}
          <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-dark">This Week (Last 7 Days)</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">Sales</div>
                <div className="text-2xl font-bold text-blue-600">
                  {weekData?.summary.totalSales || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Revenue</div>
                <div className="text-lg font-bold text-green-600">
                  ${(weekData?.summary.totalRevenue || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Avg Price</div>
                <div className="text-lg font-bold text-purple">
                  ${(weekData?.summary.averagePrice || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-white rounded-lg shadow-lg p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-bold text-dark">This Month (Last 30 Days)</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">Sales</div>
                <div className="text-2xl font-bold text-blue-600">
                  {monthData?.summary.totalSales || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Revenue</div>
                <div className="text-lg font-bold text-green-600">
                  ${(monthData?.summary.totalRevenue || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Avg Price</div>
                <div className="text-lg font-bold text-purple">
                  ${(monthData?.summary.averagePrice || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Website Traffic Section */}
        {(websiteClicks.week || websiteClicks.month) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-4 mb-6 border-l-4 border-indigo-500">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-dark">Website Traffic from IQ Auto Deals</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">Clicks on &quot;Visit Dealer Website&quot; from your vehicle listings</p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Week clicks */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Last 7 Days</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                      <MousePointerClick className="w-3 h-3" /> Total Clicks
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">{websiteClicks.week?.totalClicks ?? 0}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                      <Eye className="w-3 h-3" /> Unique Visitors
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{websiteClicks.week?.uniqueVisitors ?? 0}</div>
                  </div>
                </div>
              </div>

              {/* Month clicks */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Last 30 Days</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                      <MousePointerClick className="w-3 h-3" /> Total Clicks
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">{websiteClicks.month?.totalClicks ?? 0}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                      <Eye className="w-3 h-3" /> Unique Visitors
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{websiteClicks.month?.uniqueVisitors ?? 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Per-vehicle breakdown (month) */}
            {websiteClicks.month && websiteClicks.month.vehicleBreakdown.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow">
                <h4 className="font-bold text-sm mb-3">Clicks by Vehicle (Last 30 Days)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-2">Vehicle</th>
                        <th className="text-left p-2">VIN</th>
                        <th className="text-right p-2">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {websiteClicks.month.vehicleBreakdown.map((item) => (
                        <tr key={item.carId} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-semibold">
                            {item.car
                              ? `${item.car.year} ${item.car.make} ${item.car.model}${item.car.trim ? ` ${item.car.trim}` : ''}`
                              : 'Deleted vehicle'}
                          </td>
                          <td className="p-2 text-xs text-gray-500">
                            {item.car?.vin || item.carId.slice(0, 8) + '...'}
                          </td>
                          <td className="p-2 text-right font-bold text-indigo-600">{item.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Outbid Report Section */}
        {outbidData && outbidData.totalOutbid > 0 && (filters.bidStatus === 'all' || filters.bidStatus === 'lost') && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg shadow-lg p-4 mb-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-bold text-dark">Outbid Analysis</h3>
              </div>
              <button
                onClick={() => setShowOutbidReport(!showOutbidReport)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-semibold text-sm"
              >
                {showOutbidReport ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3 shadow">
                <div className="text-xs text-gray-600 mb-1">Total Outbid</div>
                <div className="text-2xl font-bold text-orange-600">
                  {outbidData.totalOutbid}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow">
                <div className="text-xs text-gray-600 mb-1">Top Competitor</div>
                <div className="text-sm font-bold text-red-600">
                  {outbidData.competitorBreakdown[0]?.dealerName || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {outbidData.competitorBreakdown[0]?.timesWon || 0} wins
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow">
                <div className="text-xs text-gray-600 mb-1">Competitors</div>
                <div className="text-2xl font-bold text-gray-700">
                  {outbidData.competitorBreakdown.length}
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow">
                <div className="text-xs text-gray-600 mb-1">Lost Revenue</div>
                <div className="text-lg font-bold text-red-600">
                  ${outbidData.competitorBreakdown.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
                </div>
              </div>
            </div>

            {showOutbidReport && (
              <>
                {/* Competitor Breakdown */}
                <div className="bg-white rounded-lg p-4 shadow mb-4">
                  <h4 className="font-bold text-base mb-3">Competitor Breakdown</h4>
                  <div className="space-y-2">
                    {outbidData.competitorBreakdown.map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{competitor.dealerName}</p>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-gray-500">Wins: </span>
                            <span className="font-bold text-orange-600">{competitor.timesWon}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Total: </span>
                            <span className="font-bold text-red-600">${competitor.totalValue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outbid Vehicles Table */}
                <div className="bg-white rounded-lg p-4 shadow">
                  <h4 className="font-bold text-base mb-3">Outbid Vehicles Detail</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-2">Your Vehicle</th>
                          <th className="text-left p-2">Customer</th>
                          <th className="text-left p-2">Your Offer</th>
                          <th className="text-left p-2">Winner</th>
                          <th className="text-left p-2">Winning Vehicle</th>
                          <th className="text-left p-2">Winning Price</th>
                          <th className="text-left p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outbidData.outbidVehicles.map((vehicle, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div className="font-semibold">{vehicle.dealerVehicle.year} {vehicle.dealerVehicle.make} {vehicle.dealerVehicle.model}{vehicle.dealerVehicle.trim ? ` ${vehicle.dealerVehicle.trim}` : ''}</div>
                              <div className="text-xs text-gray-500">{vehicle.dealerVehicle.color} • {vehicle.dealerVehicle.mileage.toLocaleString()} mi</div>
                            </td>
                            <td className="p-2">
                              <div className="font-semibold">{vehicle.customer.name}</div>
                              <div className="text-xs text-gray-500">{vehicle.customer.email}</div>
                            </td>
                            <td className="p-2">
                              <div className="font-bold text-primary">${vehicle.dealerVehicle.highestOffer.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">{vehicle.dealerVehicle.offerCount} offer{vehicle.dealerVehicle.offerCount > 1 ? 's' : ''}</div>
                            </td>
                            <td className="p-2">
                              <div className="font-semibold text-red-600">{vehicle.winningCompetitor.dealerName}</div>
                            </td>
                            <td className="p-2">
                              <div className="text-sm">{vehicle.winningCompetitor.vehicle.year} {vehicle.winningCompetitor.vehicle.make} {vehicle.winningCompetitor.vehicle.model}{vehicle.winningCompetitor.vehicle.trim ? ` ${vehicle.winningCompetitor.vehicle.trim}` : ''}</div>
                            </td>
                            <td className="p-2">
                              <div className="font-bold text-red-600">${vehicle.winningCompetitor.finalPrice.toLocaleString()}</div>
                            </td>
                            <td className="p-2">
                              <div className="text-xs">{new Date(vehicle.winningCompetitor.acceptedDate).toLocaleDateString()}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 no-print">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-dark">Custom Report Filters</h3>
          </div>
          <div className="grid md:grid-cols-7 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Report Type</label>
              <select
                value={filters.bidStatus}
                onChange={(e) => setFilters({ ...filters, bidStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Bids</option>
                <option value="won">Won Bids</option>
                <option value="lost">Lost Bids</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="salesArea">Sales Area</option>
                <option value="deadDeal">Dead Deal</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Make</label>
              <select
                value={filters.make}
                onChange={(e) => setFilters({ ...filters, make: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="">All Makes</option>
                {(reportData?.filterOptions?.makes || []).map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Model</label>
              <select
                value={filters.model}
                onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="">All Models</option>
                {(reportData?.filterOptions?.models || []).map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Year</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="">All Years</option>
                {(reportData?.filterOptions?.years || []).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleApplyFilters}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
              >
                Apply
              </button>
              <button
                onClick={handleClearFilters}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-semibold text-sm"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Location Filters - Show when Sales Area is selected */}
          {filters.bidStatus === 'salesArea' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Location Filters</h4>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">State</label>
                  <select
                    value={locationFilters.state}
                    onChange={(e) => setLocationFilters({ ...locationFilters, state: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All States</option>
                    {availableLocations.states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">City</label>
                  <select
                    value={locationFilters.city}
                    onChange={(e) => setLocationFilters({ ...locationFilters, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Cities</option>
                    {availableLocations.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleApplyFilters}
                    className="w-full bg-accent text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                  >
                    Apply Location Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Custom Report Summary */}
        {reportData && (filters.bidStatus === 'all' || filters.bidStatus === 'won' || filters.bidStatus === 'salesArea') && (
          <>
            {(() => {
              // Filter sales by location if Sales Area is selected
              let filteredSales = reportData.sales;
              if (filters.bidStatus === 'salesArea') {
                filteredSales = reportData.sales.filter(sale => {
                  const matchesState = !locationFilters.state || sale.car.state === locationFilters.state;
                  const matchesCity = !locationFilters.city || sale.car.city === locationFilters.city;
                  return matchesState && matchesCity;
                });
              }

              const filteredSummary = {
                totalSales: filteredSales.length,
                totalRevenue: filteredSales.reduce((sum, sale) => sum + sale.finalPrice, 0),
                averagePrice: filteredSales.length > 0
                  ? filteredSales.reduce((sum, sale) => sum + sale.finalPrice, 0) / filteredSales.length
                  : 0,
              };

              return (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                      <div className="text-sm text-gray-600 mb-1">
                        Total Sales
                        {filters.bidStatus === 'salesArea' && (locationFilters.state || locationFilters.city) && (
                          <span className="ml-2 text-xs text-primary">
                            ({locationFilters.city && locationFilters.state
                              ? `${locationFilters.city}, ${locationFilters.state}`
                              : locationFilters.state || locationFilters.city})
                          </span>
                        )}
                      </div>
                      <div className="text-3xl font-bold text-blue-600">
                        {filters.bidStatus === 'salesArea' ? filteredSummary.totalSales : reportData.summary.totalSales}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                      <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                      <div className="text-3xl font-bold text-green-600">
                        ${(filters.bidStatus === 'salesArea' ? filteredSummary.totalRevenue : reportData.summary.totalRevenue).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                      <div className="text-sm text-gray-600 mb-1">Average Price</div>
                      <div className="text-3xl font-bold text-purple">
                        ${(filters.bidStatus === 'salesArea' ? filteredSummary.averagePrice : reportData.summary.averagePrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>

                  {/* Sales List */}
                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold text-dark">Sales Details</h3>
                      </div>
                      <div className="flex gap-2 no-print">
                        <button
                          onClick={handleExportCSV}
                          className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export CSV
                        </button>
                        <button
                          onClick={handlePrint}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          Print
                        </button>
                      </div>
                    </div>

                    {(filters.bidStatus === 'salesArea' ? filteredSales : reportData.sales).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No sales found for the selected filters
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {(filters.bidStatus === 'salesArea' ? filteredSales : reportData.sales).map((sale) => (
                          <div
                            key={sale.id}
                            className="border border-gray-200 rounded-lg p-3 hover:border-primary transition"
                          >
                            <div className="flex gap-3">
                              <div className="relative h-24 w-32 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                {(() => {
                                  try {
                                    const photoUrls = JSON.parse(sale.car.photos || '[]');
                                    const firstPhoto = photoUrls[0];
                                    if (firstPhoto) {
                                      return (
                                        <Image
                                          src={firstPhoto}
                                          alt={`${sale.car.year} ${sale.car.make} ${sale.car.model}`}
                                          fill
                                          className="object-cover"
                                          sizes="192px"
                                        />
                                      );
                                    }
                                  } catch (e) {
                                    console.error('Failed to parse photos:', e);
                                  }
                                  return (
                                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
                                      <div className="bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg">
                                        IN STOCK
                                      </div>
                                      <p className="text-gray-400 text-[10px] mt-1">Photos Coming Soon</p>
                                    </div>
                                  );
                                })()}
                              </div>

                              <div className="flex-1 grid grid-cols-3 gap-3">
                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <Car className="w-4 h-4 text-primary" />
                                    <h4 className="font-bold text-sm">
                                      {sale.car.year} {sale.car.make} {sale.car.model}{sale.car.trim ? ` ${sale.car.trim}` : ''}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-gray-600">{sale.car.color} • {sale.car.mileage.toLocaleString()} mi</p>
                                  <p className="text-xs text-gray-500">VIN: {sale.car.vin}</p>
                                </div>

                                <div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <User className="w-4 h-4 text-primary" />
                                    <p className="font-bold text-sm">{sale.customerName}</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Mail className="w-3 h-3" />
                                    {sale.customerEmail}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Phone className="w-3 h-3" />
                                    {sale.customerPhone}
                                  </div>
                                </div>

                                <div className="text-right flex flex-col items-end gap-2">
                                  <div>
                                    <div className="flex items-center justify-end gap-1 mb-1">
                                      <DollarSign className="w-5 h-5 text-green-600" />
                                      <span className="text-2xl font-bold text-green-600">
                                        {sale.finalPrice.toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-1">
                                      {new Date(sale.date).toLocaleDateString()}
                                    </p>
                                    {sale.verificationCode && (
                                      <p className="text-xs text-gray-500 mb-2">
                                        Code: {sale.verificationCode}
                                      </p>
                                    )}
                                  </div>
                                  {!sale.deadDeal && (
                                    <button
                                      onClick={() => handleDeadDeal(sale.id)}
                                      className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 transition"
                                    >
                                      Dead Deal
                                    </button>
                                  )}
                                  {sale.deadDeal && (
                                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-semibold">
                                      Dead Deal
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </>
        )}

        {/* Pending/Expired Placeholder */}
        {(filters.bidStatus === 'pending' || filters.bidStatus === 'expired') && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-3">
              {filters.bidStatus === 'pending' ? '⏳' : '⏰'}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {filters.bidStatus === 'pending' ? 'Pending Bids Report' : 'Expired Bids Report'}
            </h3>
            <p className="text-gray-600 text-sm">
              This report view is coming soon. For now, you can view {filters.bidStatus} bids in the Deal Requests section.
            </p>
            <button
              onClick={() => router.push('/dealer/negotiations')}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Go to Deal Requests
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
