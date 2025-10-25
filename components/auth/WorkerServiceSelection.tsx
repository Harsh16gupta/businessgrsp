// components/auth/WorkerServiceSelection.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Service } from '@/lib/utils/constant'

interface WorkerServiceSelectionProps {
  onComplete: (selectedService: string) => void
  onBack: () => void
  singleSelection?: boolean
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export function WorkerServiceSelection({
  onComplete,
  onBack,
  singleSelection = true
}: WorkerServiceSelectionProps) {
  const [selectedService, setSelectedService] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/service')

        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          setServices(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch services')
        }
      } catch (err) {
        console.error('Error fetching services:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Define categories based on available services
  const SERVICE_CATEGORIES: ServiceCategory[] = [
    { id: "all", name: "All Business Services", icon: "🏢", count: services.length },
    { id: "hospitality", name: "Hospitality Staff", icon: "🏨", count: services.filter(s => s.category === "hospitality").length },
    { id: "transportation", name: "Transport Staff", icon: "🚚", count: services.filter(s => s.category === "transportation").length },
    { id: "healthcare", name: "Hospital Staff", icon: "🏥", count: services.filter(s => s.category === "healthcare").length },
    { id: "retail", name: "Retail & Warehouse", icon: "🛍️", count: services.filter(s => s.category === "retail").length },
    { id: "industrial", name: "Factory Staff", icon: "🏭", count: services.filter(s => s.category === "industrial").length }
  ]

  const handleServiceSelect = (serviceId: string) => {
    if (singleSelection) {
      setSelectedService(prev => prev === serviceId ? "" : serviceId)
    }
  }

  // In the handleSubmit function, change this:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) {
      alert('Please select a service')
      return
    }

    setIsSubmitting(true)
    try {
      // Find the selected service to get its name
      const selectedServiceObj = services.find(s => s.id === selectedService)
      if (!selectedServiceObj) {
        throw new Error('Selected service not found')
      }

      // Convert service name to slug format
      const serviceSlug = selectedServiceObj.name.toLowerCase().replace(/[\/\s]+/g, '-')
      console.log('Submitting service slug:', serviceSlug, 'from service:', selectedServiceObj.name)

      await onComplete(serviceSlug)
    } catch (error) {
      console.error('Error submitting service:', error)
      setIsSubmitting(false)
    }
  }

  const getSelectedServiceDetails = () => {
    if (!selectedService) return null
    const service = services.find(s => s.id === selectedService)
    const category = SERVICE_CATEGORIES.find(cat => cat.id === service?.category)
    return { service, category }
  }

  const selectedServiceInfo = getSelectedServiceDetails()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-4xl">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg py-8">
              <CardTitle className="text-3xl font-bold">Loading Services</CardTitle>
              <p className="text-blue-100 mt-2 text-lg">
                Please wait while we load available services...
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-center">Loading services...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-4xl">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-red-600 to-red-600 text-white rounded-t-lg py-8">
              <CardTitle className="text-3xl font-bold">Error Loading Services</CardTitle>
              <p className="text-red-100 mt-2 text-lg">
                Unable to load services at the moment
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Service Loading Failed
                </h3>
                <p className="text-gray-600 mb-6">
                  {error}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-4xl">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center bg-gradient-to-r from-yellow-600 to-yellow-600 text-white rounded-t-lg py-8">
              <CardTitle className="text-3xl font-bold">No Services Available</CardTitle>
              <p className="text-yellow-100 mt-2 text-lg">
                Services will be available soon
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📭</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Services Found
                </h3>
                <p className="text-gray-600 mb-6">
                  There are currently no services available for selection. Please check back later.
                </p>
                <Button
                  onClick={onBack}
                  variant="outline"
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg py-8">
            <CardTitle className="text-3xl font-bold">Choose Your Expertise</CardTitle>
            <p className="text-blue-100 mt-2 text-lg">
              Select the primary service you specialize in
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Categories with Services */}
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {SERVICE_CATEGORIES
                  .filter(cat => cat.id !== 'all' && cat.count > 0)
                  .map((category) => {
                    const categoryServices = services.filter(service =>
                      service.category === category.id && service.isActive !== false
                    )
                    if (categoryServices.length === 0) return null

                    return (
                      <div key={category.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-600">
                              {categoryServices.length} service{categoryServices.length > 1 ? 's' : ''} available
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {categoryServices.map((service) => (
                            <div
                              key={service.id}
                              className={`
                                relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 group
                                ${selectedService === service.id
                                  ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                                  : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm'
                                }
                              `}
                              onClick={() => handleServiceSelect(service.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                  <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${selectedService === service.id
                                      ? 'bg-blue-500 border-blue-500'
                                      : 'border-gray-400 group-hover:border-blue-400'
                                    }
                                  `}>
                                    {selectedService === service.id && (
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <label className="block cursor-pointer">
                                    <span className="font-semibold text-gray-900 group-hover:text-blue-700">
                                      {service.name}
                                    </span>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-sm font-medium text-green-600">
                                        ₹{service.basePrice}
                                      </span>
                                      <span className="text-xs text-gray-500">•</span>
                                      <span className="text-xs text-gray-600">
                                        {service.duration}
                                      </span>
                                    </div>
                                    {service.description && (
                                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {service.description}
                                      </p>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Selected Service Preview */}
              {selectedServiceInfo && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-lg">
                          {selectedServiceInfo.category?.icon}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">
                          Selected Service
                        </h4>
                        <p className="text-sm text-green-700">
                          {selectedServiceInfo.service?.name} • ₹{selectedServiceInfo.service?.basePrice}
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Ready to go!
                    </div>
                  </div>
                </div>
              )}

              {/* Debug info */}
              {selectedService && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Debug:</strong> Selected service ID: {selectedService}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 py-3 text-lg font-semibold border-2"
                  size="lg"
                  disabled={isSubmitting}
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  size="lg"
                  disabled={!selectedService || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : selectedService ? (
                    `Complete Registration`
                  ) : (
                    'Select a Service to Continue'
                  )}
                </Button>
              </div>

              {/* Progress Indicator */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>Step 2 of 2</div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Almost there! Just confirm your service selection
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}