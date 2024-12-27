import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const CategoryCarousel: React.FC = () => {
  const categories = useSelector((state: RootState) => state.category.categories);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, categories.length - itemsPerPage);

  const scroll = (direction: 'left' | 'right') => {
    setCurrentIndex(prev => {
      if (direction === 'left') {
        return Math.max(0, prev - 1);
      }
      return Math.min(maxIndex, prev + 1);
    });
  };

  return (
    <section className="relative w-full bg-black text-white h-screen flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h2 className="text-4xl sm:text-5xl font-bold mb-8 font-roboto text-center text-white">
          Explore Our Categories
        </h2>
        <div className="relative">
          {/* Left Button */}
          <button
            onClick={() => scroll('left')}
            disabled={currentIndex === 0}
            className={`absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 text-white backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
              }}
            >
              {categories.map((category: any) => (
                <div
                  key={category.CategoryId}
                  className="flex-none w-full sm:w-1/3 px-3"
                >
                  <div className="group relative h-[400px] w-full overflow-hidden rounded-xl bg-gray-900 shadow-xl border border-white/10">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black opacity-40 transition-opacity duration-500 group-hover:opacity-10" />
                    
                    {/* Image */}
                    <img
                      src={category.Image}
                      alt={category.CategoryName}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent opacity-90 transition-all duration-500 ease-in-out h-1/2 group-hover:h-full" />
                    
                    {/* Content Container */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 transition-all duration-500 ease-in-out group-hover:justify-center">
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white transform transition-all duration-500 ease-in-out translate-y-0 group-hover:-translate-y-4">
                        {category.CategoryName}
                      </h3>
                      
                      {/* Description - slides up from bottom */}
                      <div className="overflow-hidden">
                        <p className="text-gray-300 text-sm mb-4 transform transition-all duration-500 ease-in-out translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                          {category.Description}
                        </p>
                      </div>
                      
                      {/* Button - slides up from bottom with delay */}
                      <div className="overflow-hidden">
                        <NavLink 
                          to={`Category/${category.CategoryId}`} 
                          className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded-full text-sm font-medium w-max transform transition-all duration-500 delay-100 ease-in-out translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                        >
                          Explore Now
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </NavLink>
                      </div>
                    </div>
                    
                    {/* Product Count Badge */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      {category.ProductCount} Products
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <button
            onClick={() => scroll('right')}
            disabled={currentIndex === maxIndex}
            className={`absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white/10 text-white backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
              currentIndex === maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;