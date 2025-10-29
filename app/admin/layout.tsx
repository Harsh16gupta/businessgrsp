// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLogin from '@/components/admin/AdminLogin';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Services', href: '/admin/services', icon: '🛠️' },
  { name: 'Business Bookings', href: '/admin/bookings', icon: '📋' },
  { name: 'Business Users', href: '/admin/businesses', icon: '🏢' },
  { name: 'Wokers', href: '/admin/workers', icon: '👷‍♂️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
    checkMobile();
    
    const handleResize = () => {
      checkMobile();
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Close sidebar on route change on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        const response = await fetch('/api/admin/verify', {
          headers: {
            'Authorization': `Basic ${token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          setIsAuthenticated(true);
          setAdminUser(result.data);
        } else {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = (adminData: any, token: string) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
    setAdminUser(adminData);
    router.push('/admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAdminUser(null);
    router.push('/admin/login');
  };

  // Show loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 text-lg font-medium">Loading Admin Panel...</p>
        </motion.div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated && pathname !== '/admin/login') {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Redirect to dashboard if on login page but authenticated
  if (isAuthenticated && pathname === '/admin/login') {
    router.push('/admin');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 mt-20">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: sidebarOpen || !isMobile ? 0 : -320 
        }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center h-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">GRSP Admin</h1>
              <p className="text-blue-100 text-xs mt-1">Management Portal</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                  }`}
                >
                  <span className={`mr-3 text-lg transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                    />
                  )}
                </motion.a>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 border-t border-gray-200 bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {adminUser?.name?.charAt(0) || 'A'}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {adminUser?.name || 'Administrator'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">Super Admin</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border-b border-gray-200 z-30 sticky top-0"
        >
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="md:hidden p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-300"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>

              {/* Page Title */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {navigation.find((item) => item.href === pathname)?.name || 'Admin Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  {getPageDescription(pathname)}
                </p>
              </div>
            </div>
            
            {/* User Welcome */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-3"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back, {adminUser?.name}</p>
                <p className="text-xs text-gray-500">Last login: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {adminUser?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 sm:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// Helper function for page descriptions
function getPageDescription(pathname: string): string {
  const descriptions: { [key: string]: string } = {
    '/admin': 'Overview of platform statistics and performance',
    '/admin/services': 'Manage and configure service offerings',
    '/admin/bookings': 'View and manage business bookings',
    '/admin/businesses': 'Manage business user accounts and profiles',
  };
  
  return descriptions[pathname] || 'Administration panel';
}