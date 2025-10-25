'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheck,
  FiClock,
  FiCheckCircle,
  FiTool,
  FiRefreshCw,
  FiX,
  FiBell,
  FiUser,
  FiCalendar,
  FiMapPin,
  FiDollarSign
} from 'react-icons/fi';
import NotificationsPanel from '@/components/bookings/NotificationsPanel';

interface Booking {
  id: string;
  service: {
    name: string;
    description: string;
    duration: string;
  };
  user: {
    name: string;
    phone: string;
  };
  date: string;
  address: string;
  status: string;
  totalAmount: number;
  specialNotes?: string;
}

interface NotificationData {
  pendingAssignments: Array<{
    id: string;
    status: string;
    createdAt: string;
    booking: {
      id: string;
      serviceType: string;
      location: string;
      duration: string;
      workersNeeded: number;
      acceptToken?: string;
      business: {
        companyName: string;
        name: string;
        phone: string;
      };
    };
  }>;
  availableBookings: Array<{
    id: string;
    serviceType: string;
    location: string;
    duration: string;
    workersNeeded: number;
    acceptToken?: string;
    business: {
      companyName: string;
      name: string;
    };
  }>;
  totalPending: number;
  totalAvailable: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

// Status configuration
const getStatusConfig = (status: string) => {
  const configs = {
    ACCEPTED: {
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      icon: FiCheck,
      label: 'Accepted'
    },
    PENDING: {
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
      icon: FiClock,
      label: 'Pending'
    },
    IN_PROGRESS: {
      color: 'bg-blue-500/10 text-blue-700 border-blue-200',
      icon: FiTool,
      label: 'In Progress'
    },
    COMPLETED: {
      color: 'bg-violet-500/10 text-violet-700 border-violet-200',
      icon: FiCheckCircle,
      label: 'Completed'
    },
    CANCELLED: {
      color: 'bg-gray-500/10 text-gray-700 border-gray-200',
      icon: FiX,
      label: 'Cancelled'
    },
    EXPIRED: {
      color: 'bg-gray-500/10 text-gray-700 border-gray-200',
      icon: FiClock,
      label: 'Expired'
    }
  };

  return configs[status as keyof typeof configs] || configs.PENDING;
};

export default function WorkerDashboard() {
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchWorkerData = useCallback(async (workerId: string) => {
    try {
      setRefreshing(true);

      const [bookingsResponse, notificationsResponse] = await Promise.all([
        fetch(`/api/bookings?workerId=${workerId}`),
        fetch(`/api/worker/notifications?workerId=${workerId}`)
      ]);

      const bookingsResult = await bookingsResponse.json();
      const notificationsResult = await notificationsResponse.json();

      if (bookingsResult.success) {
        setBookings(bookingsResult.data);
      } else {
        console.error('Failed to fetch bookings:', bookingsResult.error);
      }

      if (notificationsResult.success) {
        setNotifications(notificationsResult.data);
      } else {
        console.error('Failed to fetch notifications:', notificationsResult.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === 'WORKER') {
        setWorker(userData);
        fetchWorkerData(userData.id);
      } else {
        router.push('/business/dashboard');
      }
    } else {
      router.push('/login?returnUrl=/worker/dashboard');
    }
  }, [router, fetchWorkerData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && worker && !refreshing) {
        fetchWorkerData(worker.id);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'workerDataUpdated' && worker && !refreshing) {
        fetchWorkerData(worker.id);
        localStorage.removeItem('workerDataUpdated');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [worker, refreshing, fetchWorkerData]);

  const handleRefresh = () => {
    if (worker) {
      fetchWorkerData(worker.id);
    }
  };

  const handleAcceptBooking = async (token: string) => {
    try {
      const newWindow = window.open(`/worker/accept-booking?token=${token}`, '_blank');

      if (newWindow) {
        const checkWindowClosed = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(checkWindowClosed);
            setTimeout(() => {
              if (worker) {
                fetchWorkerData(worker.id);
                localStorage.setItem('workerDataUpdated', Date.now().toString());
              }
            }, 1000);
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
    }
  };

  // Stats calculation
  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length,
      color: 'bg-blue-500/10 text-blue-600',
      icon: FiCalendar
    },
    {
      label: 'Accepted',
      value: bookings.filter(b => b.status === 'ACCEPTED').length,
      color: 'bg-emerald-500/10 text-emerald-600',
      icon: FiCheck
    },
    {
      label: 'Pending',
      value: bookings.filter(b => b.status === 'PENDING').length,
      color: 'bg-amber-500/10 text-amber-600',
      icon: FiClock
    },
    {
      label: 'Completed',
      value: bookings.filter(b => b.status === 'COMPLETED').length,
      color: 'bg-violet-500/10 text-violet-600',
      icon: FiCheckCircle
    }
  ];

  const totalNotifications = (notifications?.totalPending || 0) + (notifications?.totalAvailable || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-16 sm:pt-20 px-4">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="w-16 h-16 border-2 border-blue-200 rounded-full" />
              <motion.div
                className="w-16 h-16 border-2 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-gray-600 font-medium text-lg"
            >
              Loading your dashboard...
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-3 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome, {worker?.name}!
              </h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-gray-600">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                  <FiUser className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    <strong className="font-semibold text-gray-700">Phone:</strong> {worker?.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                  <FiTool className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    <strong className="font-semibold text-gray-700">Services:</strong> {worker?.services?.join(', ') || 'No services selected'}
                  </span>
                </div>
                {worker?.rating && (
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                    <FiCheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      <strong className="font-semibold text-gray-700">Rating:</strong> {worker.rating} ⭐
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex items-center gap-2 bg-white text-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center relative"
              >
                <FiBell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Notifications</span>
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 bg-white text-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
              >
                <motion.div
                  animate={{ rotate: refreshing ? 360 : 0 }}
                  transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
                >
                  <FiRefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Notifications Panel */}
        <NotificationsPanel
          notifications={notifications}
          onAcceptBooking={handleAcceptBooking}
          onClose={() => setShowNotifications(false)}
          isOpen={showNotifications}
        />

        {/* Stats Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                    <p className={`text-lg sm:text-xl font-bold ${stat.color} mt-1`}>
                      {stat.value}
                    </p>
                  </div>
                  {IconComponent && (
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0 ml-2`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bookings Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Bookings</h2>
              <p className="text-gray-600 mt-1 text-sm">Manage and track your service appointments</p>
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              Last updated: {new Date().toLocaleTimeString('en-IN')}
            </div>
          </div>

          <AnimatePresence>
            {bookings.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center py-8 sm:py-12"
              >
                <div className="flex justify-center mb-4 opacity-50">
                  <FiTool className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm px-4">
                  You'll receive notifications when new bookings come in.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Check for New Bookings
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-3 sm:space-y-4"
              >
                {bookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={booking.id}
                      variants={itemVariants}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      whileHover={{ y: -2 }}
                      className="group border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 bg-white cursor-pointer"
                    >
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                        <div className="flex-1 space-y-4">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                                {booking.service.name}
                              </h3>
                              {booking.service.description && (
                                <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                                  {booking.service.description}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col sm:items-end gap-2">
                              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${statusConfig.color} w-fit`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                              {booking.totalAmount && (
                                <div className="flex items-center gap-1 text-green-600 font-semibold">
                                  <FiDollarSign className="w-4 h-4" />
                                  <span>₹{booking.totalAmount}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Client Details */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                Client Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-3 text-gray-700">
                                  <FiUser className="w-4 h-4 text-gray-400" />
                                  <span>{booking.user.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                  <span className="text-gray-500 font-medium">Phone:</span>
                                  <span className="font-mono">{booking.user.phone}</span>
                                </div>
                              </div>
                            </div>

                            {/* Service Details */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                Service Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-3 text-gray-700">
                                  <FiCalendar className="w-4 h-4 text-gray-400" />
                                  <span>{new Date(booking.date).toLocaleString('en-IN')}</span>
                                </div>
                                {booking.service.duration && (
                                  <div className="flex items-center gap-3 text-gray-700">
                                    <FiClock className="w-4 h-4 text-gray-400" />
                                    <span>{booking.service.duration}</span>
                                  </div>
                                )}
                                <div className="flex items-start gap-3 text-gray-700">
                                  <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <span className="leading-relaxed">{booking.address}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Special Notes */}
                      {booking.specialNotes && (
                        <div className="bg-amber-500/10 border border-amber-200 rounded-lg p-3 mt-4">
                          <h4 className="font-semibold text-amber-700 text-xs mb-1 flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            Special Notes from Client
                          </h4>
                          <p className="text-amber-600 text-xs leading-relaxed">{booking.specialNotes}</p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}