'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface BookingData {
  id: string;
  serviceType: string;
  business: {
    name: string;
    phone: string;
    email: string;
    companyName: string;
    location: string;
  };
  duration: string;
  location: string;
  workersNeeded: number;
  additionalNotes?: string;
  createdAt: string;
  paymentAmount?: number;
  amountPerWorker?: number;
  negotiatedPrice?: number;
  numberOfDays?: number;
}

export default function AcceptBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [worker, setWorker] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid booking link');
      setLoading(false);
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'WORKER') {
        setWorker(userData);
      }
    }

    fetchBookingDetails();
  }, [token]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/accept?token=${token}`);
      const result = await response.json();

      if (result.success) {
        setBooking(result.data);
      } else {
        setError(result.error || 'Failed to load booking details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async () => {
    if (!token) return;

    if (!worker || worker.role !== 'WORKER') {
      setError('Please log in as a worker first');
      router.push(`/login?returnUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }
    
    setAccepting(true);
    setError('');

    try {
      const response = await fetch('/api/bookings/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          workerId: worker.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/worker/dashboard');
        }, 3000);
      } else {
        setError(result.error || 'Failed to accept booking');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateWorkerEarnings = () => {
    if (!booking?.paymentAmount || !booking?.numberOfDays || !booking?.workersNeeded) return null;
    
    const perWorkerPerDay = booking.paymentAmount / booking.workersNeeded / booking.numberOfDays;
    const totalForOneWorker = perWorkerPerDay * booking.numberOfDays;
    
    return {
      daily: perWorkerPerDay,
      total: totalForOneWorker,
      days: booking.numberOfDays
    };
  };

  const workerEarnings = calculateWorkerEarnings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white ">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white  pt-15">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-2">Unable to Load</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => worker ? router.push('/worker/dashboard') : router.push('/login')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-all duration-300"
          >
            {worker ? 'Go to Dashboard' : 'Login as Worker'}
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-2">Booking Confirmed</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Booking accepted successfully. Business notified.
          </p>
          {workerEarnings && (
            <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
              <p className="text-green-800 font-semibold text-xl mb-1">
                {formatCurrency(workerEarnings.total)}
              </p>
              <p className="text-green-600 text-sm">
                Your total earnings
              </p>
            </div>
          )}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-blue-600 text-sm">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-15">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Booking Opportunity
            </h1>
            <p className="text-gray-500">
              {worker ? `Welcome back, ${worker.name}` : 'Sign in to accept this booking'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Card */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-1">
                    {booking?.serviceType}
                  </h2>
                  <p className="text-gray-500 text-sm">Professional service request</p>
                </div>
                <div className="bg-blue-600 text-white px-3 py-1 rounded-xl text-xs font-medium">
                  {booking?.workersNeeded} spot{booking?.workersNeeded !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Earnings Section */}
              {workerEarnings && (
                <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 text-center">Your Earnings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-light text-gray-900">{formatCurrency(workerEarnings.daily)}</p>
                      <p className="text-gray-500 text-sm mt-1">Per Day</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-light text-gray-900">{formatCurrency(workerEarnings.total)}</p>
                      <p className="text-gray-500 text-sm mt-1">Total</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-center text-sm mt-3">
                    {workerEarnings.days} day{workerEarnings.days !== 1 ? 's' : ''} project
                  </p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Client Details */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Client Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      {booking?.business.companyName}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      {booking?.business.name}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      {booking?.business.phone}
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Service Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {booking?.duration}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      {booking?.workersNeeded} workers needed
                    </div>
                    {booking?.numberOfDays && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        {booking.numberOfDays} day{booking.numberOfDays !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Service Location</h4>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center text-gray-700 text-sm">
                    <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {booking?.location}
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {booking?.additionalNotes && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Additional Notes</h4>
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-gray-700 leading-relaxed text-sm">{booking.additionalNotes}</p>
                  </div>
                </div>
              )}

              {/* No Payment Info */}
              {!workerEarnings && (
                <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                    <div>
                      <p className="text-blue-800 font-medium text-sm">Payment Details</p>
                      <p className="text-blue-600 text-sm">
                        Will be discussed with client
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Action Panel */}
          <div className="space-y-4">
            {/* Action Card */}
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-1">Ready to Accept?</h3>
                <p className="text-gray-500 text-sm">Join this opportunity</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAcceptBooking}
                  disabled={accepting || !worker}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {!worker ? (
                    'Login to Accept'
                  ) : accepting ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Accepting...
                    </span>
                  ) : workerEarnings ? (
                    `Accept - ${formatCurrency(workerEarnings.total)}`
                  ) : (
                    'Accept Booking'
                  )}
                </button>

                <button
                  onClick={() => router.push(worker ? '/worker/dashboard' : '/')}
                  className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  {worker ? 'Decline' : 'Back'}
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Professional client</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Platform protected</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  ⚡ Limited spots
                </p>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <p className="text-gray-700 font-medium text-sm mb-1">Quick Response</p>
              <p className="text-gray-500 text-xs">Accept within 1 hour</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}