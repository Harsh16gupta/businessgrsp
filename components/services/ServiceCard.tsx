import React from 'react';
import { motion } from 'framer-motion';
import { Service } from '@/lib/utils/constant';
import { IconStar, IconClock } from '@tabler/icons-react';

interface ServiceCardProps {
  service: Service;
  onBookNow: (service: Service) => void;
  index: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onBookNow, 
  index 
}) => {
  const totalPrice = service.basePrice + service.serviceCharge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {service.featured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
          <IconStar className="w-3 h-3 inline mr-1" />
          {service.popularity}%
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {service.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Duration */}
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4">
          <IconClock className="w-4 h-4" />
          <span>{service.duration}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {service.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{totalPrice}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              incl. service charge
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBookNow(service)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};