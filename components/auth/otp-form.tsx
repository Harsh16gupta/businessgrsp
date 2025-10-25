'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { validateOTP, type OTPFormData } from '@/lib/validations'
import { apiCall } from '@/lib/utils'

interface OTPFormProps {
  phone: string
  userType: 'USER' | 'WORKER'
  action: 'login' | 'register'
  name?: string
  onSuccess: (userData: any) => void
  onBack: () => void
  onResend: () => Promise<boolean>
}

export function OTPForm({ 
  phone, 
  userType, 
  action, 
  name, 
  onSuccess, 
  onBack,
  onResend 
}: OTPFormProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

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
    
    const success = await onResend()
    if (success) {
      setCountdown(30)
    }
    
    setResendLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpString = otp.join('')
    const otpError = validateOTP(otpString)
    
    if (otpError) {
      setError(otpError)
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          phone,
          otp: otpString,
          userType,
          action,
          name,
        }),
      })

      if (result.success) {
        onSuccess(result.user)
      } else {
        setError(result.error || 'Invalid OTP')
        // Clear OTP on error
        setOtp(['', '', '', '', '', ''])
        focusInput(0)
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
        <p className="text-center text-muted-foreground">
          Enter the 6-digit code sent to {phone}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-lg font-semibold"
                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="text-center space-y-2">
            <Button
              type="button"
              variant="link"
              onClick={onBack}
              disabled={loading}
            >
              Change Phone Number
            </Button>

            <div>
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={resendLoading || countdown > 0}
                className="text-sm"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
                {countdown > 0 && ` (${countdown}s)`}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}