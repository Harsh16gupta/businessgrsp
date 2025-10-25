'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Service } from '@/lib/utils/constant';

interface RequirementFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  serviceType: string;
  workersNeeded: string;
  duration: string;
  location: string;
  additionalNotes: string;
  proposedBudget: string;
}

export default function RequirementForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const preselectedService = searchParams.get('serviceType');
  const serviceId = searchParams.get('serviceId');

  const [formData, setFormData] = useState<RequirementFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceType: preselectedService || '',
    workersNeeded: '',
    duration: '',
    location: '',
    additionalNotes: '',
    proposedBudget: ''
  });

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'auth_required'>('idle');
  const [authFormData, setAuthFormData] = useState<RequirementFormData | null>(null);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError(null);
        
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
        setServicesError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Check for pending requirement data after authentication
  useEffect(() => {
    const pendingRequirement = sessionStorage.getItem('pendingBusinessRequirement');
    if (pendingRequirement) {
      const data = JSON.parse(pendingRequirement);
      setFormData(data);
      setAuthFormData(data);
      sessionStorage.removeItem('pendingBusinessRequirement');
      handleAutoSubmit(data);
    }
  }, []);

  // Auto-set service type when preselected
  useEffect(() => {
    if (preselectedService && !formData.serviceType) {
      setFormData(prev => ({
        ...prev,
        serviceType: preselectedService
      }));
    }
  }, [preselectedService, formData.serviceType]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAutoSubmit = async (data: RequirementFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const userData = localStorage.getItem('user');
      let userPhone = data.phone;

      if (userData) {
        const user = JSON.parse(userData);
        userPhone = user.phone;
      }

      const response = await fetch('/api/business/requirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          phone: userPhone,
          proposedBudget: data.proposedBudget
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          serviceType: '',
          workersNeeded: '',
          duration: '',
          location: '',
          additionalNotes: '',
          proposedBudget: ''
        });
        setAuthFormData(null);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const userData = localStorage.getItem('user');
      let userPhone = formData.phone;

      if (userData) {
        const user = JSON.parse(userData);
        userPhone = user.phone;
      }

      const response = await fetch('/api/business/requirement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          phone: userPhone,
          proposedBudget: formData.proposedBudget
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          serviceType: '',
          workersNeeded: '',
          duration: '',
          location: '',
          additionalNotes: '',
          proposedBudget: ''
        });
      } else if (response.status === 401 && result.requireAuth) {
        setSubmitStatus('auth_required');
        sessionStorage.setItem('pendingBusinessRequirement', JSON.stringify({
          ...formData,
          phone: userPhone,
          proposedBudget: formData.proposedBudget
        }));

        const queryParams = new URLSearchParams({
          action: 'register',
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          email: formData.email,
          phone: userPhone,
          location: formData.location,
          redirect: 'requirement'
        }).toString();

        router.push(`/business-auth?${queryParams}`);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.companyName && formData.contactPerson &&
    formData.email && formData.phone && formData.serviceType &&
    formData.workersNeeded && formData.duration && formData.location;

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-xl mx-auto min-h-screen">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 transition-colors duration-300">
              Get Staff for Your Business
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm transition-colors duration-300">
              Fill your requirement and we'll connect you with verified workers
            </p>
            
            {preselectedService && (
              <div className="mt-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-300">
                <p className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm">
                  <strong>Selected Service:</strong> {preselectedService}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg text-xs sm:text-sm transition-colors duration-300">
                ✅ Thank you! Your requirement has been submitted. We'll contact you within 24 hours.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-xs sm:text-sm transition-colors duration-300">
                ❌ There was an error submitting your requirement. Please try again.
              </div>
            )}

            {submitStatus === 'auth_required' && (
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg text-xs sm:text-sm transition-colors duration-300">
                🔐 Please create your business account to continue. Redirecting...
              </div>
            )}

            {authFormData && (
              <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg text-xs sm:text-sm transition-colors duration-300">
                🔄 Submitting your requirement now...
              </div>
            )}

            {/* Company & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="Your company name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                  Contact Person
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="Your name"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="your@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                Type of Staff Required
              </label>
              {servicesLoading ? (
                <div className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    <span className="text-slate-500 dark:text-slate-400">Loading services...</span>
                  </div>
                </div>
              ) : servicesError ? (
                <div className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-red-300 dark:border-red-600 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400">
                  Failed to load services. Please refresh the page.
                </div>
              ) : (
                <select
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                >
                  <option value="" className="text-slate-500 dark:text-slate-400">Select Staff Type</option>
                  {services
                    .filter(service => service.isActive !== false) // Only show active services
                    .map(service => (
                    <option key={service.id} value={service.name} className="text-slate-900 dark:text-white">
                      {service.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Workers & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                  Workers Needed
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="Number of workers"
                  value={formData.workersNeeded}
                  onChange={(e) => handleInputChange('workersNeeded', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                  Duration
                </label>
                <select
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                >
                  <option value="" className="text-slate-500 dark:text-slate-400">Select Duration</option>
                  <option value="8-hour shift">8-hour Shift</option>
                  <option value="12-hour shift">12-hour Shift</option>
                  <option value="Full-time monthly">Full-time Monthly</option>
                  <option value="Part-time daily">Part-time Daily</option>
                  <option value="Project basis">Project Basis</option>
                </select>
              </div>
            </div>

            {/* Location & Proposed Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                  Work Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="City, Area or Address"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                  Proposed Budget
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="e.g. ₹. as per requirement"
                  value={formData.proposedBudget}
                  onChange={(e) => handleInputChange('proposedBudget', e.target.value)}
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Any special requirements or notes..."
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting || servicesLoading || !!servicesError}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-blue-900 text-white rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  <span className="text-xs sm:text-sm">
                    {authFormData ? 'Auto-submitting...' : 'Submitting...'}
                  </span>
                </>
              ) : servicesError ? (
                'Cannot Submit - Services Error'
              ) : servicesLoading ? (
                'Loading Services...'
              ) : (
                'Submit Requirement'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}