'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BusinessUser {
  id: string;
  phone: string;
  name: string;
  email: string;
  companyName: string;
  location: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    bookings: number;
  };
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<BusinessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/businesses', {
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
        setBusinesses(result.data);
      } else {
        console.error('Error fetching businesses:', result.error);
        alert('Failed to load businesses');
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      alert('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  // Filter businesses based on search term
  const filteredBusinesses = businesses.filter(business =>
    business.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.phone.includes(searchTerm) ||
    business.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
        Verified
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
        Pending
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 safe-area-top safe-area-bottom">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Business Users</h1>
          <p className="text-xs sm:text-sm text-gray-600">Manage all registered business accounts</p>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          Total: {businesses.length} business{businesses.length !== 1 ? 'es' : ''}
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Search Box */}
        <div className="lg:col-span-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search businesses by name, company, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Total</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">{businesses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Verified</p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900">
                  {businesses.filter(b => b.isVerified).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Business Accounts
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Info
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((business) => (
                  <tr 
                    key={business.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => {/* Add click handler for business details */}}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {business.companyName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {business.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{business.phone}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[160px]">{business.email}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{business.location}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {getVerificationBadge(business.isVerified)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {business._count.bookings}
                      </div>
                      <div className="text-xs text-gray-500">total bookings</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(business.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-8 text-center">
                    <div className="text-gray-500 text-sm">
                      {searchTerm ? 'No businesses found matching your search' : 'No businesses found'}
                    </div>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200 cursor-pointer"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with pagination info */}
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredBusinesses.length}</span> of{' '}
              <span className="font-medium">{businesses.length}</span> businesses
            </div>
            {searchTerm && (
              <div className="text-sm text-gray-500">
                Search: "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-3">
        {filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <div 
              key={business.id} 
              className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 transition-all duration-200 hover:shadow-md cursor-pointer touch-manipulation"
              onClick={() => {/* Add click handler for business details */}}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {business.companyName}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{business.name}</p>
                </div>
                {getVerificationBadge(business.isVerified)}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">Phone:</span>
                  <span className="text-gray-900 font-medium">{business.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">Email:</span>
                  <span className="text-gray-900 font-medium truncate ml-2">{business.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">Location:</span>
                  <span className="text-gray-900 font-medium capitalize">{business.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">Bookings:</span>
                  <span className="text-gray-900 font-semibold">{business._count.bookings}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-gray-500 text-xs">Registered:</span>
                  <span className="text-gray-900 font-medium">{formatDate(business.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white shadow-sm rounded-xl border border-gray-200">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mb-2">
              {searchTerm ? 'No businesses found matching your search' : 'No businesses found'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200 cursor-pointer font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Footer Info */}
      <div className="lg:hidden bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="text-center text-sm text-gray-600">
          Showing {filteredBusinesses.length} of {businesses.length} businesses
          {searchTerm && (
            <div className="mt-1 text-xs text-gray-500">
              Search: "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}