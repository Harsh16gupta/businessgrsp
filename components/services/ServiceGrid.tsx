// ServiceGrid Component
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/lib/utils/constant';
import { ServiceCard } from './ServiceCard';

interface ServiceGridProps {
  services: Service[];
  onBookNow: (service: Service) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({ 
  services, 
  onBookNow 
}) => {
  if (services.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-24"
      >
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔍</span>
        </div>
        <h3 className="text-2xl font-light text-slate-900 mb-3">
          No services found
        </h3>
        <p className="text-slate-500 max-w-md mx-auto text-lg">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
    >
      <AnimatePresence>
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            onBookNow={onBookNow}
            index={index}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};