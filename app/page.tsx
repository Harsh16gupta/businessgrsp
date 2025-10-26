"use client";
import { useRef } from 'react';
import FloatingElements from '@/components/b2b/FloatingElements';
import Hero from '@/components/b2b/Hero';
import HowItWorks from '@/components/b2b/HowItWorks';
import WhyChooseUs from '@/components/b2b/WhyChooseUs';
import Testimonials from '@/components/b2b/Testimonials';
import CTASection from '@/components/b2b/CTASection';

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  
  const scrollToForm = () => {
    // Redirect to requirement form page instead
    window.location.href = '/requirement-form';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <FloatingElements />
      <Hero />
      <HowItWorks />
      
      {/* Remove RequirementForm for now */}
      <div ref={formRef} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to Get Staff?
          </h2>
          <button
            onClick={scrollToForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Submit Your Requirement
          </button>
        </div>
      </div>
      
      <WhyChooseUs />
      <Testimonials />
      <CTASection onGetStarted={scrollToForm} />
    </div>
  );
}