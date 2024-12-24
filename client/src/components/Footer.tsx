import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-black font-sans py-16 px-4 sm:px-6 lg:px-8 border-[1px] border-t-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold">Gizmo</h3>
          <p className="text-gray-600 max-w-xs">Experience technology like never before with our cutting-edge devices and unparalleled service.</p>
          <div className="flex space-x-4">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
              <a key={index} href="#" className="text-gray-400 hover:text-black transition-colors duration-300">
                <Icon size={24} />
                <span className="sr-only">{Icon.name}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {['Home', 'Shop', 'About Us', 'Contact'].map((item, index) => (
              <li key={index}>
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-6">Customer Service</h4>
          <ul className="space-y-4">
            {['FAQ', 'Shipping & Returns', 'Terms & Conditions', 'Privacy Policy'].map((item, index) => (
              <li key={index}>
                <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300">{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-center">
              <MapPin size={20} className="mr-2 text-gray-400" />
              <span>123 Tech Street, Gadget City, TC 12345</span>
            </li>
            <li className="flex items-center">
              <Mail size={20} className="mr-2 text-gray-400" />
              <a href="mailto:info@gizmo.com" className="hover:underline">info@gizmo.com</a>
            </li>
            <li className="flex items-center">
              <Phone size={20} className="mr-2 text-gray-400" />
              <a href="tel:+11234567890" className="hover:underline">(123) 456-7890</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200">
        <p className="text-center text-gray-500">&copy; {new Date().getFullYear()} Gizmo. All rights reserved.</p>
      </div>
    </footer>
  );
};