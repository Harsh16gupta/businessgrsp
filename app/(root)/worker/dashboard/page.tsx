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
  FiDollarSign,
  FiCreditCard,
  FiEdit3,
  FiSave
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
  workerEarnings?: number;
  specialNotes?: string;
  paymentStatus?: 'PENDING' | 'PROCESSING' | 'PAID';
  // ADD THESE FIELDS FOR ADMIN PRICES
  amountPerWorker?: number;
  numberOfDays?: number;
  paymentAmount?: number;
  workersNeeded?: number;
}

interface PaymentDetails {
  upiId: string;
  phoneNumber: string;
  bankAccount?: string;
  ifscCode?: string;
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
      paymentAmount?: number;
      numberOfDays?: number;
      amountPerWorker?: number; // Add this
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
    paymentAmount?: number;
    numberOfDays?: number;
    amountPerWorker?: number; // Add this
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

const getPaymentStatusConfig = (status: string) => {
  const configs = {
    PENDING: {
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
      label: 'Payment Pending'
    },
    PROCESSING: {
      color: 'bg-blue-500/10 text-blue-700 border-blue-200',
      label: 'Processing Payment'
    },
    PAID: {
      color: 'bg-green-500/10 text-green-700 border-green-200',
      label: 'Payment Completed'
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
  const [editingPayment, setEditingPayment] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    upiId: '',
    phoneNumber: '',
    bankAccount: '',
    ifscCode: ''
  });
  const [savingPayment, setSavingPayment] = useState(false);
  
  const [acceptedBookings, setAcceptedBookings] = useState<Set<string>>(new Set());

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
        console.log('📊 Bookings data:', bookingsResult.data); // Debug log
        setBookings(bookingsResult.data);
      } else {
        console.error('Failed to fetch bookings:', bookingsResult.error);
      }

      if (notificationsResult.success) {
        setNotifications(notificationsResult.data);
      } else {
        console.error('Failed to fetch notifications:', notificationsResult.error);
      }

