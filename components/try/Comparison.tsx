'use client'

import { motion, Variants } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function Comparison() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const features = [
    { name: 'Personalized matching', grsp: true, others: false },
    { name: 'Background checks', grsp: true, others: false },
    { name: 'Searchable user profiles with work history', grsp: true, others: false },
    { name: 'Pro training', grsp: true, others: false },
    { name: 'Pre-shift announcements', grsp: true, others: false },
    { name: 'Geofencing & Pro-tracking', grsp: true, others: false },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const orbVariants: Variants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-white">
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
      
      {/* Subtle Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/10 rounded-full" />
      <div className="absolute bottom-40 right-16 w-6 h-6 bg-purple-500/10 rounded-full" />
      <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-sky-500/10 rounded-full" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </motion.div>
          <motion.h2 
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Why We're
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Different
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Every feature designed to give you the competitive edge
          </motion.p>
        </motion.div>

        {/* Unique Comparison Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Visual Comparison Bar */}
          <motion.div 
            className="flex items-center justify-between mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">GRSP</h3>
              <p className="text-blue-600 font-medium">Complete</p>
            </div>

            <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-gray-300 mx-8 rounded-full" />

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-400">Others</h3>
              <p className="text-gray-500 font-medium">Limited</p>
            </div>
          </motion.div>

          {/* Feature Grid - Unique Side-by-side */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* GRSP Features */}
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              <div className="text-center md:text-left mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Everything Included</h4>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto md:mx-0" />
              </div>
              
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  variants={itemVariants}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-blue-100"
                  whileHover={{ scale: 1.02, x: 8 }}
                >
                  <motion.div
                    variants={orbVariants}
                    className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-blue-200 group-hover:shadow-md transition-shadow"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                  <span className="text-gray-800 font-medium text-lg">{feature.name}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Other Platforms Features */}
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              <div className="text-center md:text-left mb-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">What's Missing</h4>
                <div className="w-20 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto md:mx-0" />
              </div>
              
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  variants={itemVariants}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200"
                  whileHover={{ scale: 1.02, x: -8 }}
                >
                  <motion.div
                    variants={orbVariants}
                    className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-300 group-hover:shadow-md transition-shadow"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      feature.others 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-br from-red-500 to-pink-600'
                    }`}>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {feature.others ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                    </div>
                  </motion.div>
                  <span className={`font-medium text-lg ${
                    feature.others ? 'text-gray-800' : 'text-gray-500 line-through'
                  }`}>
                    {feature.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Unique Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 grid grid-cols-3 gap-8 text-center"
          >
            <div className="p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                6/6
              </div>
              <div className="text-gray-600 font-medium">Features Complete</div>
            </div>
            <div className="p-6 border-x border-gray-200">
              <div className="text-3xl font-bold text-gray-400 mb-2">2/6</div>
              <div className="text-gray-600 font-medium">Average Competitors</div>
            </div>
            <div className="p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                3x
              </div>
              <div className="text-gray-600 font-medium">More Value</div>
            </div>
          </motion.div>

          {/* Minimal CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Experience the Difference
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}