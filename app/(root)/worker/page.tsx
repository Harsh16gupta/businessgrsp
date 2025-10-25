// app/register/page.tsx
'use client';

import { motion, Variants } from 'framer-motion';
import { 
  Users, 
  Building2, 
  CheckCircle, 
  Star, 
  Shield,
  Calendar,
  TrendingUp
} from 'lucide-react';

export default function WorkerRegistrationPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const cardHoverVariants: Variants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  const benefitItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8 pt-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto mb-16"
      >
        
        
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Join GRSP as a{' '}
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Verified Worker
          </span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Choose how you want to work and start growing your professional career with trusted clients
        </p>
      </motion.div>

      {/* Registration Options */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Household Services Card */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            initial="initial"
            className="group"
          >
            <motion.div
              variants={cardHoverVariants}
              className="h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300"
            >
              <div className="p-8 lg:p-10">
                {/* Icon & Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors duration-300">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                    Register for Household Services
                  </h2>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  Perfect for individual professionals offering home services like cleaning, 
                  plumbing, electrical work, repairs, and maintenance. Get verified and start 
                  receiving direct bookings from local customers.
                </p>

                {/* Benefits List */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: CheckCircle, text: 'Get verified and build trust' },
                    { icon: Star, text: 'Receive direct customer bookings' },
                    { icon: Calendar, text: 'Flexible schedule management' },
                    { icon: TrendingUp, text: 'Grow your customer base' }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      variants={benefitItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <benefit.icon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.a
                  href=""
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                >
                  <span>Join as Household Worker</span>
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    whileHover={{ x: 5, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2"
                  >
                    →
                  </motion.div>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>

          {/* Business Projects Card */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            initial="initial"
            className="group"
          >
            <motion.div
              variants={cardHoverVariants}
              className="h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300"
            >
              <div className="p-8 lg:p-10">
                {/* Icon & Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors duration-300">
                    <Building2 className="w-8 h-8 text-slate-700" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                    Register for Business Projects
                  </h2>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  Ideal for skilled professionals and service providers looking to work with 
                  businesses on project-based contracts or ongoing partnerships. Access 
                  premium corporate clients through the GRSP network.
                </p>

                {/* Benefits List */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: CheckCircle, text: 'Work with verified businesses' },
                    { icon: Shield, text: 'Professional contract opportunities' },
                    { icon: TrendingUp, text: 'Higher value projects' },
                    { icon: Building2, text: 'Corporate network access' }
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      variants={benefitItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <benefit.icon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{benefit.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.a
                  href="/register/business-worker"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                >
                  <span>Join as Business Worker</span>
                  <motion.div
                    initial={{ x: -5, opacity: 0 }}
                    whileHover={{ x: 5, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2"
                  >
                    →
                  </motion.div>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Why Choose GRSP?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              GRSP connects skilled workers with opportunities that match their expertise. 
              Our verification process ensures trust and quality, while our platform handles 
              payments, scheduling, and client management so you can focus on your work.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}