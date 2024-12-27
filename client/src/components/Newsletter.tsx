import React from 'react';
import { motion } from 'framer-motion';
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
    <section className="bg-gradient-to-b from-white to-gray-100 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-black"
        >
          Why Choose <span className="relative">
            Gizmo
            <span className="absolute bottom-0 left-0 w-full h-1 bg-black transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
          </span>?
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute -z-10 -left-1/4 -top-1/4 text-[20rem] font-bold text-black tracking-tighter opacity-10 pointer-events-none select-none"
        >
          Gizmo
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-black group cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-4 text-black group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
              </div>
              <p className="text-gray-600 group-hover:text-black transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a 
            href="#" 
            className="inline-block bg-black text-white font-semibold py-3 px-10 rounded-full hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
          >
            Join the Gizmo Family
          </a>
        </motion.div>
      </div>
    </section>
  );
};

