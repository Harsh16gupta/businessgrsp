'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Floating gradient lines
  const floatingLines = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 4 + i * 0.5,
  }))

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 pt-25 ">
      {/* Floating Gradient Lines */}
      <div className="absolute inset-0">
        {floatingLines.map((line) => (
          <motion.div
            key={line.id}
            className="absolute h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent dark:via-blue-400/20"
            animate={{
              x: [0, '100vw', 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: line.duration,
              delay: line.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              top: `${20 + line.id * 10}%`,
              width: '100vw',
            }}
          />
        ))}
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl dark:bg-blue-400/10" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-slate-200/20 rounded-full blur-3xl dark:bg-slate-400/10" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Headline */}
          
          <motion.h1
            className="text-3xl md:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            AI-Powered Platform To Connect{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
               Businesses With Verified workers
            </span>
            
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            className="text-xl md:text-xl text-slate-600 dark:text-slate-300 mb-7 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AI Matching Skilled Worker For Your Hospital, Warehouse, Factory, Restaurants, Hotel , Retail Stores  And many more
          </motion.p>

          {/* Enhanced CTA Buttons - Primary buttons in one row */}
          <motion.div
            className="flex flex-col xs:flex-row gap-3 justify-center items-center mb-2 sm:mb-6 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
          {/* Primary Buttons Row */}
            <div className="flex flex-row gap-3 w-full xs:w-auto justify-center">
              <motion.button
                onClick={() => router.push('/services')}
                className="flex-1 xs:flex-none px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-700 border border-blue-600"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Find a Service
              </motion.button>
              
              <motion.button
                onClick={() => router.push('/contact')}
                className="flex-1 xs:flex-none px-4 py-3.5 bg-white text-slate-700 rounded-2xl font-medium text-sm sm:text-base border border-slate-300 hover:border-slate-400 transition-all duration-300 hover:bg-slate-50/80 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>

          {/* Download Button - Separate row */}
          <motion.div
            className="flex justify-center mb-4 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-medium text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-800 border border-slate-900 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.5 12a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
              </svg>
              Download App
            </motion.button>
          </motion.div>
          {/* Enhanced Trust Indicators */}
          <motion.div
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-slate-500 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-2">
              <div className="flex space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-xs sm:text-sm">★</span>
                ))}
              </div>
              <span className="font-medium">4.9/5 (2,000+ reviews)</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-slate-300"></div>
            <div className="font-medium">1,000+ businesses served</div>
          </motion.div>

          {/* Additional Premium Feature */}
          <motion.div
            className="mt-4 sm:mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 text-slate-600 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Instant matching • 24/7 support</span>
            </div>
          </motion.div>
          <div/>
        </div>
      </div>

      
    </section>
  )
}