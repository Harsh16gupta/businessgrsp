"use client";
import { useRef } from 'react';
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <FloatingElements />
      <Hero />
      <HowItWorks />
      
      {/* Remove Suspense since RequirementForm is now a client component */}
      <div ref={formRef}>
        <RequirementForm />
      </div>
      
      <WhyChooseUs />
      <Testimonials />
      <CTASection onGetStarted={scrollToForm} />
    </div>
  );
}