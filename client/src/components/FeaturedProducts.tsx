import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Device {
  DeviceId: string;
  DeviceName: string;
  Price: number;
  Images: string[];
  Brand: string;
  Model: string;
}

export const FeaturedProducts: React.FC = () => {
  const allDevices = useSelector((state: RootState) => state.device.devices);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Select 5 devices of different brands
  const featuredDevices = React.useMemo(() => {
    const uniqueBrands = new Set();
    return allDevices.filter(device => {
      if (uniqueBrands.size < 5 && !uniqueBrands.has(device.Brand)) {
        uniqueBrands.add(device.Brand);
        return true;
      }
      return false;
    }).slice(0, 5);
  }, [allDevices]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredDevices.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredDevices.length) % featuredDevices.length);
  };

  useEffect(() => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * currentIndex;
      sliderRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <section className="w-full bg-black text-white px-4 py-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-medium tracking-tight mb-5 text-center font-roboto">Featured Products</h2>
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex overflow-hidden snap-x snap-mandatory"
          >
            {featuredDevices.map((device, index) => (
              <div
                key={index}
                className="flex-none w-full snap-center"
              >
                <div className="max-w-lg mx-auto bg-white text-black rounded-xl overflow-hidden shadow-lg hover:shadow-2xl duration-30 transition-all duration-300 ">
                  <img
                    src={device.Images[1]}
                    alt={device.DeviceName}
                    className="w-full h-72 object-contain transition-transform duration-300 transform hover:scale-110 z-20"
                  />
                  <div className="p-6 -mt-12 flex flex-col justify-center items-center">
                    <h3 className="text-xl font-bold mb-2 truncate z-40">{device.DeviceName}</h3>
                    <p className="text-sm text-gray-600 mb-2 z-40">
                      {device.Brand} {device.Model}
                    </p>
                    <p className="text-lg font-semibold mb-4">${device.Price.toFixed(2)}</p>
                    <button className="w-full px-4 py-2 bg-black text-white rounded-lg text-lg tracking-wide hover:opacity-90 transition-colors duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition-all duration-300"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition-all duration-300"
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          {featuredDevices.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
