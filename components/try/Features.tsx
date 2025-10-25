'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: '🔒',
    title: 'Verified Professionals',
    description: 'Every worker undergoes thorough background checks and skill verification.',
    color: 'from-blue-500 to-blue-700'
  },
  {
    icon: '⚡',
    title: 'Instant Matching',
    description: 'Get connected with the right professionals in minutes, not days.',
    color: 'from-slate-600 to-slate-800'
  },
  {
    icon: '💼',
    title: 'Flexible Staffing',
    description: 'Scale your workforce up or down based on your business needs.',
    color: 'from-blue-500 to-blue-700'
  },
  {
    icon: '💰',
    title: 'Cost Effective',
    description: 'Save up to 40% compared to traditional staffing agencies.',
    color: 'from-slate-600 to-slate-800'
  },
  {
    icon: '📱',
    title: 'Easy Management',
    description: 'Manage all your staffing needs through our intuitive platform.',
    color: 'from-blue-500 to-blue-700'
  },
  {
    icon: '🛡️',
    title: 'Quality Guarantee',
    description: 'We stand behind every professional with our satisfaction guarantee.',
    color: 'from-slate-600 to-slate-800'
  }
]

export default function Features() {
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

  return (
    <section id="features" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Why Choose GRSP?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to find the perfect professional or service
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-xl text-white">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}