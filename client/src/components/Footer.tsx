import React from 'react';
import { Facebook, Twitter, Instagram, YoutubeIcon as YouTube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-stone-50 font-roboto py-12 px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-medium">Your E-commerce Store</h3>
          <p className="text-stone-300">Experience media like never before with our cutting-edge devices.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-stone-300 transition-colors duration-300">
              <Facebook size={24} />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="hover:text-stone-300 transition-colors duration-300">
              <Twitter size={24} />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="hover:text-stone-300 transition-colors duration-300">
              <Instagram size={24} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="hover:text-stone-300 transition-colors duration-300">
              <YouTube size={24} />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-medium mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Shop</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-medium mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">FAQ</a></li>
            <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-medium mb-4">Contact Us</h4>
          <address className="not-italic">
            <p>123 Tech Street</p>
            <p>Gadget City, TC 12345</p>
            <p>Email: info@yourecommercestore.com</p>
            <p>Phone: (123) 456-7890</p>
          </address>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-stone-700 text-center">
        <p>&copy; {new Date().getFullYear()} Your E-commerce Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