      // Fetch payment details with proper error handling
      try {
        const paymentResponse = await fetch(`/api/worker/payment-details?workerId=${workerId}`);
        if (paymentResponse.ok) {
          const paymentResult = await paymentResponse.json();
          if (paymentResult.success) {
            setPaymentDetails(paymentResult.data);
          }
        } else {
          console.warn('Payment details endpoint not available yet');
          setPaymentDetails({
            upiId: '',
            phoneNumber: '',
            bankAccount: '',
            ifscCode: ''
          });
        }
      } catch (paymentError) {
        console.warn('Payment details fetch failed:', paymentError);
        setPaymentDetails({
          upiId: '',
          phoneNumber: '',
          bankAccount: '',
          ifscCode: ''
        });
      }
    } catch (error) {
      console.error('Error fetching worker data:', error);
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

  const handleAcceptBooking = async (token: string, bookingData?: any) => {
    try {
      if (bookingData?.id) {
        setAcceptedBookings(prev => new Set(prev.add(bookingData.id)));
      }

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

  const handleSavePaymentDetails = async () => {
    if (!worker) return;

    setSavingPayment(true);
    try {
      const response = await fetch('/api/worker/payment-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workerId: worker.id,
          ...paymentDetails
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEditingPayment(false);
      } else {
        console.error('Failed to save payment details:', result.error);
      }
    } catch (error) {
      console.error('Error saving payment details:', error);
    } finally {
      setSavingPayment(false);
    }
  };

  // FIXED: Correct earnings calculation
const calculateEarnings = (booking: any) => {
  console.log('💰 Calculating earnings for booking:', {
    id: booking.id,
    amountPerWorker: booking.amountPerWorker,
    numberOfDays: booking.numberOfDays,
    paymentAmount: booking.paymentAmount,
    workersNeeded: booking.workersNeeded,
    totalAmount: booking.totalAmount
  });

  // Priority 1: Use admin-entered amountPerWorker (this is TOTAL per worker for the entire job)
  if (booking.amountPerWorker && booking.numberOfDays) {
    const total = booking.amountPerWorker;
    const daily = booking.amountPerWorker / booking.numberOfDays;
    console.log('✅ Using admin price:', { daily, total, days: booking.numberOfDays });
    return {
      daily: Math.round(daily),
      total: Math.round(total),
      days: booking.numberOfDays,
      isAdminPrice: true,
      source: 'admin'
    };
  }
  
  // Priority 2: Use workerEarnings if specified (this is TOTAL for the worker)
  if (booking.workerEarnings) {
    console.log('✅ Using worker earnings:', booking.workerEarnings);
    return {
      daily: booking.workerEarnings,
      total: booking.workerEarnings,
      days: 1,
      isAdminPrice: false,
      source: 'worker'
    };
  }
  
  // Priority 3: Calculate from total payment amount divided by workers
  if (booking.paymentAmount && booking.workersNeeded) {
    const perWorkerTotal = booking.paymentAmount / booking.workersNeeded;
    const days = booking.numberOfDays || 1;
    const perWorkerPerDay = perWorkerTotal / days;
    console.log('✅ Calculated from total:', { 
      perWorkerTotal, 
      perWorkerPerDay, 
      days 
    });
    return {
      daily: Math.round(perWorkerPerDay),
      total: Math.round(perWorkerTotal),
      days: days,
      isAdminPrice: false,
      source: 'calculated'
    };
  }
  
  // Fallback: Use totalAmount (assuming this is for one worker)
  console.log('⚠️ Using fallback amount:', booking.totalAmount);
  return {
    daily: booking.totalAmount || 0,
    total: booking.totalAmount || 0,
    days: 1,
    isAdminPrice: false,
    source: 'fallback'
  };
};

  const totalEarnings = bookings
    .filter(booking => booking.status === 'COMPLETED' && booking.paymentStatus === 'PAID')
    .reduce((sum, booking) => sum + calculateEarnings(booking).total, 0);

  const pendingEarnings = bookings
    .filter(booking => booking.status === 'COMPLETED' && booking.paymentStatus !== 'PAID')
    .reduce((sum, booking) => sum + calculateEarnings(booking).total, 0);

  // Stats calculation
  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length,
      color: 'bg-blue-500/10 text-blue-600',
      icon: FiCalendar
    },
    {
      label: 'Total Earnings',
      value: `₹${totalEarnings.toLocaleString()}`,
      color: 'bg-green-500/10 text-green-600',
      icon: FiDollarSign
    },
    {
      label: 'Pending Payment',
      value: `₹${pendingEarnings.toLocaleString()}`,
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
                onClick={() => fetchWorkerData(worker.id)}
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

        {/* Payment Details Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                <FiCreditCard className="text-blue-600" />
                Payment Details
              </h2>
              <p className="text-gray-600 mt-1 text-sm">Add your payment information to receive earnings</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => editingPayment ? handleSavePaymentDetails() : setEditingPayment(true)}
              disabled={savingPayment}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
            >
              {editingPayment ? (
                <>
                  <FiSave className="w-4 h-4" />
                  {savingPayment ? 'Saving...' : 'Save Details'}
                </>
              ) : (
                <>
                  <FiEdit3 className="w-4 h-4" />
                  Edit Payment
                </>
              )}
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              {editingPayment ? (
                <input
                  type="text"
                  value={paymentDetails.upiId}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, upiId: e.target.value }))}
                  placeholder="yourname@upi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  {paymentDetails.upiId || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {editingPayment ? (
                <input
                  type="tel"
                  value={paymentDetails.phoneNumber}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  {paymentDetails.phoneNumber || 'Not set'}
                </div>
              )}
            </div>
          </div>

          {!paymentDetails.upiId && !paymentDetails.phoneNumber && !editingPayment && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                ⚠️ Please add your payment details to receive earnings for completed work.
              </p>
            </div>
          )}
        </motion.div>

        {/* Notifications Panel */}
        <NotificationsPanel
          notifications={notifications}
          onAcceptBooking={handleAcceptBooking}
          onClose={() => setShowNotifications(false)}
          isOpen={showNotifications}
          acceptedBookings={acceptedBookings}
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
                  onClick={() => fetchWorkerData(worker.id)}
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
                  const earnings = calculateEarnings(booking);
                  const paymentStatusConfig = getPaymentStatusConfig(booking.paymentStatus || 'PENDING');

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
                              
                              {/* Enhanced Earnings Display */}
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-green-600 font-semibold text-lg">
                                  <FiDollarSign className="w-4 h-4" />
                                  <span>₹{Math.round(earnings.total).toLocaleString()}</span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>₹{Math.round(earnings.daily).toLocaleString()}/day</div>
                                  <div>{earnings.days} day{earnings.days !== 1 ? 's' : ''} total</div>
                                </div>
                                {earnings.isAdminPrice && (
                                  <div className="text-xs text-blue-600 font-medium mt-1 bg-blue-50 px-2 py-1 rounded">
                                    ✓ Fixed rate
                                  </div>
                                )}
                              </div>
                              
                              {booking.status === 'COMPLETED' && (
                                <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium border ${paymentStatusConfig.color}`}>
                                  {paymentStatusConfig.label}
                                </span>
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

                      {/* Enhanced Earnings Information Section */}
                      {(booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED') && (
                        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mt-4">
                          <h4 className="font-semibold text-blue-800 text-sm mb-3 flex items-center gap-2">
                            <FiDollarSign className="w-4 h-4" />
                            Earnings Breakdown
                            {earnings.isAdminPrice && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded ml-2">
                                Admin Fixed Rate
                              </span>
                            )}
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                              <p className="text-2xl font-bold text-green-600">₹{Math.round(earnings.daily).toLocaleString()}</p>
                              <p className="text-blue-700 text-sm font-medium">Per Day</p>
                              <p className="text-gray-500 text-xs mt-1">Daily rate</p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                              <p className="text-xl font-bold text-blue-600">{earnings.days}</p>
                              <p className="text-blue-700 text-sm font-medium">Days</p>
                              <p className="text-gray-500 text-xs mt-1">Work duration</p>
                            </div>
                            
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <p className="text-2xl font-bold text-green-600">₹{Math.round(earnings.total).toLocaleString()}</p>
                              <p className="text-green-700 text-sm font-medium">Total Pay</p>
                              <p className="text-gray-600 text-xs mt-1">
                                {earnings.days} × ₹{Math.round(earnings.daily).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-center">
                            <p className="text-blue-700 text-sm font-medium">
                              {booking.status === 'COMPLETED' ? (
                                paymentStatusConfig.label === 'Payment Completed' ? (
                                  <span className="text-green-600">✅ Paid: ₹{Math.round(earnings.total).toLocaleString()}</span>
                                ) : (
                                  <span className="text-amber-600">⏳ {paymentStatusConfig.label}: ₹{Math.round(earnings.total).toLocaleString()}</span>
                                )
                              ) : (
                                <span>You will earn <strong>₹{Math.round(earnings.total).toLocaleString()}</strong> for {earnings.days} day{earnings.days !== 1 ? 's' : ''} of work</span>
                              )}
                            </p>
                            
                            {!paymentDetails.upiId && !paymentDetails.phoneNumber && booking.status !== 'COMPLETED' && (
                              <p className="text-amber-600 text-xs mt-2 font-medium">
                                ⚠️ Add payment details to receive your earnings
                              </p>
                            )}
                          </div>
                        </div>
                      )}

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