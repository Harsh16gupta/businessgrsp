'use client';

import { FiBell, FiTool, FiX, FiDollarSign, FiClock, FiUser, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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
      paymentAmount?: number;
      numberOfDays?: number;
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
    paymentAmount?: number;
    numberOfDays?: number;
    business: {
      companyName: string;
      name: string;
    };
  }>;
  totalPending: number;
  totalAvailable: number;
}

interface NotificationsPanelProps {
  notifications: NotificationData | null;
  onAcceptBooking: (token: string, bookingData?: any) => void;
  onClose: () => void;
  isOpen: boolean;
  acceptedBookings?: Set<string>; // Make sure this line exists
}

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

// Format currency for Indian Rupees
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate earnings for one worker - FIXED CALCULATION
const calculateWorkerEarnings = (booking: any) => {
  if (!booking.paymentAmount || !booking.numberOfDays || !booking.workersNeeded) return null;
  
  // Calculate per worker per day
  const perWorkerPerDay = booking.paymentAmount / booking.workersNeeded / booking.numberOfDays;
  const totalForOneWorker = perWorkerPerDay * booking.numberOfDays;
  
  return {
    daily: Math.round(perWorkerPerDay),
    total: Math.round(totalForOneWorker),
    days: booking.numberOfDays
  };
};

