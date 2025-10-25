"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Service } from '@/lib/utils/constant';
import { SearchBar } from '@/components/services/SearchBar';
import { CategoryFilter } from '@/components/services/CategoryFilter';
import { ServiceGrid } from '@/components/services/ServiceGrid';
import { SectionHeader } from '@/components/services/SectionHeader';
import RequirementForm from '@/components/b2b/RequirementForm';

// Define categories based on your actual data
const SERVICE_CATEGORIES = [
  { id: "all", name: "All Business Services", icon: "🏢", count: 0 },
  { id: "hospitality", name: "Hospitality Staff", icon: "🏨", count: 0 },
  { id: "transportation", name: "Transport Staff", icon: "🚚", count: 0 },
  { id: "healthcare", name: "Hospital Staff", icon: "🏥", count: 0 },
  { id: "retail", name: "Retail & Warehouse", icon: "🛍️", count: 0 },
  { id: "industrial", name: "Factory Staff", icon: "🏭", count: 0 }
];

export default function ServicesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]); // ✅ USE IMPORTED INTERFACE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/service');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setServices(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch services');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on category and search query
  const filteredServices = useMemo(() => {
    if (!services.length) return [];

    let filtered = services;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => 
        service.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [services, selectedCategory, searchQuery]);

  const handleBookNow = (service: Service) => { // ✅ USE IMPORTED INTERFACE
    // Redirect to requirement form with service details
    const queryParams = new URLSearchParams({
      serviceType: service.name,
      serviceId: service.id
    }).toString();
    
    router.push("/requirement-form")
  };

  // Update categories with real counts from API
  const updatedCategories = useMemo(() => {
    return SERVICE_CATEGORIES.map(cat => ({
      ...cat,
      count: cat.id === 'all' 
        ? services.length 
        : services.filter(s => s.category.toLowerCase() === cat.id.toLowerCase()).length
    }));
  }, [services]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 pt-20 sm:pt-24 transition-colors duration-300">
        <section className="relative py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 pt-20 sm:pt-24 transition-colors duration-300">
        <section className="relative py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Error Loading Services
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-20 sm:pt-24 transition-colors duration-300">
      {/* Main Content */}
      <section className="relative py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionHeader
              title="Professional Services"
              subtitle={`Choose trusted services for your business`}
              centered
            />
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 sm:mb-16 space-y-6 sm:space-y-8"
          >
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
            <CategoryFilter
              categories={updatedCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </motion.div>

          {/* Services Grid */}
          <AnimatePresence mode="wait">
            <ServiceGrid
              key={`${selectedCategory}-${searchQuery}`}
              services={filteredServices}
              onBookNow={handleBookNow}
            />
          </AnimatePresence>

          {/* No Results State */}
          {filteredServices.length === 0 && services.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No services found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
              </div>
            </motion.div>
          )}

          {/* No Services Available */}
          {services.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Services Available
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  Services will be available soon. Please check back later.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}