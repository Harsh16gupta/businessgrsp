// app/admin/payments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface WorkerPayment {
  id: string;
  name: string;
  phone: string;
  services: string[];
  rating: number;
  paymentDetails: any;
  totalBookings: number;
  completedBookings: number;
}

export default function WorkerPaymentsPage() {
  const [workers, setWorkers] = useState<WorkerPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchWorkerPayments();
  }, []);

  const fetchWorkerPayments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/worker-payment-details', {
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
        setWorkers(result.data);
      } else {
        console.error('Error fetching worker payments:', result.error);
      }
    } catch (error) {
      console.error('Error fetching worker payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.phone.includes(searchTerm) ||
                         worker.services.some(service => 
                           service.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesVerification = filterVerified === 'all' ? true :
                               filterVerified === 'verified' ? worker.paymentDetails?.isVerified :
                               !worker.paymentDetails?.isVerified;
    
    return matchesSearch && matchesVerification;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 safe-area-top">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Payment Details</h1>
          <p className="text-gray-600 mt-1">Manage worker payment information and verification</p>
        </div>
        <Link
          href="/admin"
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Total Workers</h3>
          <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Payment Setup</h3>
          <p className="text-2xl font-bold text-green-600">
            {workers.filter(w => w.paymentDetails).length}
          </p>
          <p className="text-xs text-gray-500">of {workers.length} workers</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Verified</h3>
          <p className="text-2xl font-bold text-blue-600">
            {workers.filter(w => w.paymentDetails?.isVerified).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-600">Pending Verification</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {workers.filter(w => w.paymentDetails && !w.paymentDetails.isVerified).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, phone, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterVerified}
            onChange={(e) => setFilterVerified(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Workers</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
          <button
            onClick={fetchWorkerPayments}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Worker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                      <div className="text-sm text-gray-500">{worker.phone}</div>
                      <div className="text-xs text-gray-400">
                        Rating: {worker.rating || 'Not rated'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {worker.services.slice(0, 2).join(', ')}
                      {worker.services.length > 2 && (
                        <span className="text-gray-500"> +{worker.services.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {worker.completedBookings} / {worker.totalBookings}
                    </div>
                    <div className="text-xs text-gray-500">Completed / Total</div>
                  </td>
                  <td className="px-6 py-4">
                    {worker.paymentDetails ? (
                      <div className="text-sm">
                        <div className="text-gray-900">
                          {worker.paymentDetails.upiId && 'UPI'}
                          {worker.paymentDetails.bankAccountNumber && (worker.paymentDetails.upiId ? ', Bank' : 'Bank')}
                          {!worker.paymentDetails.upiId && !worker.paymentDetails.bankAccountNumber && 'Not set'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {worker.paymentDetails.upiId && `UPI: ${worker.paymentDetails.upiId}`}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-red-600">Not configured</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {worker.paymentDetails ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        worker.paymentDetails.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {worker.paymentDetails.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Not Setup
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/workers/${worker.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/admin/payments/${worker.id}`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Payment Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500">No workers found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}