export default function NotificationsPanel({ 
  notifications, 
  onAcceptBooking, 
  onClose,
  isOpen,
  acceptedBookings = new Set() // ADD THIS - receive from parent
}: NotificationsPanelProps) {
  // REMOVE THIS LOCAL STATE - we're using the prop now
  // const [acceptedBookings, setAcceptedBookings] = useState<Set<string>>(new Set());

  if (!isOpen || !notifications) {
    return null;
  }

  const totalNotifications = (notifications.totalPending || 0) + (notifications.totalAvailable || 0);

  // UPDATE THIS FUNCTION - Remove local state management
  const handleAcceptBooking = (token: string, bookingData: any) => {
    // Just call the parent handler - state is managed in parent
    onAcceptBooking(token, bookingData);
  };

  const isBookingAccepted = (bookingId: string) => {
    return acceptedBookings.has(bookingId);
  };

  // ... rest of your component code


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiBell className="w-6 h-6 text-blue-600" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalNotifications}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Booking Opportunities</h2>
                <p className="text-gray-600 text-sm">Accept new work and earn money</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6"
            >
              {/* Pending Assignments */}
              {notifications.pendingAssignments && notifications.pendingAssignments.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pending Invitations ({notifications.totalPending})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {notifications.pendingAssignments.map((assignment) => {
                      const workerEarnings = calculateWorkerEarnings(assignment.booking);
                      const isAccepted = isBookingAccepted(assignment.booking.id);
                      
                      return (
                        <motion.div 
                          key={assignment.id} 
                          variants={itemVariants}
                          className={`border rounded-xl p-4 transition-all duration-300 ${
                            isAccepted 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-yellow-50 border-yellow-200 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 space-y-3">
                              {/* Service Header */}
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    {assignment.booking.serviceType}
                                    {isAccepted && (
                                      <span className="ml-2 text-green-600 text-sm font-normal">
                                        ✓ Accepted
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-gray-600 text-sm">
                                    {assignment.booking.business.companyName} • {assignment.booking.location}
                                  </p>
                                </div>
                                {workerEarnings && (
                                  <div className="text-right">
                                    <p className="text-green-600 font-bold text-lg">
                                      {formatCurrency(workerEarnings.total)}
                                    </p>
                                    <p className="text-green-500 text-xs">
                                      Your total earnings
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Earnings Breakdown */}
                              {workerEarnings && (
                                <div className="bg-white rounded-lg p-3 border border-yellow-100">
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="text-center">
                                      <p className="text-gray-900 font-semibold">
                                        {formatCurrency(workerEarnings.daily)}
                                      </p>
                                      <p className="text-gray-500 text-xs">Per Day</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-gray-900 font-semibold">
                                        {workerEarnings.days} days
                                      </p>
                                      <p className="text-gray-500 text-xs">Duration</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-gray-900 font-semibold">
                                        {formatCurrency(workerEarnings.total)}
                                      </p>
                                      <p className="text-gray-500 text-xs">Total Pay</p>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-center">
                                    <p className="text-gray-600 text-xs">
                                      {assignment.booking.workersNeeded} workers × {workerEarnings.days} days × {formatCurrency(workerEarnings.daily)}/day
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Booking Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <FiClock className="w-4 h-4 text-gray-400" />
                                    <span>{assignment.booking.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <FiUser className="w-4 h-4 text-gray-400" />
                                    <span>{assignment.booking.workersNeeded} workers needed</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <FiMapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{assignment.booking.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                      Contact: {assignment.booking.business.phone}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex flex-col justify-between gap-3">
                              {isAccepted ? (
                                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-xl font-semibold min-w-[120px] justify-center">
                                  <FiCheckCircle className="w-5 h-5" />
                                  <span>Accepted</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAcceptBooking(
                                    assignment.booking.acceptToken || assignment.booking.id,
                                    assignment.booking
                                  )}
                                  className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap min-w-[120px]"
                                >
                                  {workerEarnings ? (
                                    <div className="text-center">
                                      <div className="text-sm">Accept & Earn</div>
                                      <div className="text-xs opacity-90">{formatCurrency(workerEarnings.total)}</div>
                                    </div>
                                  ) : (
                                    'Respond'
                                  )}
                                </button>
                              )}
                              <p className="text-gray-500 text-xs text-center">
                                {isAccepted ? '✅ Booking accepted' : '⚡ Quick response needed'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Available Bookings */}
              {notifications.availableBookings && notifications.availableBookings.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Available Bookings ({notifications.totalAvailable})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {notifications.availableBookings.map((booking) => {
                      const workerEarnings = calculateWorkerEarnings(booking);
                      const isAccepted = isBookingAccepted(booking.id);
                      
                      return (
                        <motion.div 
                          key={booking.id} 
                          variants={itemVariants}
                          className={`border rounded-xl p-4 transition-all duration-300 ${
                            isAccepted 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-blue-50 border-blue-200 hover:shadow-md'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 space-y-3">
                              {/* Service Header */}
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    {booking.serviceType}
                                    {isAccepted && (
                                      <span className="ml-2 text-green-600 text-sm font-normal">
                                        ✓ Applied
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-gray-600 text-sm">
                                    {booking.business.companyName} • {booking.location}
                                  </p>
                                </div>
                                {workerEarnings && (
                                  <div className="text-right">
                                    <p className="text-green-600 font-bold text-lg">
                                      {formatCurrency(workerEarnings.total)}
                                    </p>
                                    <p className="text-green-500 text-xs">
                                      Your potential earnings
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Earnings Information */}
                              {workerEarnings ? (
                                <div className="bg-white rounded-lg p-3 border border-blue-100">
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="text-center">
                                      <p className="text-gray-900 font-semibold">
                                        {formatCurrency(workerEarnings.daily)}
                                      </p>
                                      <p className="text-gray-500 text-xs">Daily Rate</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-gray-900 font-semibold">
                                        {workerEarnings.days} days
                                      </p>
                                      <p className="text-gray-500 text-xs">Project Length</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-gray-900 font-semibold">
                                        {formatCurrency(workerEarnings.total)}
                                      </p>
                                      <p className="text-gray-500 text-xs">Total Pay</p>
                                    </div>
                                  </div>
                                  <div className="mt-2 text-center">
                                    <p className="text-gray-600 text-xs">
                                      Calculation: {workerEarnings.days} days × {formatCurrency(workerEarnings.daily)}/day
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-white rounded-lg p-3 border border-blue-100">
                                  <p className="text-gray-600 text-sm text-center">
                                    💰 Payment details will be confirmed after acceptance
                                  </p>
                                </div>
                              )}

                              {/* Booking Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <FiClock className="w-4 h-4 text-gray-400" />
                                    <span>{booking.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <FiUser className="w-4 h-4 text-gray-400" />
                                    <span>{booking.workersNeeded} spots available</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <FiMapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{booking.location}</span>
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    Professional client • Secure payment
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex flex-col justify-between gap-3">
                              {isAccepted ? (
                                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-xl font-semibold min-w-[120px] justify-center">
                                  <FiCheckCircle className="w-5 h-5" />
                                  <span>Applied</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAcceptBooking(
                                    booking.acceptToken || booking.id,
                                    booking
                                  )}
                                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap min-w-[120px]"
                                >
                                  {workerEarnings ? (
                                    <div className="text-center">
                                      <div className="text-sm">Apply Now</div>
                                      <div className="text-xs opacity-90">Earn {formatCurrency(workerEarnings.total)}</div>
                                    </div>
                                  ) : (
                                    'Apply Now'
                                  )}
                                </button>
                              )}
                              <p className="text-gray-500 text-xs text-center">
                                {isAccepted ? '✅ Application sent' : '🎯 Limited spots available'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* No Notifications */}
              {(!notifications || (notifications.pendingAssignments.length === 0 && notifications.availableBookings.length === 0)) && (
                <motion.div variants={itemVariants} className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiBell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No new opportunities</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    New booking invitations will appear here when they become available. Check back soon!
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Direct Invitations</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Available Jobs</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Accepted</span>
                </div>
              </div>
              <div className="text-gray-500 text-xs">
                Earnings shown are for one worker only
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}