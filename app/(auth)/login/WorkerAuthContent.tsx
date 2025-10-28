'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { WorkerServiceSelection } from '@/components/auth/WorkerServiceSelection'
import { toast } from 'sonner'

interface WorkerFormData {
  phone: string
  name: string
  service: string
}

export default function WorkerAuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlAction = searchParams.get('action') as 'login' | 'register' | null

  const [step, setStep] = useState<'auth' | 'service'>('auth')
  const [formData, setFormData] = useState<WorkerFormData>({
    phone: '',
    name: '',
    service: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRegister, setIsRegister] = useState(urlAction === 'register')
  const [whatsappStatus, setWhatsappStatus] = useState<'checking' | 'active' | 'inactive'>('checking')

  useEffect(() => {
    const checkWhatsAppStatus = async () => {
      try {
        const response = await fetch('/api/auth/send-otp')
        const data = await response.json()

        if (data.success && data.twilioConfigured && !data.simulated) {
          setWhatsappStatus('active')
          toast.success('WhatsApp OTP Active', {
            description: 'You will receive OTP via WhatsApp',
            duration: 3000,
          })
        } else {
          setWhatsappStatus('inactive')
          toast.info('Using Simulation Mode', {
            description: 'OTP will be shown in notification',
            duration: 3000,
          })
        }
      } catch (error) {
        setWhatsappStatus('inactive')
        toast.error('Connection Error', {
          description: 'Failed to check WhatsApp status',
          duration: 3000,
        })
      }
    }

    checkWhatsAppStatus()
  }, [])

  useEffect(() => {
    const action = isRegister ? 'register' : 'login'
    const newUrl = `/worker-auth?action=${action}`
    window.history.replaceState(null, '', newUrl)
  }, [isRegister])

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(formData.phone)) {
        setError('Please enter a valid 10-digit Indian phone number')
        toast.error('Invalid Phone Number', {
          description: 'Please enter a valid 10-digit Indian phone number',
          duration: 4000,
        })
        setLoading(false)
        return
      }

      if (isRegister) {
        if (!formData.name || formData.name.trim().length < 2) {
          setError('Please enter your full name')
          toast.error('Name Required', {
            description: 'Please enter your full name (at least 2 characters)',
            duration: 4000,
          })
          setLoading(false)
          return
        }

        toast.success('Profile Created!', {
          description: 'Now select your service type',
          duration: 3000,
        })
        setStep('service')
        setLoading(false)
        return
      }

      await handleSendOTP()
    } catch (err) {
      setError('An error occurred. Please try again.')
      toast.error('Unexpected Error', {
        description: 'An unexpected error occurred. Please try again.',
        duration: 4000,
      })
      setLoading(false)
    }
  }

  const handleServiceSelected = async (selectedService: string) => {
    const updatedFormData = { ...formData, service: selectedService }
    setFormData(updatedFormData)

    toast.success('Service Selected!', {
      description: `${selectedService} service selected. Sending OTP...`,
      duration: 3000,
    })

    await handleSendOTP(updatedFormData)
  }

  const handleSendOTP = async (currentFormData?: WorkerFormData) => {
    const dataToUse = currentFormData || formData
    setLoading(true)
    setError('')

    // Show loading toast
    const loadingToast = toast.loading('Sending OTP...')

    try {
      const requestBody: any = {
        phone: dataToUse.phone,
        userType: 'WORKER',
        action: isRegister ? 'register' : 'login',
      }

      if (isRegister) {
        requestBody.name = dataToUse.name
        requestBody.services = dataToUse.service ? [dataToUse.service] : []
      }

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (data.success) {
        // Dismiss loading toast first
        toast.dismiss(loadingToast)
        // Show OTP toast with the actual OTP from API response
        if (data.debugOtp) {
          toast.success('OTP Sent Successfully!', {
            description: `Your OTP is ${data.debugOtp}. Use this to verify.`,
            duration: 15000, // 15 seconds to give user time to see it
            action: {
              label: 'Copy OTP',
              onClick: () => {
                navigator.clipboard.writeText(data.debugOtp)
                toast.success('OTP Copied!', {
                  description: 'OTP copied to clipboard',
                  duration: 2000,
                })
              }
            }
          })
        } else {
          toast.success('OTP Sent!', {
            description: `OTP has been sent to your ${whatsappStatus === 'active' ? 'WhatsApp' : 'phone'}`,
            duration: 5000,
          })
        }

        const params = new URLSearchParams({
          phone: dataToUse.phone,
          userType: 'WORKER',
          action: isRegister ? 'register' : 'login',
        })

        if (isRegister) {
          params.append('name', dataToUse.name)
          if (dataToUse.service) {
            params.append('services', dataToUse.service)
          }
        }

        // Add a small delay before redirecting to ensure toast is visible
        setTimeout(() => {
          router.push(`/verify?${params.toString()}`)
        }, 1000)

      } else {
        setError(data.error || 'Failed to send OTP')
        setStep('auth')
        toast.dismiss(loadingToast)
        toast.error('Failed to Send OTP', {
          description: data.error || 'Please try again.',
          duration: 5000,
        })
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setStep('auth')
      toast.dismiss(loadingToast)
      toast.error('Network Error', {
        description: 'Please check your connection and try again.',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  if (step === 'service') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-800 
                       text-gray-700 dark:text-gray-200 sm:p-6 pt-10">
        <div className="w-full max-w-lg mx-auto">
          <WorkerServiceSelection
            onComplete={handleServiceSelected}
            onBack={() => {
              setStep('auth')
              toast.info('Back to Profile', {
                description: 'You can modify your profile details',
                duration: 3000,
              })
            }}
            singleSelection={true}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 
                       text-gray-700 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="shadow-xl border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 sm:py-8 px-4 sm:px-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                {isRegister ? 'Join Our Team' : 'Welcome Back'}
              </CardTitle>
              <p className="text-blue-100 mt-2 text-sm sm:text-base lg:text-lg">
                {isRegister ? 'Start your professional journey' : 'Access your worker account'}
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* WhatsApp Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 text-sm mb-4 sm:mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100"
            >
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${whatsappStatus === 'active' ? 'bg-green-500 animate-pulse' :
                whatsappStatus === 'inactive' ? 'bg-yellow-500' : 'bg-gray-500 animate-pulse'
                }`} />
              <span className="text-blue-700 font-medium text-xs sm:text-sm">
                {whatsappStatus === 'active' ? 'WhatsApp OTP Active' :
                  whatsappStatus === 'inactive' ? 'Using Simulation Mode' : 'Checking status...'}
              </span>
            </motion.div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 sm:space-y-6">
              {/* Toggle Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200"
              >
                <Button
                  type="button"
                  variant={!isRegister ? 'default' : 'outline'}
                  className={`flex-1 text-sm sm:text-base font-medium transition-all duration-300 ${!isRegister
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                    }`}
                  onClick={() => {
                    setIsRegister(false)
                    setError('')
                    toast.info('Login Mode', {
                      description: 'Enter your phone number to login',
                      duration: 3000,
                    })
                  }}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant={isRegister ? 'default' : 'outline'}
                  className={`flex-1 text-sm sm:text-base font-medium transition-all duration-300 ${isRegister
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white'
                    }`}
                  onClick={() => {
                    setIsRegister(true)
                    setError('')
                    toast.info('Registration Mode', {
                      description: 'Create your worker account',
                      duration: 3000,
                    })
                  }}
                >
                  Register
                </Button>
              </motion.div>

              {/* Name Field */}
              <AnimatePresence mode="wait">
                {isRegister && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium text-gray-700 sm:text-base">Full Name</label>
                    <Input
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={loading}
                      className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 rounded-xl"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phone Field */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-gray-700 sm:text-base">Phone Number</label>
                <Input
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                  disabled={loading}
                  maxLength={10}
                  type="tel"
                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 rounded-xl"
                  required
                />
                <p className="text-xs text-gray-500 sm:text-sm">
                  {whatsappStatus === 'active'
                    ? 'Verification code will be sent via WhatsApp'
                    : 'Using simulation mode - OTP will be shown in server terminal'
                  }
                </p>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm sm:text-base transition-all duration-300"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                            transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
                            shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35
                            rounded-xl border-0"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span className="text-sm sm:text-base">
                        {isRegister ? 'Processing...' : 'Sending OTP...'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm sm:text-base">
                      {isRegister ? 'Continue to Service Selection' : 'Send OTP'}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Terms */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center pt-4 border-t border-gray-200"
              >
                <p className="text-xs text-gray-500 sm:text-sm">
                  By continuing, you agree to our{' '}
                  <Link
                    href="/terms"
                    className="underline hover:text-blue-600 transition-colors duration-200 font-medium"
                  >
                    Terms of Service
                  </Link>
                </p>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-4 sm:mt-6"
        >
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium inline-flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Progress Indicator */}
        <AnimatePresence>
          {isRegister && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-center mt-4"
            >
              <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium">Step 1 of 2</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}