'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { getPopularServices } from '@/lib/utils/constant'
import Image from 'next/image'

export default function MostPopularServices() {
  const ref = useRef(null)
  
  // Get 8 most popular services for slightly larger layout
  const popularServices = getPopularServices(8)

  return (
    <section ref={ref} className="relative py-20">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/50">
        {/* Subtle Gradient Orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/2 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Minimal Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Most Popular Services
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Trusted by thousands of customers
          </p>
        </div>

        {/* Slightly Larger Cards Grid - 2x4 layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {popularServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -6,
                transition: { duration: 0.3 }
              }}
              className="group"
            >
              {/* Slightly Larger Professional Service Card */}
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                
                {/* Service Image */}
                <div className="relative w-full aspect-square mb-5 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  
                  {/* Popularity Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {service.popularity}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Service Content */}
                <div className="flex-1 flex flex-col">
                  {/* Service Name */}
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight mb-3 line-clamp-2">
                    {service.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        ₹{service.basePrice}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                        ₹{Math.round(service.basePrice * 1.2)}
                      </span>
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                      Save 20%
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <button className="inline-flex items-center gap-3 px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
            View All Services
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}