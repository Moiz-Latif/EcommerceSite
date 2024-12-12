import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  content: string;
  avatar: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "John Doe",
    content: "I've never had such a smooth online shopping experience. The products are top-notch!",
    avatar: "/images/avatar1.jpg"
  },
  {
    id: 2,
    name: "Jane Smith",
    content: "The customer service is exceptional. They went above and beyond to help me.",
    avatar: "/images/avatar2.jpg"
  },
  {
    id: 3,
    name: "Mike Johnson",
    content: "Great prices and fast shipping. I'll definitely be a returning customer!",
    avatar: "/images/avatar3.jpg"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="w-full bg-black text-stone-50 font-roboto px-16 py-12">
      <h2 className="text-5xl font-medium mb-8 text-center">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mockTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-stone-800 rounded-lg p-6 shadow-md">
            <p className="text-lg mb-4">"{testimonial.content}"</p>
            <div className="flex items-center">
              <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
              <span className="font-medium">{testimonial.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

