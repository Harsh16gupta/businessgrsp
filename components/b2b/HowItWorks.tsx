// app/components/HowItWorks.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Post Workforce Requirements',
    description: 'Specify your needs including number of workers, duration, and pay range'
  },
  {
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
      </svg>
    ),
    title: 'Get Matched with Verified Workers',
    description: 'Our AI matches you with pre-vetted professionals in your industry'
  },
  {
    icon: (
      <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Negotiate and Confirm Instantly',
    description: 'Seamless communication and quick confirmation process'
  }
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4 transition-colors duration-300">
            Simple three-step process to get your workforce needs met quickly and efficiently
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Connecting line - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent transition-colors duration-300" />
          
          {/* Vertical connecting line for mobile */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-blue-200 dark:via-blue-800 to-transparent transition-colors duration-300" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col md:flex-row md:text-center items-start md:items-center relative z-10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Mobile layout */}
              <div className="flex items-center md:flex-col md:items-center w-full">
                {/* Step number with connector dot for mobile */}
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-16 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg border-2 border-white dark:border-slate-800 shadow-sm relative z-20 transition-colors duration-300">
                    {index + 1}
                  </div>
                  {/* Connector dot for mobile */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full z-10 md:hidden transition-colors duration-300" />
                </div>

                {/* Content container for mobile */}
                <div className="ml-4 md:ml-0 md:mt-6 flex-1">
                  {/* Icon */}
                  <div className="text-blue-600 dark:text-blue-400 mb-2 md:mb-4 md:flex md:justify-center transition-colors duration-300">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2 md:mb-3 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}