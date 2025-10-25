import Link from 'next/link'

interface Service {
  id: number
  title: string
  description: string
  price: number
  rating: number
  worker: {
    name: string
  }
}

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
        <span className="text-2xl font-bold text-blue-600">${service.price}</span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-yellow-400 mr-1">⭐</span>
          <span className="text-gray-700">{service.rating}</span>
        </div>
        <span className="text-sm text-gray-500">by {service.worker.name}</span>
      </div>
      
      <Link 
        href={`/booking/${service.id}`}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-center block"
      >
        Book Now
      </Link>
    </div>
  )
}