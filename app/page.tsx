"use client";
import { useRef } from 'react';
import FloatingElements from '@/components/b2b/FloatingElements';
import Hero from '@/components/b2b/Hero';
import HowItWorks from '@/components/b2b/HowItWorks';
import WhyChooseUs from '@/components/b2b/WhyChooseUs';
import Testimonials from '@/components/b2b/Testimonials';
import CTASection from '@/components/b2b/CTASection';
import Link from 'next/link';

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  
  const scrollToForm = () => {
    window.location.href = '/requirement-form';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <FloatingElements />
      <Hero />
      <HowItWorks />
      
      <div ref={formRef} className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ready to Get Staff?
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            Submit your staffing requirements and we'll connect you with verified workers within 24 hours.
          </p>
          <Link 
            href="/requirement-form"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-300"
          >
            Submit Your Requirement
          </Link>
        </div>
      </div>
      
      <WhyChooseUs />
      <Testimonials />
      <CTASection onGetStarted={scrollToForm} />
    </div>
  );
}