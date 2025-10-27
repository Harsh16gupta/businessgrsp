'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface BusinessFormData {
    phone: string
    name: string
    email: string
    companyName: string
    location: string
}

interface ValidationErrors {
    phone?: string
    name?: string
    email?: string
    companyName?: string
    location?: string
}

export default function BusinessAuthContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const urlAction = searchParams.get('action') as 'login' | 'register' | null
    const redirectFrom = searchParams.get('redirect')
    const prefillCompanyName = searchParams.get('companyName')
    const prefillContactPerson = searchParams.get('contactPerson')
    const prefillEmail = searchParams.get('email')
    const prefillPhone = searchParams.get('phone')
    const prefillLocation = searchParams.get('location')

    const [formData, setFormData] = useState<BusinessFormData>({
        phone: '',
        name: '',
        email: '',
        companyName: '',
        location: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
    const [isRegister, setIsRegister] = useState(urlAction === 'register')
    const [whatsappStatus, setWhatsappStatus] = useState<'checking' | 'active' | 'inactive'>('checking')
    const [showPrefillNotice, setShowPrefillNotice] = useState(false)

    // Pre-fill form data from query parameters (from requirement form)
    useEffect(() => {
        if (prefillPhone || prefillContactPerson || prefillEmail || prefillCompanyName || prefillLocation) {
            setFormData({
                phone: prefillPhone || '',
                name: prefillContactPerson || '',
                email: prefillEmail || '',
                companyName: prefillCompanyName || '',
                location: prefillLocation || ''
            })
            setShowPrefillNotice(true)
            
            // Show toast notification for pre-filled data
            toast.success('Form Pre-filled!', {
                description: 'Your requirement form details have been auto-filled.',
                duration: 4000,
            })
        }
    }, [prefillPhone, prefillContactPerson, prefillEmail, prefillCompanyName, prefillLocation])

    // Check WhatsApp status on component mount
    useEffect(() => {
        const checkWhatsAppStatus = async () => {
            try {
                const response = await fetch('/api/auth/send-otp')
                if (response.ok) {
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
                } else {
                    setWhatsappStatus('inactive')
                }
            } catch (error) {
                console.error('Failed to check WhatsApp status:', error)
                setWhatsappStatus('inactive')
                toast.error('Connection Error', {
                    description: 'Failed to check WhatsApp status',
                    duration: 3000,
                })
            }
        }

        checkWhatsAppStatus()
    }, [])

    // Update URL when isRegister changes
    useEffect(() => {
        const action = isRegister ? 'register' : 'login'
        const params = new URLSearchParams(window.location.search)
        params.set('action', action)
        const newUrl = `${window.location.pathname}?${params.toString()}`
        window.history.replaceState(null, '', newUrl)
    }, [isRegister])

    // Validate form data
    const validateForm = (): boolean => {
        const errors: ValidationErrors = {}

        // Phone validation
        const phoneRegex = /^[6-9]\d{9}$/
        if (!formData.phone) {
            errors.phone = 'Phone number is required'
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = 'Please enter a valid 10-digit Indian phone number'
        }

        if (isRegister) {
            // Name validation
            if (!formData.name || formData.name.trim().length < 2) {
                errors.name = 'Contact person name must be at least 2 characters'
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!formData.email) {
                errors.email = 'Email address is required'
            } else if (!emailRegex.test(formData.email)) {
                errors.email = 'Please enter a valid email address'
            }

            // Company name validation
            if (!formData.companyName || formData.companyName.trim().length < 2) {
                errors.companyName = 'Company name must be at least 2 characters'
            }

            // Location validation
            if (!formData.location || formData.location.trim().length < 2) {
                errors.location = 'Work location must be at least 2 characters'
            }
        }

        setValidationErrors(errors)
        
        // Show validation error toast if there are errors
        if (Object.keys(errors).length > 0) {
            toast.error('Validation Error', {
                description: 'Please check the form for errors',
                duration: 4000,
            })
        }
        
        return Object.keys(errors).length === 0
    }

    const handleInputChange = (field: keyof BusinessFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear validation error for this field when user starts typing
        if (validationErrors[field as keyof ValidationErrors]) {
            setValidationErrors(prev => ({ ...prev, [field]: undefined }))
        }

        // Clear general error when user makes changes
        if (error) {
            setError('')
        }
    }

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            await handleSendOTP()
        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
            setLoading(false)
            toast.error('Unexpected Error', {
                description: 'An unexpected error occurred. Please try again.',
                duration: 4000,
            })
        }
    }

    const handleSendOTP = async () => {
        setLoading(true)
        setError('')

        // Show loading toast
        const loadingToast = toast.loading('Sending OTP...')

        try {
            const requestBody: any = {
                phone: formData.phone,
                userType: 'BUSINESS',
                action: isRegister ? 'register' : 'login',
            }

            // Add business details only for registration
            if (isRegister) {
                requestBody.name = formData.name
                requestBody.email = formData.email
                requestBody.companyName = formData.companyName
                requestBody.location = formData.location

                console.log('🔧 Sending business registration data:', {
                    name: formData.name,
                    email: formData.email,
                    companyName: formData.companyName,
                    location: formData.location
                })
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
                // Show OTP toast in both development and production modes when in simulation
                if (data.simulated || data.debugOtp) {
                    toast.success('OTP Sent Successfully!', {
                        description: `Your OTP is ${data.debugOtp}. Use this to verify.`,
                        duration: 10000, // 10 seconds for OTP
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

                // Redirect to verification page with ALL data
                const params = new URLSearchParams({
                    phone: formData.phone,
                    userType: 'BUSINESS',
                    action: isRegister ? 'register' : 'login',
                })

                // Add business details only for registration
                if (isRegister) {
                    params.append('name', formData.name)
                    params.append('email', formData.email)
                    params.append('companyName', formData.companyName)
                    params.append('location', formData.location)

                    console.log('🔧 Redirecting with business data:', {
                        name: formData.name,
                        email: formData.email,
                        companyName: formData.companyName,
                        location: formData.location
                    })
                }

                // Preserve redirect parameter if exists
                if (redirectFrom) {
                    params.append('redirect', redirectFrom)
                }

                // Dismiss loading toast
                toast.dismiss(loadingToast)
                
                router.push(`/verify?${params.toString()}`)
            } else {
                setError(data.error || 'Failed to send OTP. Please try again.')
                toast.error('Failed to Send OTP', {
                    description: data.error || 'Please try again.',
                    duration: 5000,
                })
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.')
            toast.error('Network Error', {
                description: 'Please check your connection and try again.',
                duration: 5000,
            })
        } finally {
            setLoading(false)
            // Dismiss loading toast in case of error
            toast.dismiss(loadingToast)
        }
    }

    const getButtonText = () => {
        if (loading) {
            return isRegister ? 'Processing...' : 'Sending OTP...'
        }

        if (isRegister) {
            return `Create Business Account`
        }

        return `Send OTP via ${whatsappStatus === 'active' ? 'WhatsApp' : 'SMS'}`
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 md:p-8 pt-20">
            {/* Mobile-optimized container */}
            <div className="w-full max-w-md mx-auto">
                {/* Main Card */}
                <Card className="shadow-lg border border-gray-100 rounded-2xl bg-white transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl py-6 sm:py-8 px-4 sm:px-6">
                        <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                            {isRegister ? 'Business Account' : 'Welcome Back'}
                        </CardTitle>
                        <p className="text-blue-100 mt-2 text-sm sm:text-base">
                            {isRegister ? 'Create your business account to get started' : 'Access your business dashboard'}
                        </p>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6 space-y-6">
                        {/* Prefill Notice */}
                        {showPrefillNotice && (
                            <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl transition-all duration-200 hover:shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-blue-800 text-sm font-medium">
                                            Form details pre-filled
                                        </p>
                                        <p className="text-blue-600 text-xs mt-1">
                                            Your requirement form details have been auto-filled. Complete your business account setup.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* WhatsApp Status Indicator */}
                        <div className="flex items-center justify-center gap-3 text-sm p-3 sm:p-4 bg-blue-50 rounded-xl border border-blue-200 transition-colors">
                            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                whatsappStatus === 'active' ? 'bg-blue-500 animate-pulse' :
                                whatsappStatus === 'inactive' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}></div>
                            <span className="text-blue-700 font-medium text-sm">
                                {whatsappStatus === 'active' ? 'WhatsApp OTP Active' :
                                 whatsappStatus === 'inactive' ? 'Using SMS/Simulation Mode' : 'Checking status...'}
                            </span>
                        </div>

                        <form onSubmit={handleAuthSubmit} className="space-y-4 sm:space-y-5">
                            {/* Action Toggle - Mobile Optimized */}
                            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                                <Button
                                    type="button"
                                    variant={!isRegister ? 'default' : 'outline'}
                                    className={`flex-1 font-semibold transition-all duration-200 text-sm sm:text-base py-3 ${
                                        !isRegister
                                            ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                                            : 'bg-transparent text-gray-600 hover:text-blue-600 border-transparent'
                                    }`}
                                    onClick={() => {
                                        setIsRegister(false)
                                        setError('')
                                        setValidationErrors({})
                                    }}
                                    disabled={loading}
                                >
                                    Login
                                </Button>
                                <Button
                                    type="button"
                                    variant={isRegister ? 'default' : 'outline'}
                                    className={`flex-1 font-semibold transition-all duration-200 text-sm sm:text-base py-3 ${
                                        isRegister
                                            ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                                            : 'bg-transparent text-gray-600 hover:text-blue-600 border-transparent'
                                    }`}
                                    onClick={() => {
                                        setIsRegister(true)
                                        setError('')
                                        setValidationErrors({})
                                    }}
                                    disabled={loading}
                                >
                                    Register
                                </Button>
                            </div>

                            {/* Business Registration Fields */}
                            {isRegister && (
                                <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Enter your company name"
                                            value={formData.companyName}
                                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                                            disabled={loading}
                                            className={`h-12 text-base transition-all duration-200 ${
                                                validationErrors.companyName 
                                                    ? 'border-red-500 focus:border-red-500 ring-red-500' 
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            } rounded-lg`}
                                            required
                                        />
                                        {validationErrors.companyName && (
                                            <p className="text-red-500 text-xs mt-1 animate-in fade-in">{validationErrors.companyName}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Person Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Full name of contact person"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            disabled={loading}
                                            className={`h-12 text-base transition-all duration-200 ${
                                                validationErrors.name 
                                                    ? 'border-red-500 focus:border-red-500 ring-red-500' 
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            } rounded-lg`}
                                            required
                                        />
                                        {validationErrors.name && (
                                            <p className="text-red-500 text-xs mt-1 animate-in fade-in">{validationErrors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="your@company.com"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled={loading}
                                            className={`h-12 text-base transition-all duration-200 ${
                                                validationErrors.email 
                                                    ? 'border-red-500 focus:border-red-500 ring-red-500' 
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            } rounded-lg`}
                                            required
                                        />
                                        {validationErrors.email && (
                                            <p className="text-red-500 text-xs mt-1 animate-in fade-in">{validationErrors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Work Location <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Your work location"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            disabled={loading}
                                            className={`h-12 text-base transition-all duration-200 ${
                                                validationErrors.location 
                                                    ? 'border-red-500 focus:border-red-500 ring-red-500' 
                                                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            } rounded-lg`}
                                            required
                                        />
                                        {validationErrors.location && (
                                            <p className="text-red-500 text-xs mt-1 animate-in fade-in">{validationErrors.location}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="10-digit phone number"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                                    disabled={loading}
                                    maxLength={10}
                                    type="tel"
                                    className={`h-12 text-base transition-all duration-200 ${
                                        validationErrors.phone 
                                            ? 'border-red-500 focus:border-red-500 ring-red-500' 
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                    } rounded-lg`}
                                    required
                                />
                                {validationErrors.phone ? (
                                    <p className="text-red-500 text-xs mt-1 animate-in fade-in">{validationErrors.phone}</p>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {whatsappStatus === 'active'
                                            ? "We'll send a verification code via WhatsApp"
                                            : 'Using simulation mode - OTP will be shown in notification'
                                        }
                                    </p>
                                )}
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3 animate-in fade-in duration-300">
                                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors">
                                        <span className="text-white text-xs">!</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">Error</p>
                                        <p>{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg transition-all duration-200 rounded-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                disabled={loading}
                                size="lg"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span className="text-sm sm:text-base">{getButtonText()}</span>
                                    </div>
                                ) : (
                                    <span className="text-sm sm:text-base">{getButtonText()}</span>
                                )}
                            </Button>

                            {/* Terms and Privacy */}
                            <div className="text-center pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    By continuing, you agree to our{' '}
                                    <Link href="/terms" className="underline hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="underline hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Back to Home Link */}
                <div className="text-center mt-4 sm:mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-medium transition-all duration-200 cursor-pointer group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
                        Back to Home
                    </Link>
                </div>

                {/* Info Box for Business */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl transition-all duration-200 hover:shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors">
                            <span className="text-white text-xs">ℹ</span>
                        </div>
                        <div>
                            <p className="text-blue-800 text-sm font-medium">
                                For Business Owners
                            </p>
                            <p className="text-blue-600 text-xs mt-1 leading-relaxed">
                                Create your business account to post requirements, manage workers, and track your staffing needs efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}