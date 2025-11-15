'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BusinessBooking {
  id: string;
  serviceType: string;
  workersNeeded: number;
  duration: string;
  location: string;
  status: string;
  createdAt: string;
  paymentAmount?: number;
  amountPerWorker?: number;
  negotiatedPrice?: number;
  numberOfDays?: number; // Add this field
  totalCost?: number; // Add this field
  business: {
    companyName: string;
    name: string;
    phone: string;
  };
  assignments: Array<{
    status: string;
    worker: {
      name: string;
      phone: string;
    };
  }>;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BusinessBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const url = statusFilter === 'ALL' 
        ? '/api/admin/bookings' 
        : `/api/admin/bookings?status=${statusFilter}`;
      
      const response = await fetch(url, {
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
        setBookings(result.data);
      } else {
        console.error('Error fetching bookings:', result.error);
        alert('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignmentsCount = (booking: BusinessBooking) => {
    const accepted = booking.assignments.filter(a => a.status === 'ACCEPTED').length;
    return `${accepted}/${booking.workersNeeded}`;
  };

  const handleSendWorkerLinks = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/bookings/${bookingId}/send-links`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${token}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Worker links sent successfully!');
        fetchBookings(); // Refresh the list
      } else {
        alert('Failed to send worker links: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending worker links:', error);
      alert('Failed to send worker links');
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

  // Calculate total project cost for business
  const calculateBusinessTotalCost = (booking: BusinessBooking) => {
    if (booking.negotiatedPrice && booking.numberOfDays && booking.workersNeeded) {
      return booking.negotiatedPrice * booking.workersNeeded * booking.numberOfDays;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Bookings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchBookings()}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Business Bookings</h1>
          <p className="text-gray-600 text-base md:text-lg">
            Manage and assign workers to business requirements
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 transition-all duration-300">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'ALL', label: 'All', color: 'blue' },
              { value: 'PENDING', label: 'Pending', color: 'yellow' },
              { value: 'ASSIGNED', label: 'Assigned', color: 'blue' },
              { value: 'CONFIRMED', label: 'Confirmed', color: 'green' },
              { value: 'COMPLETED', label: 'Completed', color: 'gray' },
              { value: 'CANCELLED', label: 'Cancelled', color: 'red' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                  statusFilter === filter.value 
                    ? `bg-blue-600 text-white shadow-sm` 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 transition-all duration-300">
          <h2 className="text-lg font-semibold text-gray-900">
            {bookings.length} Booking{bookings.length !== 1 ? 's' : ''} Found
          </h2>
        </div>

        {/* Bookings List */}
        <div className="space-y-4 md:space-y-6">
          {bookings.length > 0 ? (
            bookings.map((booking) => {
              const businessTotalCost = calculateBusinessTotalCost(booking);
              
              return (
                <div 
                  key={booking.id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:shadow-md cursor-pointer"
                  onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-1">
                            {booking.serviceType}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          {!isMobile && (
                            <div className="text-sm text-gray-500">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </div>
                          )}
                          {/* Payment Badge - Show business user's amount */}
                          {booking.negotiatedPrice && (
                            <div className="flex items-center space-x-1 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200">
                              <span className="text-purple-600 text-sm font-medium">
                                💼 
                              </span>
                              <span className="text-purple-700 text-sm font-medium">
                                {formatCurrency(booking.negotiatedPrice)}/day
                              </span>
                            </div>
                          )}
                          {/* Admin set payment badge */}
                          {booking.paymentAmount && (
                            <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                              <span className="text-green-600 text-sm font-medium">
                                💰 
                              </span>
                              <span className="text-green-700 text-sm font-medium">
                                {formatCurrency(booking.paymentAmount)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-gray-600 font-medium">Business</p>
                          <p className="text-gray-900">{booking.business.companyName}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600 font-medium">Contact</p>
                          <p className="text-gray-900">{booking.business.name}</p>
                          <p className="text-gray-500 text-xs">{booking.business.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600 font-medium">Workers</p>
                          <p className="text-gray-900">{getAssignmentsCount(booking)} assigned</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600 font-medium">Location</p>
                          <p className="text-gray-900 line-clamp-1">{booking.location}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600 font-medium">Duration</p>
                          <p className="text-gray-900">{booking.duration}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-600 font-medium">Days</p>
                          <p className="text-gray-900">{booking.numberOfDays || 'Not specified'}</p>
                        </div>
                        
                        {/* Payment Information */}
                        <div className="space-y-1 sm:col-span-2 lg:col-span-2">
                          <p className="text-gray-600 font-medium">Payment Information</p>
                          <div className="flex flex-wrap gap-2">
                            {/* Business User's Proposed Amount */}
                            {booking.negotiatedPrice && booking.numberOfDays && (
                              <div className="flex flex-col">
                                <span className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-xs font-medium">
                                  <div className="flex items-center space-x-1">
                                    <span>💼 Business Proposed:</span>
                                    <span className="font-bold">{formatCurrency(booking.negotiatedPrice)}/worker/day</span>
                                  </div>
                                  {businessTotalCost && (
                                    <div className="text-purple-700 text-xs mt-1">
                                      Total Project: {formatCurrency(businessTotalCost)}
                                    </div>
                                  )}
                                </span>
                                <span className="text-purple-600 text-xs mt-1">
                                  {booking.workersNeeded} workers × {booking.numberOfDays} days
                                </span>
                              </div>
                            )}
                            
                            {/* Admin Set Payment Amount */}
                            {booking.paymentAmount && booking.amountPerWorker && (
                              <div className="flex flex-col">
                                <span className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-xs font-medium">
                                  <div className="flex items-center space-x-1">
                                    <span>💰 Admin Set:</span>
                                    <span className="font-bold">{formatCurrency(booking.amountPerWorker)}/worker/day</span>
                                  </div>
                                  <div className="text-green-700 text-xs mt-1">
                                    Total: {formatCurrency(booking.paymentAmount)}
                                  </div>
                                </span>
                                <span className="text-green-600 text-xs mt-1">
                                  Amount set by admin for workers
                                </span>
                              </div>
                            )}

                            {/* No Payment Set */}
                            {!booking.negotiatedPrice && !booking.paymentAmount && (
                              <span className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-xs font-medium">
                                💸 No payment amount set
                              </span>
                            )}
                          </div>
                        </div>

                        {isMobile && (
                          <div className="space-y-1">
                            <p className="text-gray-600 font-medium">Created</p>
                            <p className="text-gray-900">{new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>

                      {/* Assignments Summary */}
                      {booking.assignments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm font-medium text-gray-700 mb-2">Assigned Workers:</p>
                          <div className="flex flex-wrap gap-2">
                            {booking.assignments.slice(0, isMobile ? 2 : 4).map((assignment, index) => (
                              <div 
                                key={index}
                                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                  assignment.status === 'ACCEPTED' 
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {assignment.worker.name}
                                <span className="ml-1 text-xs opacity-75">
                                  ({assignment.status.toLowerCase()})
                                </span>
                              </div>
                            ))}
                            {booking.assignments.length > (isMobile ? 2 : 4) && (
                              <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium">
                                +{booking.assignments.length - (isMobile ? 2 : 4)} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div 
                      className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:gap-3 lg:w-32 lg:flex-shrink-0"
                      onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking buttons
                    >
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 cursor-pointer text-center shadow-sm hover:shadow-md active:scale-95"
                      >
                        {isMobile ? 'Manage' : 'Manage Booking'}
                      </Link>
                      {booking.status === 'PENDING' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendWorkerLinks(booking.id);
                          }}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md active:scale-95"
                        >
                          {isMobile ? 'Send Links' : 'Send Worker Links'}
                        </button>
                      )}
                      {booking.status === 'ASSIGNED' && booking.assignments.filter(a => a.status === 'ACCEPTED').length > 0 && (
                        <div className="text-center">
                          <span className="text-xs text-green-600 font-medium">
                            {booking.assignments.filter(a => a.status === 'ACCEPTED').length} accepted
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                <span className="text-2xl md:text-3xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                {statusFilter !== 'ALL' 
                  ? `No ${statusFilter.toLowerCase()} bookings found. Try changing the filter.`
                  : 'All bookings will appear here'
                }
              </p>
              {statusFilter !== 'ALL' && (
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                >
                  Show all bookings
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => fetchBookings()}
              className="flex flex-col items-center justify-center text-blue-600"
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mb-1">
                <span className="text-lg">↻</span>
              </div>
              <span className="text-xs font-medium">Refresh</span>
            </button>
            <button 
              className="flex flex-col items-center justify-center text-gray-600"
              onClick={() => {
                // Scroll to filters section
                document.querySelector('.bg-white.rounded-xl.shadow-sm')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-lg">⚙️</span>
              </div>
              <span className="text-xs font-medium">Filters</span>
            </button>
            <Link
              href="/admin"
              className="flex flex-col items-center justify-center text-gray-600"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-lg">🏠</span>
              </div>
              <span className="text-xs font-medium">Home</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}