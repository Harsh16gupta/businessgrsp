"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Trusted Professionals
            <span className="block text-orange-400 dark:text-orange-300">At Your Doorstep</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-blue-100 dark:text-blue-200">
            Book reliable home services, delivered by verified professionals
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button 
            
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-200"
            >
              <Link href="/services">
                Book a Service
              </Link>
            </Button>
            <Button 
              
              variant="outline"
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-200 border-white"
            >
              <Link href="/download">
                Download App
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}