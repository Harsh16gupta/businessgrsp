"use client"
import { useRef, Suspense } from 'react';
import FloatingElements from '@/components/b2b/FloatingElements';
import Hero from '@/components/b2b/Hero';
import HowItWorks from '@/components/b2b/HowItWorks';
import RequirementForm from '@/components/b2b/RequirementForm';
import WhyChooseUs from '@/components/b2b/WhyChooseUs';
import Testimonials from '@/components/b2b/Testimonials';
import CTASection from '@/components/b2b/CTASection';

export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setTimeout(() => 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <FloatingElements />
      <Hero />
      <HowItWorks />
      
      {/* Wrap RequirementForm in Suspense */}
      <div ref={formRef}>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading form...</p>
            </div>
          </div>
        }>
          <RequirementForm />
        </Suspense>
      </div>
      
      <WhyChooseUs />
      <Testimonials />
      <CTASection onGetStarted={scrollToForm} />
    </div>
  );
}