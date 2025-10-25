'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function BusinessSolutions() {
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

  const solutions = [
    {
      title: 'Short-term Temporary Workers',
      description: 'For one-off events and seasonal demand spikes',
      features: ['Event staffing', 'Seasonal support', 'Emergency coverage']
    },
    {
      title: 'Long-term Temporary Workers',
      description: 'For longer-term and project-based work',
      features: ['Project teams', 'Maternity cover', 'Skill gaps']
    },
    {
      title: 'Permanent Workers',
      description: 'For hiring your next team member',
      features: ['Direct hiring', 'Team expansion', 'Specialized roles']
    }
  ]

  const benefits = [
    {
      title: '24-Hour Staffing',
      description: 'Fill positions within 24 hours of posting your request',
    },
    {
      title: 'Pre-Vetted Workers',
      description: 'All workers are background-checked and skill-verified',
    },
    {
      title: 'Cost-Effective',
      description: 'Up to 30% savings compared to traditional staffing agencies',
    },
    {
      title: 'Intuitive Platform',
      description: 'Easy-to-use dashboard to manage all your staffing needs',
    }
  ]

  return (
    <section 
      id="business" 
      ref={ref} 
      className="relative py-24 overflow-hidden"
    >
      {/* Cool Tone Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-sky-50/30 to-blue-50/20 dark:from-slate-950 dark:via-cyan-950/15 dark:to-blue-950/10">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 -right-16 w-80 h-80 bg-gradient-to-r from-sky-400/8 to-indigo-500/8 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-r from-blue-400/5 to-cyan-500/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header - More Compact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.6, 
            ease: [0.22, 1, 0.36, 1] 
          }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ 
              duration: 0.5, 
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm text-slate-600 dark:text-slate-400 text-sm font-medium mb-6"
          >
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
            Staffing Solutions
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-4 leading-tight">
            Staffing Solutions
            <br />
            <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text">
              for All Your Needs
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Fill any gaps with temporary staff while you find quality candidates for permanent roles
          </p>
        </motion.div>

        {/* Solutions Grid - More Compact */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ 
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { 
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              className="group relative flex flex-col"
            >
              {/* Compact Card Design */}
              <div className="relative bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/60 dark:border-slate-700/50 shadow-lg shadow-black/5 dark:shadow-black/20 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/5 transition-all duration-400 flex-1 flex flex-col">
                
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-indigo-500/0 group-hover:from-cyan-500/3 group-hover:via-blue-500/2 group-hover:to-indigo-500/3 transition-all duration-400" />
                
                {/* Content Container */}
                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Title */}
                  <motion.h3 
                    className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-tight flex-shrink-0"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                  >
                    {solution.title}
                  </motion.h3>
                  
                  {/* Description */}
                  <motion.p 
                    className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed text-base flex-shrink-0"
                    whileHover={{ x: 1 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                  >
                    {solution.description}
                  </motion.p>
                  
                  {/* Features List */}
                  <div className="flex-1 mb-6">
                    <ul className="space-y-2">
                      {solution.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex}
                          initial={{ opacity: 0, x: -8 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ 
                            duration: 0.4, 
                            delay: 0.6 + (index * 0.1) + (featureIndex * 0.08),
                            ease: [0.22, 1, 0.36, 1]
                          }}
                          whileHover={{ 
                            x: 4,
                            transition: { duration: 0.15 }
                          }}
                          className="flex items-center text-slate-700 dark:text-slate-300 font-medium text-sm group/feature"
                        >
                          <motion.div
                            whileHover={{ 
                              scale: 1.2,
                              transition: { 
                                duration: 0.2
                              }
                            }}
                            className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mr-2 shadow-sm"
                          >
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                          <span className="group-hover/feature:text-slate-900 dark:group-hover/feature:text-white transition-colors duration-150">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Compact Button */}
                  <motion.button 
                    whileHover={{ 
                      scale: 1.02,
                      transition: { 
                        duration: 0.2
                      }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 px-4 rounded-xl font-semibold shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group/btn overflow-hidden relative border border-cyan-500/20 text-sm mt-auto"
                  >
                    <span className="relative z-10">Learn More</span>
                    
                    {/* Smooth Shimmer Effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section - More Compact */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
              Why Partner With Us?
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Discover the advantages of using GRSP for your business staffing needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + index * 0.08,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -4,
                  scale: 1.01,
                  transition: { 
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1]
                  }
                }}
                className="group relative"
              >
                {/* Compact Benefit Card */}
                <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl p-5 border border-white/50 dark:border-slate-700/50 shadow-md hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-400 h-full text-center">
                  
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-base">
                    {benefit.title}
                  </h4>
                  
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Smoother Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-12px) rotate(0.3deg); 
          }
        }
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-15px) rotate(-0.2deg); 
          }
        }
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(0.1deg); 
          }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 14s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 12s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  )
}