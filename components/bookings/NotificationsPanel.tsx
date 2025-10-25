'use client';

import { FiBell, FiTool, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
      acceptToken?: string; // Added acceptToken
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
    acceptToken?: string; // Added acceptToken
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
  onAcceptBooking: (token: string) => void; // Changed to accept token
  onClose: () => void;
  isOpen: boolean;
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

export default function NotificationsPanel({ 
  notifications, 
  onAcceptBooking, 
  onClose,
  isOpen 
}: NotificationsPanelProps) {
  if (!isOpen || !notifications) {
    return null;
  }

  const totalNotifications = (notifications.totalPending || 0) + (notifications.totalAvailable || 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-700/60 p-6 mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          {/* Pending Assignments */}
          {notifications.pendingAssignments && notifications.pendingAssignments.length > 0 && (
            <motion.div variants={itemVariants} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-3 flex items-center gap-2">
                <FiBell className="w-5 h-5" />
                Pending Invitations ({notifications.totalPending})
              </h3>
              <div className="space-y-3">
                {notifications.pendingAssignments.map((assignment) => (
                  <motion.div 
                    key={assignment.id} 
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-yellow-100 dark:border-yellow-900"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {assignment.booking.serviceType}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {assignment.booking.business.companyName} • {assignment.booking.location}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {assignment.booking.duration} • {assignment.booking.workersNeeded} workers needed
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Contact: {assignment.booking.business.name} ({assignment.booking.business.phone})
                        </p>
                      </div>
                      <button
                        onClick={() => onAcceptBooking(assignment.booking.acceptToken || assignment.booking.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors ml-4 whitespace-nowrap"
                      >
                        Respond
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Available Bookings */}
          {notifications.availableBookings && notifications.availableBookings.length > 0 && (
            <motion.div variants={itemVariants} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-2">
                <FiTool className="w-5 h-5" />
                Available Bookings ({notifications.totalAvailable})
              </h3>
              <div className="space-y-3">
                {notifications.availableBookings.map((booking) => (
                  <motion.div 
                    key={booking.id} 
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-100 dark:border-blue-900"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{booking.serviceType}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {booking.business.companyName} • {booking.location}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.duration} • {booking.workersNeeded} workers needed
                        </p>
                      </div>
                      <button
                        onClick={() => onAcceptBooking(booking.acceptToken || booking.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors ml-4 whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* No Notifications */}
          {(!notifications || (notifications.pendingAssignments.length === 0 && notifications.availableBookings.length === 0)) && (
            <motion.div variants={itemVariants} className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FiBell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No new notifications</p>
              <p className="text-sm">You'll see booking invitations here when they're available</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}