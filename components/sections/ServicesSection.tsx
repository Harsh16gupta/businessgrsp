"use client"
import ServiceCard from "../ui/ServiceCard"

const services = [
  {
    id: 2,
    title: "Plumbing",
    description: "Expert plumbing solutions for all your needs",
    price: 79,
    rating: 5,
    worker: {
      name: "Harsh"
    }
  },
  {
    id: 3,
    title: "Electrical",
    description: "Safe and reliable electrical repairs",
    price: 69,
    rating: 5,
    worker: {
      name: "Harsh"
    }
  },
  {
    id: 4,
    title: "AC Repair",
    description: "Quick AC servicing and repairs",
    price: 89,
    rating: 5,
    worker: {
      name: "Harsh"
    }
  },
  {
    id: 5,
    title: "Painting",
    description: "Professional painting services",
    price: 199,
    rating: 5,
    worker: {
      name: "Harsh"
    }
  },
  {
    id: 6,
    title: "Pest Control",
    description: "Effective pest control treatments",
    price: 99,
    rating: 5,
    worker: {
      name: "Harsh"
    }
  }
]

export default function ServicesSection() {
  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Our Popular Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose from a wide range of professional services delivered by verified experts
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}