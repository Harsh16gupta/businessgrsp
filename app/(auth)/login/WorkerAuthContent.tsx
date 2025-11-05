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
        toast.dismiss(loadingToast)
        if (data.debugOtp) {
          toast.success('OTP Sent Successfully!', {
            description: `Your OTP is ${data.debugOtp}. Use this to verify.`,
            duration: 15000,
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
      <div className="flex items-center justify-center p-3  
                     text-gray-900 sm:p-4 ">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-4xl mx-auto"
        >
          <div className="text-center ">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-light text-gray-900 mb-1 tracking-tight"
            >
              Choose Your <span className="font-medium">Service</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
            >
              Select the service you specialize in to match with relevant opportunities
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
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
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center  
                   text-gray-900 p-3 sm:p-4 lg:p-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md mx-auto"
      >
        {/* Main Card */}
        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center py-8 px-6 bg-gradient-to-b from-white to-gray-50/80 border-b border-gray-100">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <CardTitle className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 mb-2">
                {isRegister ? 'Join Our Team' : 'Welcome Back'}
              </CardTitle>
              <p className="text-gray-600 text-base font-light">
                {isRegister ? 'Start your professional journey' : 'Access your worker account'}
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8">
            {/* WhatsApp Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 text-sm mb-6 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50 backdrop-blur-sm"
            >
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                whatsappStatus === 'active' ? 'bg-green-500 animate-pulse' :
                whatsappStatus === 'inactive' ? 'bg-amber-500' : 
                'bg-gray-400 animate-pulse'
              }`} />
              <span className="text-blue-800/80 font-medium text-xs">
                {whatsappStatus === 'active' ? 'WhatsApp OTP Active' :
                 whatsappStatus === 'inactive' ? 'Using Simulation Mode' : 
                 'Checking status...'}
              </span>
            </motion.div>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
              {/* Toggle Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-1 p-1 bg-gray-100/50 rounded-2xl border border-gray-200/50 backdrop-blur-sm"
              >
                <Button
                  type="button"
                  variant={!isRegister ? 'default' : 'ghost'}
                  className={`flex-1 text-sm font-medium transition-all duration-300 rounded-xl ${
                    !isRegister
                      ? 'bg-white shadow-sm text-gray-900 border border-gray-200/50 hover:bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-transparent'
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
                  variant={isRegister ? 'default' : 'ghost'}
                  className={`flex-1 text-sm font-medium transition-all duration-300 rounded-xl ${
                    isRegister
                      ? 'bg-white shadow-sm text-gray-900 border border-gray-200/50 hover:bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-transparent'
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
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={loading}
                      className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm"
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
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                  disabled={loading}
                  maxLength={10}
                  type="tel"
                  className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all duration-300 rounded-xl bg-white/50 backdrop-blur-sm"
                  required
                />
                <p className="text-xs text-gray-500 font-light">
                  {whatsappStatus === 'active'
                    ? 'Verification code will be sent via WhatsApp'
                    : 'Using simulation mode - OTP will be shown in notification'
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
                    className="bg-red-50/80 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm backdrop-blur-sm transition-all duration-300"
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
                  className="w-full h-12 text-base font-medium bg-gray-900 hover:bg-gray-800 active:bg-gray-950 
                            transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
                            shadow-lg hover:shadow-xl rounded-xl border-0 text-white"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span className="text-sm">
                        {isRegister ? 'Processing...' : 'Sending OTP...'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm">
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
                className="text-center pt-4 border-t border-gray-200/50"
              >
                <p className="text-xs text-gray-500 font-light">
                  By continuing, you agree to our{' '}
                  <Link
                    href="/terms"
                    className="underline hover:text-gray-700 transition-colors duration-200 font-medium"
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
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 font-light inline-flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
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
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <span className="text-xs font-light">Step 1 of 2</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}