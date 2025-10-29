'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Worker {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  services: string[];
  rating: number | null;
  isActive: boolean | null;
  isVerified: boolean;
  createdAt: string;
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/workers', {
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
        setWorkers(result.data);
      } else {
        console.error('Error fetching workers:', result.error);
        alert('Failed to load workers');
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      alert('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleDeleteWorker = async (workerId: string, workerName: string) => {
    if (!confirm(`Are you sure you want to delete ${workerName || 'this worker'}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/workers/${workerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Worker deleted successfully');
        fetchWorkers(); // Refresh the list
      } else {
        alert('Failed to delete worker: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting worker:', error);
      alert('Failed to delete worker');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getStatusBadge = (isActive: boolean | null) => {
    return isActive ? 
      'bg-green-100 text-green-800 px-2 py-1 rounded text-xs' : 
      'bg-red-100 text-red-800 px-2 py-1 rounded text-xs';
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return isVerified ? 
      'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs' : 
      'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Management</h1>
          <p className="text-gray-600">Manage worker accounts and assignments</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Management</h1>
          <p className="text-gray-600">Manage worker accounts and assignments</p>
        </div>
        <button
          onClick={fetchWorkers}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Total Workers</div>
          <div className="text-2xl font-bold text-gray-900">{workers.length}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Active Workers</div>
          <div className="text-2xl font-bold text-green-600">
            {workers.filter(w => w.isActive).length}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Verified Workers</div>
          <div className="text-2xl font-bold text-blue-600">
            {workers.filter(w => w.isVerified).length}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Avg Rating</div>
          <div className="text-2xl font-bold text-yellow-600">
            {workers.filter(w => w.rating).length > 0 
              ? (workers.reduce((acc, w) => acc + (w.rating || 0), 0) / workers.filter(w => w.rating).length).toFixed(1)
              : '0.0'
            }
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {workers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No workers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Worker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {worker.name || 'Unnamed Worker'}
                        </div>
                        
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{worker.phone}</div>
                      {worker.email && (
                        <div className="text-sm text-gray-500">{worker.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {worker.services.slice(0, 3).map((service, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        {worker.services.length > 3 && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            +{worker.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {worker.rating ? (
                        <div className="flex items-center">
                          <span className="text-yellow-600">⭐ {worker.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No rating</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(worker.isActive)}>
                        {worker.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(worker.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteWorker(worker.id, worker.name || 'Worker')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}