// app/admin/bookings/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface BookingDetails {
  _id: string;
  serviceType: string;
  workersNeeded: number;
  duration: string;
  location: string;
  status: string;
  createdAt: string;
  additionalNotes: string;
  business: {
    companyName: string;
    name: string;
    phone: string;
    email: string;
  };
  assignments: Array<{
    _id: string;
    status: string;
    createdAt: string;
    worker: {
      _id: string;
      name: string;
      phone: string;
      services: string;
      rating: number;
    };
  }>;
}

export default function BookingDetailsPage() {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingLinks, setSendingLinks] = useState(false);
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  useEffect(() => {
    if (bookingId) {
      console.log("Booking id is in {id} page.tsx>>>>>>>>>>>>", bookingId)
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }

      const result = await response.json();
      
      if (result.success) {
        setBooking(result.data);
      } else {
        console.error('Error fetching booking:', result.error);
        alert('Failed to load booking details');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  // FIX: Get unique workers - only show the latest status for each worker
  const getUniqueAssignments = (assignments: any[]) => {
    const workerMap = new Map();
    
    // Sort by creation date (newest first) to get latest status
    const sortedAssignments = [...assignments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Keep only the latest assignment for each worker
    sortedAssignments.forEach(assignment => {
      const workerId = assignment.worker._id;
      if (!workerMap.has(workerId)) {
        workerMap.set(workerId, assignment);
      }
    });

    return Array.from(workerMap.values());
  };

  // FIX: Get only accepted workers for counting
  const getAcceptedWorkers = (assignments: any[]) => {
    const uniqueAssignments = getUniqueAssignments(assignments);
    return uniqueAssignments.filter(assignment => assignment.status === 'ACCEPTED');
  };

  const handleSendWorkerLinks = async () => {
    if (!bookingId) return;

    setSendingLinks(true);
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
        alert(`Worker links sent successfully! ${result.data?.workersNotified || 0} workers notified.`);
        fetchBooking(); // Refresh booking data
      } else {
        alert('Failed to send worker links: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending worker links:', error);
      alert('Failed to send worker links');
    } finally {
      setSendingLinks(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500"></p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // FIX: Use unique assignments instead of all assignments
  const uniqueAssignments = getUniqueAssignments(booking.assignments || []);
  const acceptedWorkersCount = getAcceptedWorkers(booking.assignments || []).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600">Manage this booking and worker assignments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          {booking.status === 'PENDING' && (
            <button
              onClick={handleSendWorkerLinks}
              disabled={sendingLinks}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {sendingLinks ? 'Sending...' : 'Send Links to Workers'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Service Type</label>
                <p className="text-gray-900">{booking.serviceType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Workers Needed</label>
                <p className="text-gray-900">{booking.workersNeeded}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Duration</label>
                <p className="text-gray-900">{booking.duration}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{booking.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-gray-900">{new Date(booking.createdAt).toLocaleString()}</p>
              </div>
            </div>
            
            {booking.additionalNotes && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                <p className="text-gray-900 mt-1">{booking.additionalNotes}</p>
              </div>
            )}
          </div>

          {/* Business Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Company Name</label>
                <p className="text-gray-900">{booking.business.companyName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Person</label>
                <p className="text-gray-900">{booking.business.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{booking.business.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{booking.business.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Assignments */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Worker Assignments</h2>
            
            {/* FIX: Added summary stats */}
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              <div className="text-center bg-green-50 p-2 rounded">
                <div className="font-semibold text-green-700">{acceptedWorkersCount}</div>
                <div className="text-green-600">Accepted</div>
              </div>
              <div className="text-center bg-yellow-50 p-2 rounded">
                <div className="font-semibold text-yellow-700">
                  {uniqueAssignments.filter(a => a.status === 'PENDING').length}
                </div>
                <div className="text-yellow-600">Pending</div>
              </div>
            </div>

            <div className="space-y-4">
              {uniqueAssignments.length > 0 ? (
                uniqueAssignments.map((assignment) => (
                  <div key={assignment._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{assignment.worker.name}</p>
                        <p className="text-sm text-gray-500">{assignment.worker.phone}</p>
                        <p className="text-sm text-gray-500">{assignment.worker.services}</p>
                        {assignment.worker.rating && (
                          <p className="text-sm text-yellow-600">⭐ {assignment.worker.rating}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        assignment.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {assignment.status === 'ACCEPTED' ? 'Accepted' : 'Assigned'}: {new Date(assignment.createdAt).toLocaleString()}
                    </p>
                    
                    {/* FIX: Show note if this worker has multiple assignments */}
                    {booking.assignments.filter(a => a.worker._id === assignment.worker._id).length > 1 && (
                      <p className="text-xs text-blue-600 mt-1">
                        ⓘ Updated from previous assignment
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No workers assigned yet</p>
              )}
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {acceptedWorkersCount} / {booking.workersNeeded} workers assigned
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}