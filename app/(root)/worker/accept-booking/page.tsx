'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface BookingData {
  id: string;
  serviceType: string; // ✅ Use serviceType instead of service.name
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
  // Remove service object since it doesn't exist in your data
}

export default function AcceptBookingPage() {
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

    // Get worker from localStorage
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
      console.log('Sending acceptance request:', { token, workerId: worker.id });
      
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
      console.log('Acceptance response:', result);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/worker/dashboard');
        }, 3000);
      } else {
        setError(result.error || 'Failed to accept booking');
      }
    } catch (err) {
      console.error('Acceptance error:', err);
      setError('Network error. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          {worker ? (
            <button
              onClick={() => router.push('/worker/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Login as Worker
            </button>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Accepted!</h1>
          <p className="text-gray-600 mb-4">
            You have successfully accepted the booking. The business has been notified.
          </p>
          <p className="text-gray-500 text-sm">
            Redirecting to dashboard in 3 seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">New Booking Request</h1>
            <p className="text-blue-100">
              {worker ? `Welcome, ${worker.name}!` : 'Please log in as worker to accept'}
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            {/* Service Info */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {booking?.serviceType} {/* ✅ Fixed: Use serviceType directly */}
              </h2>
              <p className="text-gray-600">Service requested by business</p>
            </div>

            {/* Business Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Details</h3>
                <p className="text-gray-600">
                  <strong>Company:</strong> {booking?.business.companyName}
                </p>
                <p className="text-gray-600">
                  <strong>Contact:</strong> {booking?.business.name}
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {booking?.business.phone}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Details</h3>
                <p className="text-gray-600">
                  <strong>Posted:</strong> {booking && new Date(booking.createdAt).toLocaleString('en-IN')}
                </p>
                <p className="text-gray-600">
                  <strong>Duration:</strong> {booking?.duration}
                </p>
                <p className="text-gray-600">
                  <strong>Workers Needed:</strong> {booking?.workersNeeded}
                </p>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Location</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {booking?.location}
              </p>
            </div>

            {/* Additional Notes */}
            {booking?.additionalNotes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  {booking.additionalNotes}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push(worker ? '/worker/dashboard' : '/')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                {worker ? 'Decline' : 'Cancel'}
              </button>
              <button
                onClick={handleAcceptBooking}
                disabled={accepting || !worker}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {!worker ? (
                  'Login to Accept'
                ) : accepting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Accepting...
                  </span>
                ) : (
                  'Accept Booking'
                )}
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mt-3">
              First come, first served. This booking will be assigned to the first worker who accepts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}