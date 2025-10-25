export const phoneRegex = /^[0-9]{10}$/
export const otpRegex = /^[0-9]{6}$/

export interface PhoneFormData {
  phone: string
  userType: 'USER' | 'WORKER'
  action: 'login' | 'register'
  name?: string
}

export interface OTPFormData {
  phone: string
  otp: string
  userType: 'USER' | 'WORKER'
  action: 'login' | 'register'
  name?: string
}

export function validatePhone(phone: string): string | null {
  if (!phone) return 'Phone number is required'
  if (!phoneRegex.test(phone)) return 'Phone number must be 10 digits'
  return null
}

export function validateOTP(otp: string): string | null {
  if (!otp) return 'OTP is required'
  if (!otpRegex.test(otp)) return 'OTP must be 6 digits'
  return null
}

export function validateName(name: string, action: string): string | null {
  if (action === 'register' && !name?.trim()) {
    return 'Name is required for registration'
  }
  return null
}