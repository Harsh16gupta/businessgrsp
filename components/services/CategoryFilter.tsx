import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronLeft, IconChevronRight, IconFilter, IconX } from '@tabler/icons-react';

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CategoryFilterProps {
  categories: ServiceCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const [showCheckboxList, setShowCheckboxList] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const toggleCheckboxList = () => {
    setShowCheckboxList(!showCheckboxList);
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
    setShowCheckboxList(false);
  };

  return (
    <div className="relative mb-8">
      {/* Header with Filter Button for Mobile */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Categories</h3>
        <div className="flex items-center gap-2">
          {/* Checkbox List Toggle Button - Mobile Only */}
          <button
            onClick={toggleCheckboxList}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            <IconFilter className="w-4 h-4" />
            {showCheckboxList ? 'Hide' : 'Filter'}
          </button>

          {/* Scroll Buttons for Mobile */}
          <div className="flex gap-1 lg:hidden">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <IconChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <IconChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Checkbox Dropdown List - Mobile Only */}
      <AnimatePresence>
        {showCheckboxList && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mb-4 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto p-4">
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={selectedCategory === category.id}
                      onChange={() => handleCategorySelect(category.id)}
                      className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-lg">{category.icon}</span>
                    <span className="flex-1 text-sm font-medium text-slate-700">
                      {category.name}
                    </span>
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                      {category.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Scroll Categories */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onCategoryChange(category.id)}
              className={`
                flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-2xl font-medium transition-all duration-300 whitespace-nowrap
                ${selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm'
                }
              `}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="text-sm font-medium">{category.name}</span>
              <span className={`
                text-xs px-2 py-1 rounded-full min-w-[28px] text-center font-medium
                ${selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
                }
              `}>
                {category.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Gradient Overlays for Mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none lg:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none lg:hidden" />
      </div>
    </div>
  );
};