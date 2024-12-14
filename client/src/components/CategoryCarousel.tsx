import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../index.css';

export const CategoryCarousel: React.FC = () => {
  const categories = useSelector((state: RootState) => state.category.categories);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft = 0;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-black text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold mb-12 font-roboto text-center bg-gradient-to-r from-black via-gray-200 to-gray-500 bg-clip-text text-transparent">
          Shop by Category
        </h2>
        <div className="relative">
          {/* Left Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-10 bg-black text-white hover:bg-white hover:text-black border border-black rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide"
          >
            {categories.map((category: any) => (
              <div
                key={category.CategoryId}
                className="flex-none w-72 sm:w-80 snap-start"
              >
                <div className="group relative h-96 w-full overflow-hidden rounded-lg bg-white shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
                  <img
                    src={category.Image}
                    alt={category.CategoryName}
                    className="h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-110 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="text-2xl font-bold text-black text-center">{category.CategoryName}</h3>
                    <p className="text-gray-900 text-center">{category.Description}</p>
                    <button className="mt-4 px-6 py-2 bg-black text-white font-semibold rounded-md hover:bg-white hover:text-black border border-black transition-all duration-300">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-10 bg-black text-white hover:bg-white hover:text-black border border-black rounded-full p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Add this to your global CSS or a separate styles file
const globalStyles = `

`;

// Add the global styles to the document
const styleElement = document.createElement("style");
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);
