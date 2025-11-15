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
  totalRevenue?: number;
  completedBookings?: number;
}

interface WorkerAssignment {
  assignmentId: string;
  worker: {
    id: string;
    name: string;
    phone: string;
    rating?: number;
  };
  paymentDetails?: {
    upiId: string;
    phoneNumber: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    isVerified: boolean;
  };
  bookingDetails: {
    serviceType: string;
    paymentAmount?: number;
    amountPerWorker?: number;
    numberOfDays?: number;
  };
  assignmentStatus: string;
}

interface Booking {
  _id: string;
  id?: string;
  status: string;
  serviceType: string;
  business?: {
    companyName: string;
  };
  workersNeeded: number;
  location: string;
  numberOfDays?: number;
  negotiatedPrice?: number;
  amountPerWorker?: number;
  paymentAmount?: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [workerPaymentDetails, setWorkerPaymentDetails] = useState<WorkerAssignment[]>([]);
  const [paymentDetailsLoading, setPaymentDetailsLoading] = useState(false);

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

  const fetchWorkerPaymentDetails = async (bookingId: string) => {
    try {
      setPaymentDetailsLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`/api/admin/worker-payment-details?bookingId=${bookingId}`, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        setWorkerPaymentDetails(result.data);
        setSelectedBooking(bookingId);
      } else {
        console.error('Error fetching payment details:', result.error);
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Error fetching worker payment details:', error);
    } finally {
      setPaymentDetailsLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total payment for a booking
  const calculateBookingTotal = (booking: any) => {
    if (booking.paymentAmount) {
      return booking.paymentAmount;
    } else if (booking.negotiatedPrice && booking.workersNeeded && booking.numberOfDays) {
      return booking.negotiatedPrice * booking.workersNeeded * booking.numberOfDays;
    }
    return null;
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
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardStats}
            className="text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Refresh
          </button>
          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            Last updated: Just now
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
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
          title="Completed"
          value={stats?.completedBookings || 0}
          icon="✅"
          color="green"
          href="/admin/bookings?status=COMPLETED"
        />
        <StatCard
          title="Services"
          value={stats?.totalServices || 0}
          icon="🛠️"
          color="purple"
          href="/admin/services"
        />
        <StatCard
          title="Active Workers"
          value={stats?.activeWorkers || 0}
          icon="👷"
          color="indigo"
          href="/admin/workers"
        />
      </div>

      {/* Revenue Stats */}
      {stats?.totalRevenue && stats.totalRevenue > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Total Platform Revenue</h2>
              <p className="text-green-100 text-sm mt-1">Total earnings from all completed bookings</p>
            </div>
            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-green-100 text-sm mt-1">{stats.completedBookings || 0} completed bookings</p>
            </div>
          </div>
        </div>
      )}

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
                {stats.recentBookings.map((booking: Booking) => {
                  const totalAmount = calculateBookingTotal(booking);
                  const hasPaymentInfo = booking.paymentAmount || booking.negotiatedPrice;
                  
                  return (
                    <div 
                      key={booking._id} 
                      className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                    >
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => router.push(`/admin/bookings/${booking._id || booking.id}`)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            booking.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border border-green-200' :
                            booking.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800 border border-gray-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {booking.status}
                          </span>
                          <h3 className="text-sm font-medium text-gray-900 truncate">{booking.serviceType}</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                          {booking.business?.companyName} • {booking.workersNeeded} workers • {booking.location}
                          {booking.numberOfDays && ` • ${booking.numberOfDays} days`}
                        </p>
                        
                        {/* Payment Information */}
                        {hasPaymentInfo && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {booking.negotiatedPrice && (
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                                💼 Biz: {formatCurrency(booking.negotiatedPrice)}/day
                              </span>
                            )}
                            {booking.amountPerWorker && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                💰 Worker: {formatCurrency(booking.amountPerWorker)}/day
                              </span>
                            )}
                            {totalAmount && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                🎯 Total: {formatCurrency(totalAmount)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col items-end gap-2 ml-3">
                        <div className="text-xs text-gray-500 hidden sm:block">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetchWorkerPaymentDetails(booking._id || booking.id!);
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                            disabled={paymentDetailsLoading}
                          >
                            {paymentDetailsLoading ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Loading...
                              </>
                            ) : (
                              'View Payments'
                            )}
                          </button>
                          <button
                            onClick={() => router.push(`/admin/bookings/${booking._id || booking.id}`)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                            title="View booking details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No recent bookings</p>
                <Link
                  href="/admin/bookings"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
                >
                  View all bookings
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats - Takes 1/3 on desktop */}
        <div className="space-y-6">
          {/* Quick Actions */}
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

                {/* Payment Management Link */}
                <Link
                  href="/admin/payments"
                  className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
                    <span className="text-lg">💰</span>
                  </div>
                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 transition-colors duration-200">Payment Management</h3>
                    <p className="text-xs text-gray-500 mt-0.5">View worker payment details</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Platform Stats</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Businesses</span>
                  <span className="text-sm font-semibold text-gray-900">{stats?.totalBusinesses || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Services</span>
                  <span className="text-sm font-semibold text-gray-900">{stats?.totalServices || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verified Workers</span>
                  <span className="text-sm font-semibold text-gray-900">{stats?.activeWorkers || 0}</span>
                </div>
                {stats?.totalRevenue && (
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="text-sm font-semibold text-green-600">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Worker Payment Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Worker Payment Details</h3>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setWorkerPaymentDetails([]);
                }}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {workerPaymentDetails.length > 0 ? (
              <>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Booking:</strong> {workerPaymentDetails[0]?.bookingDetails.serviceType} • 
                    <strong> Workers:</strong> {workerPaymentDetails.length}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workerPaymentDetails.map((assignment) => (
                    <div key={assignment.assignmentId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{assignment.worker.name}</h4>
                          <p className="text-gray-600 text-sm">Phone: {assignment.worker.phone}</p>
                          {assignment.worker.rating && (
                            <p className="text-gray-500 text-xs mt-1">Rating: {assignment.worker.rating}/5</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            assignment.assignmentStatus === 'ACCEPTED' 
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : assignment.assignmentStatus === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {assignment.assignmentStatus}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            assignment.paymentDetails?.isVerified 
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {assignment.paymentDetails?.isVerified ? 'Verified' : 'Not Verified'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h5 className="font-medium text-gray-700 text-sm mb-2">Payment Details:</h5>
                        {assignment.paymentDetails ? (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">UPI ID:</span>
                              <span className={assignment.paymentDetails.upiId ? "text-green-600 font-mono text-xs" : "text-red-600"}>
                                {assignment.paymentDetails.upiId || 'Not set'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone Number:</span>
                              <span className={assignment.paymentDetails.phoneNumber ? "text-green-600" : "text-red-600"}>
                                {assignment.paymentDetails.phoneNumber || 'Not set'}
                              </span>
                            </div>
                            {assignment.paymentDetails.bankAccountNumber && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bank Account:</span>
                                <span className="text-green-600 font-mono">
                                  ****{assignment.paymentDetails.bankAccountNumber.slice(-4)}
                                </span>
                              </div>
                            )}
                            {assignment.paymentDetails.ifscCode && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">IFSC Code:</span>
                                <span className="text-green-600 font-mono">
                                  {assignment.paymentDetails.ifscCode}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-red-600 text-sm bg-red-50 p-2 rounded">No payment details added</p>
                        )}
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 text-sm mb-1">Booking Payment:</h5>
                        <p className="text-lg font-bold text-blue-800">
                          {assignment.bookingDetails.amountPerWorker 
                            ? `₹${assignment.bookingDetails.amountPerWorker.toLocaleString()}`
                            : 'Not set'
                          }
                        </p>
                        {assignment.bookingDetails.numberOfDays && assignment.bookingDetails.amountPerWorker && (
                          <p className="text-sm text-blue-600">
                            {assignment.bookingDetails.numberOfDays} day{assignment.bookingDetails.numberOfDays !== 1 ? 's' : ''} × 
                            ₹{Math.round(assignment.bookingDetails.amountPerWorker / assignment.bookingDetails.numberOfDays).toLocaleString()}/day
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-gray-500">No worker payment details found for this booking</p>
                <p className="text-gray-400 text-sm mt-1">Workers may not have set up their payment information yet.</p>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setWorkerPaymentDetails([]);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
    indigo: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100 text-indigo-700',
  };

  return (
    <Link
      href={href}
      className={`block p-3 sm:p-4 border-2 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer touch-manipulation ${colorClasses[color as keyof typeof colorClasses]}`}
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