'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { apiCall } from '@/lib/utils'

interface PhoneFormData {
  phone: string
  userType: 'USER' | 'WORKER'
  action: 'login' | 'register'
  name?: string
}

interface PhoneFormProps {
  onSuccess: (data: PhoneFormData & { action: string }) => void
}

// Define validation functions locally
const phoneRegex = /^[0-9]{10}$/

export function validatePhone(phone: string): string | null {
  if (!phone) return 'Phone number is required'
  if (!phoneRegex.test(phone)) return 'Phone number must be 10 digits'
  return null
}

export function validateName(name: string, action: string): string | null {
  if (action === 'register' && !name?.trim()) {
    return 'Name is required for registration'
  }
  return null
}

export function PhoneForm({ onSuccess }: PhoneFormProps) {
  const [formData, setFormData] = useState<PhoneFormData>({
    phone: '',
    userType: 'USER',
    action: 'login',
    name: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<PhoneFormData>>({})

  const handleChange = (field: keyof PhoneFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<PhoneFormData> = {}

    const phoneError = validatePhone(formData.phone)
    if (phoneError) newErrors.phone = phoneError

    const nameError = validateName(formData.name || '', formData.action)
    if (nameError) newErrors.name = nameError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      const result = await apiCall('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      if (result.success) {
        // Use formData.action instead of result.action
        onSuccess({ ...formData, action: formData.action })
      } else {
        setErrors({ phone: result.error || 'Failed to send OTP' })
      }
    } catch (error) {
      setErrors({ phone: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {formData.action === 'login' ? 'Sign In' : 'Sign Up'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Action Toggle */}
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={formData.action === 'login' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => handleChange('action', 'login')}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={formData.action === 'register' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => handleChange('action', 'register')}
            >
              Register
            </Button>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={formData.userType === 'USER' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => handleChange('userType', 'USER')}
            >
              User
            </Button>
            <Button
              type="button"
              variant={formData.userType === 'WORKER' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => handleChange('userType', 'WORKER')}
            >
              Worker
            </Button>
          </div>

          {/* Name Field (only for register) */}
          {formData.action === 'register' && (
            <div className="space-y-2">
              <Input
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
          )}

          {/* Phone Field */}
          <div className="space-y-2">
            <Input
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={loading}
              maxLength={10}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service
          </p>
        </form>
      </CardContent>
    </Card>
  )
}