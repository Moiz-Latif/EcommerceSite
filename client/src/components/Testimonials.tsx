import React from "react";
import nvidia from '../assets/Logo-nvidia-transparent-PNG.png';
import apple from '../assets/apple.jpg';
import logitech from '../assets/logitech.png';
import microsoft from '../assets/microsoft.png';
import paypal from '../assets/paypal.png';
import samsung from '../assets/samsung.png';

const partners = [
  { id: 1, name: "Apple", logo: apple },
  { id: 2, name: "Samsung", logo: samsung },
  { id: 3, name: "Logitech", logo: logitech },
  { id: 4, name: "Microsoft", logo: microsoft },
  { id: 5, name: "NVIDIA", logo: nvidia },
  { id: 6, name: "PayPal", logo: paypal },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="w-full bg-black text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Trusted by Industry Leaders
        </h2>
        <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
          We're proud to collaborate with some of the most renowned companies in the tech industry, 
          pushing the boundaries of innovation together.
        </p>
        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
          
          {/* Horizontal scrolling container */}
          <div className="flex items-center space-x-8 animate-scroll">
            {partners.concat(partners).map((partner, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 min-w-[200px] group"
              >
                <div className="bg-white rounded-full p-4 mb-4 w-24 h-24 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-16 w-auto object-contain filter group-hover:brightness-110"
                  />
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Add this to your global CSS or a separate animation file
const globalStyles = `
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}
`;

// Add the global styles to the document
const styleElement = document.createElement("style");
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);