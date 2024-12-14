import React from 'react';
import { FaRocket, FaCubes, FaShieldAlt, FaHeadset, FaExchangeAlt, FaUserFriends } from 'react-icons/fa';

export const Features: React.FC = () => {
  const features = [
    {
      icon: <FaRocket />,
      title: 'Lightning-Fast Delivery',
      description: 'Experience the thrill of same-day delivery on select items. Your tech cravings, satisfied at the speed of light.',
    },
    {
      icon: <FaCubes />,
      title: 'Vast Product Range',
      description: 'From pocket-sized gadgets to home-filling appliances, we\'ve got every tech need covered under one digital roof.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Ironclad Guarantee',
      description: 'Shop with confidence. Our 30-day money-back guarantee and extended warranties have got you covered.',
    },
    {
      icon: <FaHeadset />,
      title: '24/7 Expert Support',
      description: 'Tech troubles? Our round-the-clock support team of certified tech experts is just a click away.',
    },
    {
      icon: <FaExchangeAlt />,
      title: 'Hassle-Free Returns',
      description: 'Changed your mind? No problem. Enjoy easy, no-questions-asked returns within 30 days of purchase.',
    },
    {
      icon: <FaUserFriends />,
      title: 'Community-Driven',
      description: 'Join our vibrant tech community. Share reviews, tips, and be part of exciting tech discussions and events.',
    },
  ];

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-black">
          Why Choose <span className="border-b-4 border-black">Gizmo</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          <h1 className='absolute z-0 -left-10 -top-40 text-[30rem] tracking-tighter opacity-10'>Gizmo</h1>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-gray-200 hover:border-black group z-10 hover:cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4 text-black group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black">{feature.title}</h3>
              </div>
              <p className="text-gray-600 group-hover:text-black transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <a 
            href="#" 
            className="inline-block bg-black text-white font-semibold py-3 px-10 rounded-md hover:opacity-80 transition-opacity duration-300"
          >
            Join the Gizmo Family
          </a>
        </div>
      </div>
    </section>
  );
};
