// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  totalServices: number;
  activeWorkers: number;
  totalBusinesses: number;
  recentBookings: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('No admin token found');
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        console.error('Error in API response:', result.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 safe-area-top">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Overview of your platform performance</p>
        </div>
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          Last updated: Just now
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon="📋"
          color="blue"
          href="/admin/bookings"
        />
        <StatCard
          title="Pending"
          value={stats?.pendingBookings || 0}
          icon="⏳"
          color="yellow"
          href="/admin/bookings?status=PENDING"
        />
        <StatCard
          title="Services"
          value={stats?.totalServices || 0}
          icon="🛠️"
          color="green"
          href="/admin/services"
        />
        <StatCard
          title="Workers"
          value={stats?.activeWorkers || 0}
          icon="👷"
          color="purple"
          href="/admin/workers"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Bookings - Takes 2/3 on desktop */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <Link
                href="/admin/bookings"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200 cursor-pointer"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {stats?.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="space-y-3">
                {stats.recentBookings.map((booking) => (
                  <div 
                    key={booking._id} 
                    className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
                    onClick={() => router.push(`/admin/bookings`)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          booking.status === 'ASSIGNED' ? 'bg-green-100 text-green-800 border border-green-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {booking.status}
                        </span>
                        <h3 className="text-sm font-medium text-gray-900 truncate">{booking.serviceType}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {booking.business?.companyName} • {booking.workersNeeded} workers • {booking.location}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No recent bookings</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - Takes 1/3 on desktop */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3">
              <Link
                href="/admin/services/create"
                className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                  <span className="text-lg">➕</span>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors duration-200">Add Service</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Create new service category</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/admin/bookings"
                className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                  <span className="text-lg">📋</span>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors duration-200">Manage Bookings</h3>
                  <p className="text-xs text-gray-500 mt-0.5">View and assign workers</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/admin/workers"
                className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                  <span className="text-lg">👷</span>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors duration-200">Worker Management</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Manage worker accounts</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/admin/businesses"
                className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors duration-200">
                  <span className="text-lg">🏢</span>
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-orange-700 transition-colors duration-200">Businesses</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Manage business accounts</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, href }: {
  title: string;
  value: number;
  icon: string;
  color: string;
  href: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400 hover:bg-yellow-100 text-yellow-700',
    green: 'bg-green-50 border-green-200 hover:border-green-400 hover:bg-green-100 text-green-700',
    purple: 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100 text-purple-700',
  };

  return (
    <Link
      href={href}
      className={`block p-3 sm:p-4 border-2 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer touch-manipulation`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-xl sm:text-2xl">{icon}</span>
        </div>
        <div className="ml-3 sm:ml-4 flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold mt-0.5">{value.toLocaleString()}</p>
        </div>
        <svg className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}