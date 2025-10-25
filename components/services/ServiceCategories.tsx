"use client";

import { Category } from "@/app/types";

interface ServiceCategoriesProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export default function ServiceCategories({
  categories,
  selectedCategoryId,
  onSelect,
}: ServiceCategoriesProps) {
  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-4 space-y-2">
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
              selectedCategoryId === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{category.name}</span>
              {category.count && (
                <span className="text-sm opacity-75">({category.count})</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}