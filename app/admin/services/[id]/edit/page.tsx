// app/admin/services/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function EditServicePage() {
    const [formData, setFormData] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;

    useEffect(() => {
        if (serviceId) {
            fetchService();
        }
    }, [serviceId]);

    const fetchService = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/admin/services/${serviceId}`, {
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
                setFormData(result.data);
            } else {
                setError('Failed to fetch service: ' + result.error);
            }
        } catch (error) {
            console.error('Error fetching service:', error);
            setError('Failed to fetch service');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        if (formData) {
            setFormData(prev => prev ? { ...prev, [field]: value } : null);
        }
    };

    const handleArrayInput = (field: string, value: string) => {
        if (formData) {
            const arrayValue = value
                .split(',')
                .map(item => item.trim())
                .filter(item => item);
            setFormData(prev => prev ? { ...prev, [field]: arrayValue } : null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/admin/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Success animation and redirect
                setTimeout(() => {
                    router.push('/admin/services');
                }, 1500);
            } else {
                setError('Failed to update service: ' + result.error);
            }
        } catch (error) {
            console.error('Error updating service:', error);
            setError('Failed to update service');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading service details...</p>
                </motion.div>
            </div>
        );
    }

    if (!formData && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Service Not Found</h2>
                    <p className="text-gray-600 max-w-md">
                        The service you're trying to edit doesn't exist or you don't have permission to access it.
                    </p>
                    <button
                        onClick={() => router.push('/admin/services')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                        Back to Services
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Service</h1>
                            <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                Update service details and configuration
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/admin/services')}
                            className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2"
                        >
                            <span>←</span>
                            <span>Back to Services</span>
                        </motion.button>
                    </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                    {saving && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center space-x-3"
                        >
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-800 font-medium">Service updated successfully! Redirecting...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3"
                        >
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <span className="text-red-800 font-medium">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-8"
                >
                    {/* Basic Information */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">
                            Basic Information
                        </h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Service Name */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <label className="block text-sm font-medium text-gray-700">
                                    Service Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    value={formData?.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            </motion.div>

                            {/* Category */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2"
                            >
                                <label className="block text-sm font-medium text-gray-700">
                                    Category *
                                </label>
                                <select
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
                                    value={formData?.category || ''}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    {SERVICE_CATEGORIES.map(category => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </motion.div>

                            {/* Base Price */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-2"
                            >
                                <label className="block text-sm font-medium text-gray-700">
                                    Base Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    value={formData?.basePrice || 0}
                                    onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value))}
                                />
                            </motion.div>

                            {/* Duration */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-2"
                            >
                                <label className="block text-sm font-medium text-gray-700">
                                    Duration *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="e.g., 8 hours, 1 month"
                                    value={formData?.duration || ''}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                />
                            </motion.div>
                        </div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-2"
                        >
                            <label className="block text-sm font-medium text-gray-700">
                                Description *
                            </label>
                            <textarea
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-vertical"
                                value={formData?.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </motion.div>
                    </div>

                    {/* SEO & Metadata */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">
                            SEO & Metadata
                        </h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Tags */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="space-y-2"
                            >
                                <label className="block text-sm font-medium text-gray-700">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Comma separated: hotel, restaurant, staff"
                                    value={Array.isArray(formData?.tags) ? formData.tags.join(', ') : formData?.tags || ''}
                                    onChange={(e) => handleArrayInput('tags', e.target.value)}
                                />
                                <p className="text-xs text-gray-500">Separate tags with commas</p>
                            </motion.div>

                            {/* SEO Keywords */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 }}
                                className="space-y-2"
                            >
                                <label className="block text-sm font-medium text-gray-700">
                                    SEO Keywords
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Comma separated: hotel staff, restaurant workers"
                                    value={Array.isArray(formData?.seoKeywords) ? formData.seoKeywords.join(', ') : formData?.seoKeywords || ''}
                                    onChange={(e) => handleArrayInput('seoKeywords', e.target.value)}
                                />
                                <p className="text-xs text-gray-500">Separate keywords with commas</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">
                            Settings
                        </h3>
                        
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 }}
                                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                                <input
                                    type="checkbox"
                                    id="featured"
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-300"
                                    checked={formData?.featured || false}
                                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                                />
                                <label htmlFor="featured" className="flex-1 text-sm text-gray-900 font-medium">
                                    Feature this service on homepage
                                </label>
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Premium</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1 }}
                                className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-300"
                                    checked={formData?.isActive || false}
                                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                />
                                <label htmlFor="isActive" className="flex-1 text-sm text-gray-900 font-medium">
                                    Service is active and available for booking
                                </label>
                            </motion.div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200"
                    >
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 font-medium"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            disabled={saving}
                            whileHover={!saving ? { scale: 1.02 } : {}}
                            whileTap={!saving ? { scale: 0.98 } : {}}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium flex items-center justify-center space-x-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </motion.button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
    );
}