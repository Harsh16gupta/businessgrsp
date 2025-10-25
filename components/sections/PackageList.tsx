'use client';

interface Package {
  id: string;
  name: string;
  price: number;
  duration: string;
  rating: string;
  features: string[];
  image: string;
  categoryId: string;
}

interface PackageListProps {
  packages: Package[];
  onAdd: (packageId: string) => void;
}

export default function PackageList({ packages, onAdd }: PackageListProps) {
  if (packages.length === 0) {
    return (
      <div className="flex-1">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
          <p className="text-gray-500">Try selecting a different category or search term.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Service Image */}
            <div className="h-48 bg-gray-200 relative">
              <img
                src={pkg.image || "/images/services/default-service.png"}
                alt={pkg.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/services/default-service.png";
                }}
              />
              <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                {pkg.rating}
              </div>
            </div>

            {/* Service Details */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                {pkg.name}
              </h3>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold text-green-600">
                  ₹{pkg.price}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {pkg.duration}
                </span>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Includes:</h4>
                <ul className="space-y-1">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => onAdd(pkg.id)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}