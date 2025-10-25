'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface Stat {
  number: number
  label: string
  suffix?: string
  isMillions?: boolean
}

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const stats: Stat[] = [
    { number: 1000, label: 'Businesses Served This Month', suffix: '+' },
    { number: 283, label: 'Workers Available Now' },
    { number: 7, label: 'Reliable Workers Ready', suffix: 'M+', isMillions: true },
    { number: 100, label: 'Jobs Filled in 24h', suffix: '%' },
  ]

  const CountUpNumber = ({ value, suffix, isMillions }: { value: number; suffix?: string; isMillions?: boolean }) => {
    const [displayNumber, setDisplayNumber] = useState(0)

    useEffect(() => {
      if (!isInView) return

      let start = 0
      const duration = 2000
      const increment = value / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= value) {
          setDisplayNumber(value)
          clearInterval(timer)
        } else {
          setDisplayNumber(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }, [isInView, value])

    const formattedNumber = isMillions 
      ? (displayNumber / (value > 1 ? 1 : 1000000)).toFixed(1)
      : displayNumber.toLocaleString()

    return (
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
        {formattedNumber}{suffix}
      </div>
    )
  }

  return (
    <section ref={ref} className="py-12 sm:py-16 bg-muted">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1 
              }}
              className="text-center"
            >
              <CountUpNumber 
                value={stat.number} 
                suffix={stat.suffix} 
                isMillions={stat.isMillions} 
              />
              <div className="text-foreground/80 text-xs sm:text-sm md:text-base leading-tight sm:leading-normal">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}