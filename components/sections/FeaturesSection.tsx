"use client"
const features = [
  {
    title: "Verified Professionals",
    description: "All our service providers are background-verified and skilled",
    icon: "✅"
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges. Know exactly what you're paying for",
    icon: "💰"
  },
  {
    title: "Quick Service",
    description: "Get services delivered at your preferred time slot",
    icon: "⚡"
  },
  {
    title: "Quality Assured",
    description: "100% satisfaction guarantee on all our services",
    icon: "🛡️"
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            We make service booking simple, reliable, and hassle-free
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl md:text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}