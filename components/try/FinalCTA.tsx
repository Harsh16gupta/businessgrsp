'use client'

import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-600 via-slate-600 to-blue-800">
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #2563eb 0%, #475569 50%, #1e40af 100%)',
            'linear-gradient(135deg, #1e40af 0%, #475569 50%, #2563eb 100%)',
            'linear-gradient(135deg, #2563eb 0%, #475569 50%, #1e40af 100%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      {/* Blurred light effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Ready to Get Started?
        </motion.h2>
        
        <motion.p
          className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Join thousands of businesses and professionals using GRSP today
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-blue-50 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
          </motion.button>
          
          <motion.button
            className="px-8 py-4 bg-transparent text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:border-white transition-all duration-300 hover:bg-white/10 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule Demo
          </motion.button>
        </motion.div>
        
        <motion.p
          className="text-blue-200 mt-8 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          No credit card required • Setup in minutes
        </motion.p>
      </div>
    </section>
  )
}