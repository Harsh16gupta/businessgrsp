// app/components/Testimonials.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const testimonials = [
  {
    company: "TechCorp Inc.",
    logo: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    comment: "Reduced our hiring time by 70% while maintaining quality standards. Incredible platform!",
    person: "Sarah Chen",
    position: "HR Director",
    rating: 5
  },
  {
    company: "BuildRight Construction",
    logo: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    comment: "The verified workforce system saved us countless hours of background checks and interviews.",
    person: "Mike Rodriguez",
    position: "Operations Manager",
    rating: 5
  },
  {
    company: "HealthFirst Medical",
    logo: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    comment: "Scalable staffing solutions that adapt to our fluctuating needs. Game changer for healthcare.",
    person: "Dr. Emily Watson",
    position: "Chief Medical Officer",
    rating: 5
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex justify-center sm:justify-start space-x-0.5 mb-2">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Infinite smooth auto-rotation for mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 3000); // Reduced to 3 seconds for better flow

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <section ref={ref} className="py-12 md:py-20 px-4 sm:px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Header - More Compact */}
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Trusted by Industry Leaders
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            See what our clients say about our workforce solutions
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 shadow-lg border border-slate-700 hover:shadow-xl transition-all duration-300 hover:border-slate-600"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              {/* Company Logo and Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center text-white">
                  {testimonial.logo}
                </div>
                <StarRating rating={testimonial.rating} />
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6 italic">
                "{testimonial.comment}"
              </p>

              {/* Person Info */}
              <div className="border-t border-slate-700 pt-4">
                <div className="font-semibold text-white text-sm md:text-base">
                  {testimonial.person}
                </div>
                <div className="text-slate-400 text-xs md:text-sm">{testimonial.position}</div>
                <div className="text-blue-400 font-medium text-xs md:text-sm mt-1">
                  {testimonial.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel - More Compact */}
        <div className="lg:hidden relative overflow-hidden mb-12">
          <motion.div
            className="flex"
            animate={{ 
              x: `-${currentTestimonial * 100}%`,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.8
              }
            }}
            style={{ width: `${testimonials.length * 100}%` }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-2"
                style={{ width: `${100 / testimonials.length}%` }}
              >
                <div className="bg-slate-800 rounded-xl p-4 sm:p-5 shadow-lg border border-slate-700 h-full">
                  {/* Company Logo and Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center text-white">
                      {testimonial.logo}
                    </div>
                    <StarRating rating={testimonial.rating} />
                  </div>

                  {/* Testimonial Text - More Compact */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 italic line-clamp-4">
                    "{testimonial.comment}"
                  </p>

                  {/* Person Info - More Compact */}
                  <div className="border-t border-slate-700 pt-3">
                    <div className="font-semibold text-white text-xs sm:text-sm">
                      {testimonial.person}
                    </div>
                    <div className="text-slate-400 text-xs">{testimonial.position}</div>
                    <div className="text-blue-400 font-medium text-xs mt-0.5">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Gradient Overlays for Infinite Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none" />
        </div>

        {/* Mobile Carousel Indicators - More Compact */}
        <div className="flex justify-center lg:hidden mt-6 space-x-1.5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              onClick={() => setCurrentTestimonial(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-progress indicator */}
        <div className="lg:hidden flex justify-center mt-4">
          <div className="w-20 h-1 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              key={currentTestimonial}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}