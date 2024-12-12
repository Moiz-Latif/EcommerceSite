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
    <section className="relative w-full max-w-7xl mx-auto px-16 py-12 font-roboto bg-stone-50 border-2 border-t-stone-300 rounded-[50px] -mt-48 z-40">
      <h2 className="text-6xl font-medium text-primary-dark mb-8 text-center tracking-tight">Shop by Category</h2>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-primary-light hover:bg-black hover:text-primary-light rounded-full p-2 border-2 border-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div
          ref={carouselRef}
          className="flex overflow-x-hidden snap-x snap-mandatory gap-6"
        >
          {categories.map((category: any) => (
            <div
              key={category.CategoryId}
              className="flex-none w-72 snap-start"
            >
              <div className="card group relative h-80 w-full overflow-hidden rounded-lg bg-primary-light border-4  border-secondary-dark transition-all duration-300 hover:shadow-2xl">
                <img
                  src={category.Image}
                  alt={category.CategoryName}
                  className="h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary-dark bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="text-2xl font-medium text-primary-light text-center">{category.CategoryName}</h3>
                  <p className="text-primary-light text-center transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">{category.Description}</p>
                  <button className="w-full max-w-xs border-2 rounded-lg border-primary-light px-4 py-2 bg-transparent text-primary-light text-xl hover:bg-black hover:text-ghost_white-900 hover:border-stone-700 transition-all duration-300 active:opacity-50 transform translate-y-4 group-hover:translate-y-0">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-primary-light hover:bg-black hover:text-primary-light rounded-full p-2 border-2 border-primary-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

