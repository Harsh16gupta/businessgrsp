
// app/(auth)/verify/verifyContent.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const phone = searchParams.get('phone') || ''
  const userType = (searchParams.get('userType') as 'WORKER' | 'BUSINESS') || 'BUSINESS'
  const action = searchParams.get('action') || 'login'
  const name = searchParams.get('name') || ''
  const servicesParam = searchParams.get('services') || ''
  const companyName = searchParams.get('companyName') || ''
  const email = searchParams.get('email') || ''
  const location = searchParams.get('location') || ''
  const redirectFrom = searchParams.get('redirect') || ''

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [message, setMessage] = useState('')
  const [verificationMethod, setVerificationMethod] = useState<'whatsapp' | 'sms'>('whatsapp')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Redirect if no phone number
  useEffect(() => {
    if (!phone) {
      router.push('/login')
    }
  }, [phone, router])

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus()
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      focusInput(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusInput(index - 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('').slice(0, 6)
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])
      focusInput(Math.min(5, newOtp.length - 1))
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)
    setError('')
    setMessage('')

    try {
      const servicesArray = servicesParam ? servicesParam.split(',') : []

      const requestBody: any = {
        phone,
        userType,
        action,
        name: name || undefined,
        services: servicesArray,
      }

      // Add business fields for registration
      if (userType === 'BUSINESS' && action === 'register') {
        requestBody.companyName = companyName
        requestBody.email = email
        requestBody.location = location
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
        setMessage(`New OTP sent successfully to ${phone}!`)
        setCountdown(60)
        setOtp(['', '', '', '', '', ''])
        focusInput(0)

        if (data.message?.includes('WhatsApp')) {
          setVerificationMethod('whatsapp')
        } else {
          setVerificationMethod('sms')
        }
      } else {
        setError(data.error || 'Failed to resend OTP')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpString = otp.join('')

    // Validate OTP
    if (!/^\d{6}$/.test(otpString)) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const servicesArray = servicesParam ? servicesParam.split(',') : []

      console.log('🔧 Sending verification with business data:', {
        companyName, email, location
      })

      const requestBody: any = {
        phone,
        otp: otpString,
        userType,
        action,
        name: name || undefined,
        services: servicesArray,
      }

      // Add business fields for registration
      if (userType === 'BUSINESS' && action === 'register') {
        requestBody.companyName = companyName
        requestBody.email = email
        requestBody.location = location
      }

      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(`${action === 'login' ? 'Login' : 'Registration'} successful! Redirecting...`)

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data.user))

        // Redirect based on user role
        setTimeout(() => {
          if (data.user.role === 'WORKER') {
            router.push('/worker/dashboard')
          } else if (data.user.role === 'BUSINESS') {
            // Check if there's a pending requirement
            const pendingRequirement = sessionStorage.getItem('pendingBusinessRequirement')
            if (pendingRequirement) {
              // Redirect back to requirement form for auto-submission
              router.push('/requirement-form')
            } else {
              router.push('/business/dashboard')
            }
          }
          // Remove USER redirect entirely
        }, 1500)
      } else {
        setError(data.error || 'Invalid OTP. Please try again.')
        setOtp(['', '', '', '', '', ''])
        focusInput(0)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!phone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 safe-area-bottom pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white">
            <CardContent className="pt-8 pb-6 px-6 text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mb-4 text-sm sm:text-base"
              >
                Invalid verification request
              </motion.p>
              <Link 
                href="/login" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer font-medium text-sm sm:text-base"
              >
                ← Go back to login
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 py-6 safe-area-bottom">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md mx-auto"
      >
        <Card className="border border-gray-200 shadow-sm rounded-2xl bg-white">
          <CardHeader className="text-center space-y-4 pb-4 sm:pb-6 px-6 sm:px-8 pt-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                Verify OTP
              </CardTitle>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <p className="text-gray-600 text-xs sm:text-sm">
                Enter the 6-digit code sent via{' '}
                <span className="font-semibold text-gray-900">
                  {verificationMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                </span>{' '}
                to
              </p>
              <p className="font-semibold text-base sm:text-lg text-gray-900 bg-gray-50 py-2 px-3 sm:px-4 rounded-lg border border-gray-200">
                {phone}
              </p>
            </motion.div>

            {/* Show selected services for workers */}
            <AnimatePresence>
              {userType === 'WORKER' && action === 'register' && servicesParam && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <p className="text-xs sm:text-sm text-blue-800 font-medium">
                    Services: <span className="font-semibold">{servicesParam.split(',').join(', ')}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show business info for business registration */}
            <AnimatePresence>
              {userType === 'BUSINESS' && action === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1"
                >
                  <p className="text-xs sm:text-sm text-blue-800">
                    <span className="font-medium">Company:</span> <span className="font-semibold">{companyName}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-blue-800">
                    <span className="font-medium">Contact:</span> <span className="font-semibold">{name}</span>
                  </p>
                  {email && (
                    <p className="text-xs sm:text-sm text-blue-800">
                      <span className="font-medium">Email:</span> <span className="font-semibold">{email}</span>
                    </p>
                  )}
                  {location && (
                    <p className="text-xs sm:text-sm text-blue-800">
                      <span className="font-medium">Location:</span> <span className="font-semibold">{location}</span>
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardHeader>

          <CardContent className="space-y-6 px-6 sm:px-8 pb-8">
            <form onSubmit={handleVerify} className="space-y-6">
              {/* OTP Inputs */}
              <motion.div 
                className="flex justify-center gap-2 sm:gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {otp.map((digit, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex-1 max-w-[44px] sm:max-w-[52px]"
                  >
                    <Input
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-full h-11 sm:h-12 text-center text-lg font-semibold border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm rounded-xl cursor-pointer touch-manipulation"
                      disabled={loading}
                      autoFocus={index === 0}
                    />
                  </motion.div>
                ))}
              </motion.div>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-xs sm:text-sm"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs sm:text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  className="w-full py-3.5 text-sm sm:text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer touch-manipulation min-h-[48px]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Verifying...
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center space-y-4"
              >
                <Link
                  href="/login"
                  className="inline-flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer font-medium"
                >
                  ← Change Phone Number
                </Link>

                <div className="space-y-3 pt-2">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendOTP}
                    disabled={resendLoading || countdown > 0}
                    className="text-xs sm:text-sm rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 touch-manipulation min-h-[40px] px-4"
                  >
                    {resendLoading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full"
                        />
                        Sending...
                      </div>
                    ) : (
                      `Resend OTP ${countdown > 0 ? `(${countdown}s)` : ''}`
                    )}
                  </Button>
                </div>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="inline-flex items-center text-xs sm:text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer font-medium"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}