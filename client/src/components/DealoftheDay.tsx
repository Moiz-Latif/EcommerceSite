import React, { useState, useEffect } from "react";
import { Clock, ShoppingCart } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { motion } from "framer-motion";



interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const DealOfTheDay: React.FC = () => {
  const devices = useSelector((state: RootState) => state.device.devices);
  const dealDevice = devices[0];

  const endTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, "0");

  const discountedPrice = dealDevice ? dealDevice.Price * 0.8 : 0;

  if (!dealDevice) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="w-full h-screen bg-white text-black flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-6xl w-full h-full flex flex-col md:flex-row items-center justify-center relative px-6">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0"
        >
          <h2 className="text-xl font-semibold tracking-wider text-gray-600 mb-2">LIMITED TIME OFFER</h2>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">SUPER DEAL</h1>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">The Deal You Can't Miss</h3>
          
          <div className="flex flex-col items-center md:items-start mb-6">
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-5xl md:text-6xl font-bold text-black">${discountedPrice.toFixed(2)}</span>
              <span className="text-2xl md:text-3xl text-gray-400 line-through">${dealDevice.Price.toFixed(2)}</span>
            </div>
            <div className="bg-red-500 text-white text-sm font-bold px-4 py-1 rounded-full transform -rotate-3 shadow-lg">
              20% OFF
            </div>
          </div>

          <motion.div 
            className="flex items-center space-x-2 text-base mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Clock className="w-5 h-5 text-gray-600" />
            <div className="flex space-x-4 bg-gray-100 p-4 rounded-lg shadow-inner">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-extrabold text-gray-800">{formatTime(value)}</span>
                  <span className="text-xs md:text-sm font-medium uppercase tracking-wider text-gray-600">{unit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto px-8 py-3 bg-black text-white text-xl font-bold rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>GRAB THE DEAL</span>
          </motion.button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full md:w-1/2 flex items-center justify-center relative"
        >
          <div className="absolute inset-0 bg-gray-100 rounded-full transform scale-90 opacity-50"></div>
          <motion.img
            src={dealDevice.Images[1]}
            alt={dealDevice.DeviceName}
            className="w-full max-w-md h-auto relative z-10 "
            initial={{ rotate: -5 }}
            animate={{ rotate: 5 }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.p 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[250px] font-bold text-gray-200 opacity-20 pointer-events-none select-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {dealDevice.Brand}
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
};

