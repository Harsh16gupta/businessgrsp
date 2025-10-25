// app/admin/services/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SERVICE_CATEGORIES = [
  'hospitality',
  'transportation', 
  'healthcare',
  'retail',
  'industrial',
  'construction',
  'cleaning',
  'security'
];

export default function CreateServicePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    duration: '',
    image: '/images/factory-helper.png',
    tags: '',
    seoKeywords: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          seoKeywords: formData.seoKeywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Service created successfully!');
        router.push('/admin/services');
      } else {
        alert('Failed to create service: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Create New Service
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Add a new service to your offerings
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-all duration-200 cursor-pointer group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Back to Services
            </button>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-all duration-300 hover:shadow-md">
          <div className="space-y-6 sm:space-y-8">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Service Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Enter service name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white cursor-pointer"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="" className="text-gray-400">Select Category</option>
                  {SERVICE_CATEGORIES.map(category => (
                    <option key={category} value={category} className="text-gray-900">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Base Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Base Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                    placeholder="0.00"
                    value={formData.basePrice}
                    onChange={(e) => handleInputChange('basePrice', e.target.value)}
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="e.g., 8 hours, 1 month"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-vertical"
                placeholder="Describe the service in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            {/* Tags & SEO Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Comma separated: hotel, restaurant, staff"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas for better categorization
                </p>
              </div>

              {/* SEO Keywords */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Comma separated: hotel staff, restaurant workers"
                  value={formData.seoKeywords}
                  onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Keywords for search engine optimization
                </p>
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200 transition-all duration-200 hover:bg-blue-100 cursor-pointer">
              <input
                type="checkbox"
                id="featured"
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer transition-colors"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
              />
              <label htmlFor="featured" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer">
                <span className="font-semibold text-blue-800">Feature this service on homepage</span>
                <p className="text-blue-600 text-xs mt-1">
                  This service will be prominently displayed on the homepage
                </p>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Service...
                  </div>
                ) : (
                  'Create Service'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Tips */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm">💡</span>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 text-sm">Quick Tips</h3>
              <ul className="text-blue-600 text-xs mt-2 space-y-1">
                <li>• Use clear, descriptive service names for better user understanding</li>
                <li>• Add relevant tags to improve service discoverability</li>
                <li>• Include SEO keywords to boost search engine visibility</li>
                <li>• Feature only your most popular or important services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}