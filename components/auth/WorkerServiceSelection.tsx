// components/auth/WorkerServiceSelection.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Service } from '@/lib/utils/constant'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'

interface WorkerServiceSelectionProps {
  onComplete: (selectedService: string) => void
  onBack: () => void
  singleSelection?: boolean
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

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/service')
        
        if (!response.ok) throw new Error('Failed to fetch services')
        
        const result = await response.json()
        if (result.success) {
          setServices(result.data)
        }
      } catch (err) {
        console.error('Error fetching services:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleServiceSelect = (serviceId: string) => {
    if (singleSelection) {
      setSelectedService(prev => prev === serviceId ? "" : serviceId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) return

    setIsSubmitting(true)
    try {
      const selectedServiceObj = services.find(s => s.id === selectedService)
      if (!selectedServiceObj) return

      const serviceSlug = selectedServiceObj.name.toLowerCase().replace(/[\/\s]+/g, '-')
      await onComplete(serviceSlug)
    } catch (error) {
      console.error('Error submitting service:', error)
      setIsSubmitting(false)
    }
  }

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<string, Service[]>)

  // Loading State
  if (loading) {
    return (
      <div className=" flex items-center justify-center bg-white p-4 py-3">
        <div className="w-full max-w-sm mx-auto">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-3" />
                <p className="text-gray-500 text-sm">Loading services...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center bg-white py-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto"
      >
        <Card className="border border-gray-200 shadow-sm rounded-2xl">
          {/* Header */}
          <CardHeader className="pb-4 px-5 pt-5">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                onClick={onBack}
                className="p-2 h-auto -ml-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Step 2 of 2
              </div>
            </div>
            
            <CardTitle className="text-lg font-medium text-gray-900">
              Choose Service
            </CardTitle>
            <p className="text-gray-500 text-sm mt-1">
              Select your primary expertise
            </p>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Services List */}
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                  <div key={category} className="space-y-2">
                    {categoryServices.map((service) => (
                      <motion.div
                        key={service.id}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`
                            p-3 rounded-xl border cursor-pointer transition-all
                            ${selectedService === service.id
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-400'
                            }
                          `}
                          onClick={() => handleServiceSelect(service.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                                ${selectedService === service.id
                                  ? 'bg-gray-900 border-gray-900'
                                  : 'border-gray-400'
                                }
                              `}>
                                {selectedService === service.id && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {service.name}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  ₹{service.basePrice} • {service.duration}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 text-sm border-gray-300"
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-sm bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={!selectedService || isSubmitting}
                >
                  {isSubmitting ? '...' : 'Continue'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}