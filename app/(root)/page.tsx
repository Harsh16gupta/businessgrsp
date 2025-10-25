
import ServicesSection from '../../components/sections/ServicesSection'
import FeaturesSection from '../../components/sections/FeaturesSection'

import Hero from '../../components/ui/Hero'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { GlowingEffectDemoSecond } from '@/components/sections/GlowingEffectDemoSecond'

export default function Home() {
  return (
    <div className='mx-20 mt-2'>
      
      <Hero />
      <ServicesSection />
      <FeaturesSection />
      <GlowingEffectDemoSecond />
      <TestimonialsSection />
      
    </div>
  )
}