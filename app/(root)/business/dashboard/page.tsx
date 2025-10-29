'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BusinessBooking {
  id: string;
  serviceType: string;
  workersNeeded: number;
  duration: string;
  location: string;
  status: string;
  createdAt: string;
  negotiatedPrice?: number;
  assignments: {
    id: string;
    status: string;
    worker: {
      name: string;
      phone: string;
      rating: number;
    };
  }[];
}

interface BusinessStats {
  totalRequirements: number;
  assignedRequirements: number;
  pendingRequirements: number;
  totalWorkersAssigned: number;
}

export default function BusinessDashboard() {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [bookings, setBookings] = useState<BusinessBooking[]>([]);
  const [stats, setStats] = useState<BusinessStats>({
    totalRequirements: 0,
    assignedRequirements: 0,
    pendingRequirements: 0,
    totalWorkersAssigned: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements'>('overview');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'BUSINESS') {
        setBusiness(userData);
        fetchBusinessData(userData.id);
      } else {
        router.push('/worker/dashboard');
      }
    } else {
      router.push('/business-auth');
    }
  }, [router]);

  const fetchBusinessData = async (businessId: string) => {
    try {
      const [bookingsResponse] = await Promise.all([
        fetch(`/api/bookings?businessId=${businessId}`),
      ]);

      const bookingsResult = await bookingsResponse.json();
      
      if (bookingsResult.success) {
        setBookings(bookingsResult.data);
        calculateStats(bookingsResult.data);
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData: BusinessBooking[]) => {
    const totalRequirements = bookingsData.length;
    const assignedRequirements = bookingsData.filter(b => b.status === 'ASSIGNED').length;
    const pendingRequirements = bookingsData.filter(b => b.status === 'PENDING').length;
    
    // FIX: Only count ACCEPTED assignments
    const totalWorkersAssigned = bookingsData.reduce((total, booking) => 
      total + booking.assignments.filter(a => a.status === 'ACCEPTED').length, 0
    );

    setStats({
      totalRequirements,
      assignedRequirements,
      pendingRequirements,
      totalWorkersAssigned
    });
  };

  // FIX: Get only accepted workers
  const getAcceptedWorkers = (assignments: any[]) => {
    return assignments.filter(assignment => assignment.status === 'ACCEPTED');
  };

  const handleViewDetails = (bookingId: string) => {
    // Navigate to booking details page
    router.push(`/business/requirements/${bookingId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      ASSIGNED: { color: 'bg-green-100 text-green-800', label: 'Assigned' },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      COMPLETED: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 pb-20 md:pb-8">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Business Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {business?.name}!
              </h1>
              <p className="text-gray-600 text-base md:text-lg">
                Here's your business overview and staffing requirements.
              </p>
            </div>
            <Link
              href="/requirement-form"
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 cursor-pointer inline-flex items-center justify-center shadow-sm hover:shadow-md active:scale-95"
            >
              <span className="text-lg mr-2">+</span>
              New Requirement
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: 'Total Requirements', value: stats.totalRequirements, color: 'blue', icon: '📋' },
            { label: 'Pending', value: stats.pendingRequirements, color: 'blue', icon: '⏳' },
            { label: 'Workers Assigned', value: stats.totalWorkersAssigned, color: 'blue', icon: '👥' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl flex items-center justify-center transition-all duration-300`}>
                    <span className="text-lg md:text-xl">{stat.icon}</span>
                  </div>
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Business Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 transition-all duration-300 hover:shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { label: 'Company Name', value: business?.companyName },
              { label: 'Contact Person', value: business?.name },
              { label: 'Email', value: business?.email },
              { label: 'Phone', value: business?.phone },
              { label: 'Location', value: business?.location },
              { label: 'Account Type', value: 'Business' }
            ].map((info, index) => (
              <div key={info.label} className="space-y-1">
                <p className="text-sm text-gray-600">{info.label}</p>
                <p className="font-medium text-gray-900 text-base">{info.value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Your Requirements</h2>
            <div className="flex space-x-2 bg-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('requirements')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === 'requirements'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Requirements
              </button>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                <span className="text-2xl md:text-3xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Start by creating your first staffing requirement.
              </p>
              <Link
                href="/requirement-form"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 cursor-pointer inline-flex items-center justify-center shadow-sm hover:shadow-md active:scale-95"
              >
                <span className="text-lg mr-2">+</span>
                Create Requirement
              </Link>
            </div>
          ) : activeTab === 'overview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {bookings.slice(0, isMobile ? 2 : 4).map((booking) => {
                // FIX: Get only accepted workers
                const acceptedWorkers = getAcceptedWorkers(booking.assignments);
                
                return (
                  <div 
                    key={booking.id} 
                    className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-all duration-300 cursor-pointer bg-white"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg line-clamp-1">{booking.serviceType}</h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Workers Needed:</span>
                        <span className="font-medium">{booking.workersNeeded}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{booking.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-right max-w-[120px] truncate">{booking.location}</span>
                      </div>
                      {booking.negotiatedPrice && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium text-blue-600">₹{booking.negotiatedPrice}</span>
                        </div>
                      )}
                    </div>

                    {/* FIX: Only show accepted workers */}
                    {acceptedWorkers.length > 0 && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Assigned Workers ({acceptedWorkers.length}):
                        </p>
                        <div className="space-y-2">
                          {acceptedWorkers.slice(0, 2).map((assignment) => (
                            <div key={assignment.id} className="flex justify-between items-center text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{assignment.worker.name}</span>
                                {assignment.worker.rating && (
                                  <span className="text-yellow-600 text-xs">⭐ {assignment.worker.rating}</span>
                                )}
                              </div>
                              <span className="text-gray-500 text-xs">{assignment.worker.phone}</span>
                            </div>
                          ))}
                          {acceptedWorkers.length > 2 && (
                            <div className="text-xs text-blue-600 font-medium">
                              +{acceptedWorkers.length - 2} more workers
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* FIX: Show message if no workers accepted yet */}
                    {acceptedWorkers.length === 0 && booking.assignments.length > 0 && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium text-yellow-700 mb-2">
                          ⏳ Waiting for workers to accept
                        </p>
                        <div className="text-xs text-gray-500">
                          {booking.assignments.length} worker(s) pending confirmation
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                      <span className="text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                      </span>
                      {/* FIX: Make View Details button work */}
                      <button 
                        onClick={() => handleViewDetails(booking.id)}
                        className="text-blue-600 text-xs font-medium hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                      >
                       
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 md:px-4 text-sm font-medium text-gray-600">Service</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm font-medium text-gray-600">Workers</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm font-medium text-gray-600">Accepted</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm font-medium text-gray-600">Duration</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm font-medium text-gray-600">Location</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-2 md:px-4 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const acceptedWorkers = getAcceptedWorkers(booking.assignments);
                    return (
                      <tr 
                        key={booking.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      >
                        <td className="py-3 px-2 md:px-4 text-sm font-medium text-gray-900">{booking.serviceType}</td>
                        <td className="py-3 px-2 md:px-4 text-sm text-gray-600">{booking.workersNeeded}</td>
                        <td className="py-3 px-2 md:px-4 text-sm text-gray-600">
                          {acceptedWorkers.length > 0 ? (
                            <span className="text-green-600 font-medium">{acceptedWorkers.length}</span>
                          ) : (
                            <span className="text-yellow-600">0</span>
                          )}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-sm text-gray-600">{booking.duration}</td>
                        <td className="py-3 px-2 md:px-4 text-sm text-gray-600 max-w-[100px] truncate">{booking.location}</td>
                        <td className="py-3 px-2 md:px-4">{getStatusBadge(booking.status)}</td>
                        <td className="py-3 px-2 md:px-4 text-sm text-gray-600">
                          {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <button 
                            onClick={() => handleViewDetails(booking.id)}
                            className="text-blue-600 text-xs font-medium hover:text-blue-700 transition-colors duration-200 cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {bookings.length > (isMobile ? 2 : 4) && activeTab === 'overview' && (
            <div className="text-center mt-6">
              <button
                onClick={() => setActiveTab('requirements')}
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 cursor-pointer inline-flex items-center"
              >
                View all {bookings.length} requirements
                <span className="ml-2">→</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex justify-around items-center h-16">
            <Link
              href="/requirement-form"
              className="flex flex-col items-center justify-center text-blue-600"
            >
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mb-1">
                <span className="text-lg">+</span>
              </div>
              <span className="text-xs font-medium">New</span>
            </Link>
            <button className="flex flex-col items-center justify-center text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-lg">📋</span>
              </div>
              <span className="text-xs font-medium">Requirements</span>
            </button>
            <button className="flex flex-col items-center justify-center text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <span className="text-lg">👤</span>
              </div>
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}