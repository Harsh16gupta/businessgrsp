'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

const TrustedBy = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const brands = [
    { name: 'HUL', logo: '/logos/hul.svg' },
    { name: 'INDIAN', logo: '/logos/indian.svg' },
    { name: 'RSPL', logo: '/logos/rspl.svg' },
    { name: 'MOCHA', logo: '/logos/mocha.svg' },
    { name: 'BlueWorld', logo: '/logos/blueworld.svg' },
    { name: 'TATA', logo: '/logos/tata.svg' },
    { name: 'pinchOfSpiece', logo: '/logos/pinchofspiece.svg' },
  ]

  // Mock SVG logos as components with larger sizes
  const BrandLogo = ({ name }: { name: string }) => {
    const getLogoContent = () => {
      switch (name) {
        case 'HUL':
          return (
            <svg viewBox="0 0 120 40" className="w-28 h-10">
              <rect x="10" y="8" width="30" height="24" rx="4" fill="#2563eb" opacity="0.9"/>
              <text x="55" y="25" fontSize="16" fontWeight="bold" fill="currentColor">HUL</text>
            </svg>
          )
        case 'INDIAN':
          return (
            <svg viewBox="0 0 120 40" className="w-32 h-10">
              <circle cx="20" cy="20" r="12" fill="#dc2626" opacity="0.9"/>
              <text x="45" y="25" fontSize="14" fontWeight="bold" fill="currentColor">INDIAN</text>
            </svg>
          )
        case 'RSPL':
          return (
            <svg viewBox="0 0 120 40" className="w-28 h-10">
              <polygon points="20,8 40,8 30,28" fill="#16a34a" opacity="0.9"/>
              <text x="55" y="25" fontSize="16" fontWeight="bold" fill="currentColor">RSPL</text>
            </svg>
          )
        case 'MOCHA':
          return (
            <svg viewBox="0 0 120 40" className="w-32 h-10">
              <rect x="10" y="12" width="20" height="16" rx="8" fill="#7c2d12" opacity="0.9"/>
              <text x="40" y="25" fontSize="15" fontWeight="bold" fill="currentColor">MOCHA</text>
            </svg>
          )
        case 'BlueWorld':
          return (
            <svg viewBox="0 0 140 40" className="w-36 h-10">
              <circle cx="25" cy="20" r="10" fill="#0369a1" opacity="0.9"/>
              <text x="45" y="25" fontSize="13" fontWeight="bold" fill="currentColor">BlueWorld</text>
            </svg>
          )
        case 'TATA':
          return (
            <svg viewBox="0 0 120 40" className="w-28 h-10">
              <rect x="15" y="10" width="20" height="20" fill="#9333ea" opacity="0.9"/>
              <text x="50" y="25" fontSize="16" fontWeight="bold" fill="currentColor">TATA</text>
            </svg>
          )
        case 'pinchOfSpiece':
          return (
            <svg viewBox="0 0 160 40" className="w-40 h-10">
              <path d="M15,20 Q25,8 35,20 T55,20" stroke="#ea580c" strokeWidth="2" fill="none" opacity="0.9"/>
              <text x="65" y="25" fontSize="12" fontWeight="bold" fill="currentColor">pinchOfSpiece</text>
            </svg>
          )
        default:
          return <div className="w-28 h-10 bg-gray-300 rounded"></div>
      }
    }

    return getLogoContent()
  }

  // Fixed container variants with proper TypeScript types
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  // Fixed item variants with proper TypeScript types
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
    }
  }

  // Calculate total width for seamless loop
  const totalBrands = [...brands, ...brands, ...brands] // Triple the array for better continuity

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partnered with the most innovative companies driving excellence across industries
          </p>
        </motion.div>

        {/* Desktop: Continuous Scroll with larger logos */}
        <div className="hidden lg:block">
          <motion.div
            className="flex space-x-20 overflow-hidden py-10"
            animate={{
              x: [0, -1680], // Adjusted for larger logos and spacing
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 45,
                ease: "linear",
              },
            }}
          >
            {/* Triple the array for seamless continuous loop */}
            {totalBrands.map((brand, index) => (
              <motion.div
                key={`${brand.name}-${index}`}
                whileHover={{ 
                  scale: 1.08,
                  y: -4,
                  transition: { duration: 0.3 }
                }}
                className="flex-shrink-0 flex items-center justify-center px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gray-300/70"
              >
                <div className="text-gray-700 hover:text-gray-900 transition-colors duration-300">
                  <BrandLogo name={brand.name} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile & Tablet: Static Grid */}
        <div className="lg:hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-3 gap-8"
          >
            {brands.map((brand, index) => (
              <motion.div
                key={brand.name}
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                className="flex items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="text-gray-700 hover:text-gray-900 transition-colors">
                  <BrandLogo name={brand.name} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 text-sm text-gray-500 bg-white/50 px-6 py-3 rounded-full border border-gray-200/50 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Trusted by 10,000+ businesses worldwide
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TrustedBy