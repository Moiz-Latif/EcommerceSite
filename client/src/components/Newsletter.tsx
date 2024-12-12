import React from 'react';

export const Features: React.FC = () => {
  const featureCards = [
    {
      title: 'Unbeatable Prices',
      description:
        'Get the best deals on the latest tech gadgets. Our prices are unmatched, ensuring you save more every time.',
      icon: '💰',
    },
    {
      title: 'Wide Range of Products',
      description:
        'From smartphones to laptops, we offer a diverse selection of tech products to meet all your needs.',
      icon: '📱',
    },
    {
      title: 'Trusted Quality',
      description:
        'Our products are thoroughly tested to ensure quality and reliability. Shop with confidence.',
      icon: '✅',
    },
  ];

  return (
    <section className="w-full bg-stone-50 font-roboto px-16 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl font-medium text-black mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {featureCards.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white border-2 border-black rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-lg text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};