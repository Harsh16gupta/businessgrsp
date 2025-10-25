// app/admin/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  serviceCharge: number;
  duration: string;
  image: string;
  tags: string[];
  seoKeywords: string[];
  popularity: number;
  featured: boolean;
  isActive: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/services', {
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
        setServices(result.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    setDeletingId(serviceId);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        fetchServices(); // Refresh the list
      } else {
        alert('Failed to delete service: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      });

      const result = await response.json();
      
      if (result.success) {
        fetchServices(); // Refresh the list
      } else {
        alert('Failed to update service status: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 text-sm">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Services Management
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Manage your service offerings and track performance
              </p>
            </div>
            <Link
              href="/admin/services/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>+</span>
              Add New Service
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{services.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-lg">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {services.filter(s => s.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {services.filter(s => s.featured).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-yellow-600 text-lg">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {new Set(services.map(s => s.category)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-purple-600 text-lg">🏷️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                All Services ({services.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className={`w-2 h-2 rounded-full bg-green-500`}></span>
                Active: {services.filter(s => s.isActive).length}
                <span className="w-2 h-2 rounded-full bg-gray-300 ml-2"></span>
                Inactive: {services.filter(s => !s.isActive).length}
              </div>
            </div>
          </div>
          
          {/* Services Grid */}
          <div className="divide-y divide-gray-100">
            {services.length > 0 ? (
              services.map((service) => (
                <div 
                  key={service.id} 
                  className="p-4 sm:p-6 hover:bg-blue-50/50 transition-all duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Service Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Badges */}
                        <span 
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                            service.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          onClick={() => toggleServiceStatus(service.id, service.isActive)}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                        
                        {service.featured && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            <span className="text-yellow-600">⭐</span>
                            Featured
                          </span>
                        )}
                        
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {service.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      {/* Service Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium">Price:</span>
                          <span className="font-semibold text-green-600">₹{service.basePrice}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium">Duration:</span>
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium">Popularity:</span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-500">🔥</span>
                            {service.popularity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-medium">Service Charge:</span>
                          <span>₹{service.serviceCharge}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      {service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {service.tags.slice(0, 4).map((tag, index) => (
                            <span 
                              key={index} 
                              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-lg transition-colors hover:bg-gray-200"
                            >
                              {tag}
                            </span>
                          ))}
                          {service.tags.length > 4 && (
                            <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-lg">
                              +{service.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-200 text-center cursor-pointer shadow-sm hover:shadow-md"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        disabled={deletingId === service.id}
                        className="flex-1 lg:flex-none px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md"
                      >
                        {deletingId === service.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Deleting...
                          </div>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty State */
              <div className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-gray-400">📦</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Get started by creating your first service to offer to customers.
                </p>
                <Link
                  href="/admin/services/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>+</span>
                  Create Your First Service
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}