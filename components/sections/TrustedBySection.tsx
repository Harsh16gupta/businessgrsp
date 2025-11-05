// components/TrustedBySection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const brands = [
  { name: "HUL", logo: "/images/trustedCompany/hul.png" },
  { name: "IndianOil", logo: "/images/trustedCompany/IndianOil.jpg" },
  { name: "RSPL", logo: "/images/trustedCompany/rspl.png" },
  { name: "Mocha", logo: "/images/trustedCompany/Mocha.png" },
  { name: "BlueWorld", logo: "/images/trustedCompany/blueworld.png" },
  { name: "Tata", logo: "/images/trustedCompany/tata.png" },
  { name: "PinchOfSpice", logo: "/images/trustedCompany/pinchOfSpice.png" },
];

export default function TrustedBySection() {
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-12 md:py-20 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Trusted by{" "}
            <span className="text-red-500 italic font-serif">industry leaders</span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Partnered with the most respected brands in the industry, 
            delivering excellence and innovation together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 place-items-center"
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{
                duration: 0.5,
                delay: isVisible ? 0.3 + index * 0.1 : 0,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{
                scale: 1.05,
                y: -4,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="group relative w-full max-w-[120px] sm:max-w-[140px] h-20 sm:h-28 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 cursor-pointer"
            >
              {/* Hover Glow Effect */}
              <motion.div 
                className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              
              {/* Logo Container */}
              <div className="relative z-10 transform transition-all duration-300 ease-out group-hover:scale-110">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={90}
                  height={50}
                  className="object-contain max-h-[40px] sm:max-h-[60px] transition-all duration-300 ease-out group-hover:brightness-110"
                  quality={90}
                />
              </div>
              
              {/* Subtle Border */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-gray-200/50 group-hover:border-gray-300/70 transition-all duration-300 ease-out" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto px-4"
        >
          {[
            { number: "50+", label: "Successful Projects" },
            { number: "15+", label: "Years Experience" },
            { number: "99%", label: "Client Satisfaction" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="text-center p-4 bg-white/50 rounded-2xl backdrop-blur-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 cursor-pointer transition-all duration-300 ease-out"
            >
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 transition-all duration-300 ease-out">
                {stat.number}
              </div>
              <div className="text-sm sm:text-base text-gray-600 transition-all duration-300 ease-out">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}