'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface BookingDetails {
  id: string;
  serviceType: string;
  workersNeeded: number;
  duration: string;
  location: string;
  status: string;
  createdAt: string;
  additionalNotes: string;
  paymentAmount?: number;
  amountPerWorker?: number;
  negotiatedPrice?: number;
  numberOfDays?: number; // Add this field
  totalCost?: number; // Add this field
  business: {
    companyName: string;
    name: string;
    phone: string;
    email: string;
  };
  assignments: Array<{
    id: string;
    status: string;
    createdAt: string;
    worker: {
      id: string;
      name: string;
      phone: string;
      services: string[];
      rating: number;
    };
  }>;
}

// Enhanced Payment Modal Component
function PaymentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  workersCount,
  businessProposedAmount,
  numberOfDays // Add this prop
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (totalAmount: number, amountPerWorker: number) => void; // Update to accept both amounts
  workersCount: number;
  businessProposedAmount?: number;
  numberOfDays?: number;
}) {
  const [amountPerWorker, setAmountPerWorker] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  // Calculate total amount when per worker amount changes
  useEffect(() => {
    if (amountPerWorker && workersCount > 0 && numberOfDays) {
      const perWorker = parseFloat(amountPerWorker);
      const total = perWorker * workersCount * numberOfDays;
      setTotalAmount(total.toFixed(2));
    } else {
      setTotalAmount('');
    }
  }, [amountPerWorker, workersCount, numberOfDays]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountPerWorker && parseFloat(amountPerWorker) > 0 && numberOfDays) {
      const perWorkerAmount = parseFloat(amountPerWorker);
      const totalPayment = perWorkerAmount * workersCount * numberOfDays;
      onConfirm(totalPayment, perWorkerAmount);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Set Payment Details</h2>
        
        {/* Show business proposed amount if available */}
        {businessProposedAmount && (
          <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-700 font-medium">
              💼 Business Proposed: ₹{businessProposedAmount}/worker/day
            </p>
            <p className="text-xs text-purple-600 mt-1">
              The business user suggested this amount per worker per day
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment per Worker per Day (₹)
              </label>
              <input
                type="number"
                value={amountPerWorker}
                onChange={(e) => setAmountPerWorker(e.target.value)}
                placeholder="Enter amount per worker per day"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                step="0.01"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This amount will be shown to workers as daily payment
              </p>
            </div>

            {totalAmount && numberOfDays && (
              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                <p className="text-sm text-blue-700">
                  <strong>Payment Calculation:</strong>
                </p>
                <p className="text-sm text-blue-600">
                  {workersCount} workers × {numberOfDays} days × ₹{amountPerWorker}/day
                </p>
                <p className="text-lg font-bold text-blue-700">
                  Total Payment: ₹{parseInt(totalAmount).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-blue-600">
                  Each worker will receive: ₹{amountPerWorker} per day for {numberOfDays} days
                </p>
              </div>
            )}

            {!numberOfDays && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700">
                  ⚠️ Number of days not specified in this booking
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!amountPerWorker || parseFloat(amountPerWorker) <= 0 || !numberOfDays}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send Notifications
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookingDetailsPage() {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingLinks, setSendingLinks] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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

  // Get unique workers - only show the latest status for each worker
  const getUniqueAssignments = (assignments: any[]) => {
    const workerMap = new Map();
    
    // Sort by creation date (newest first) to get latest status
    const sortedAssignments = [...assignments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Keep only the latest assignment for each worker
    sortedAssignments.forEach(assignment => {
      const workerId = assignment.worker.id;
      if (!workerMap.has(workerId)) {
        workerMap.set(workerId, assignment);
      }
    });

    return Array.from(workerMap.values());
  };

  // Get only accepted workers for counting
  const getAcceptedWorkers = (assignments: any[]) => {
    const uniqueAssignments = getUniqueAssignments(assignments);
    return uniqueAssignments.filter(assignment => assignment.status === 'ACCEPTED');
  };

  const handleSendWorkerLinks = async (totalAmount: number, amountPerWorker: number) => {
    if (!bookingId) return;

    setSendingLinks(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/bookings/${bookingId}/send-links`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentAmount: totalAmount,
          amountPerWorker: amountPerWorker
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Worker links sent successfully! ${result.data?.workersNotified || 0} workers notified. Payment set: ₹${amountPerWorker}/worker/day`);
        fetchBooking(); // Refresh booking data
      } else {
        alert('Failed to send worker links: ' + result.error);
      }
    } catch (error) {
      console.error('Error sending worker links:', error);
      alert('Failed to send worker links');
    } finally {
      setSendingLinks(false);
      setShowPaymentModal(false);
    }
  };

  const handleSendLinksClick = () => {
    setShowPaymentModal(true);
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

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate business total cost
  const calculateBusinessTotalCost = () => {
    if (booking?.negotiatedPrice && booking?.workersNeeded && booking?.numberOfDays) {
      return booking.negotiatedPrice * booking.workersNeeded * booking.numberOfDays;
    }
    return null;
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
        <p className="text-gray-500">Booking not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Use unique assignments instead of all assignments
  const uniqueAssignments = getUniqueAssignments(booking.assignments || []);
  const acceptedWorkersCount = getAcceptedWorkers(booking.assignments || []);
  const businessTotalCost = calculateBusinessTotalCost();

  return (
    <div className="space-y-6">
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handleSendWorkerLinks}
        workersCount={booking?.workersNeeded || 0}
        businessProposedAmount={booking?.negotiatedPrice}
        numberOfDays={booking?.numberOfDays}
      />

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
              onClick={handleSendLinksClick}
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
                <label className="text-sm font-medium text-gray-500">Duration per Day</label>
                <p className="text-gray-900">{booking.duration}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Number of Days</label>
                <p className="text-gray-900">{booking.numberOfDays || 'Not specified'}</p>
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
            
            {/* Payment Information Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business User's Proposed Amount */}
                {booking.negotiatedPrice && booking.numberOfDays && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-purple-600">💼</span>
                      <h4 className="text-sm font-medium text-purple-900">Business Proposed Budget</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">
                      {formatCurrency(booking.negotiatedPrice)}/worker/day
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-purple-600">
                      <p>• {booking.workersNeeded} workers needed</p>
                      <p>• {booking.numberOfDays} days duration</p>
                      {businessTotalCost && (
                        <p className="font-semibold">
                          • Total Project: {formatCurrency(businessTotalCost)}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-purple-600 mt-2">
                      Amount suggested by the business user per worker per day
                    </p>
                  </div>
                )}

                {/* Admin Set Payment Amount */}
                {booking.paymentAmount && booking.amountPerWorker && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-green-600">💰</span>
                      <h4 className="text-sm font-medium text-green-900">Admin Set Payment</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {formatCurrency(booking.amountPerWorker/booking.workersNeeded)}/worker/day
                    </p>
                    {booking.numberOfDays && (
                      <div className="mt-2 space-y-1 text-sm text-green-600">
                        <p>• {booking.workersNeeded} workers</p>
                        <p>• {booking.numberOfDays} days</p>
                        <p className="font-semibold">
                          • Total Payment: {formatCurrency(booking.paymentAmount)}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-green-600 mt-2">
                      Amount set by admin to be shown to workers
                    </p>
                  </div>
                )}

                {/* No Payment Set */}
                {!booking.negotiatedPrice && !booking.paymentAmount && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-gray-600">💸</span>
                      <h4 className="text-sm font-medium text-gray-900">No Payment Amount Set</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      No payment amount has been set for this booking yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {booking.additionalNotes && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded-lg">{booking.additionalNotes}</p>
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
            
            {/* Summary stats */}
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              <div className="text-center bg-green-50 p-2 rounded">
                <div className="font-semibold text-green-700">{acceptedWorkersCount.length}</div>
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
                  <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{assignment.worker.name}</p>
                        <p className="text-sm text-gray-500">{assignment.worker.phone}</p>
                        <p className="text-sm text-gray-500">
                          {Array.isArray(assignment.worker.services) 
                            ? assignment.worker.services.join(', ')
                            : assignment.worker.services}
                        </p>
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
                    
                    {/* Show note if this worker has multiple assignments */}
                    {booking.assignments.filter(a => a.worker.id === assignment.worker.id).length > 1 && (
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
                {acceptedWorkersCount.length} / {booking.workersNeeded} workers assigned
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}