'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  phone: string
  name: string
  role: 'USER' | 'WORKER' | 'ADMIN'
  isVerified: boolean
}

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Link href={user.role === 'WORKER' ? '/worker/dashboard' : '/business/dashboard'}>
            Dashboard
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Hello, {user.name || user.phone}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-sm"
          >
            Logout
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm">
        <Link href="/login?action=login">Sign In</Link>
      </Button>
      <Button size="sm">
        <Link href="/login?action=register">Sign Up</Link>
      </Button>
    </div>
  )
}