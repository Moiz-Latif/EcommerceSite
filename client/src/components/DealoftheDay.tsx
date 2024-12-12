import React, { useState, useEffect } from "react";
import { Clock } from 'lucide-react';
import { useSelector } from "react-redux";
import { RootState } from "../state/store";

interface Device {
  DeviceId: string;
  DeviceName: string;
  Price: number;
  Images: string[];
  Brand: string;
  Model: string;
}

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
    <section className="w-full min-h-screen bg-white text-black px-6 py-12 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="max-w-lg w-full text-center relative">
        <p className="text-[370px] leading-none text-gray-200 opacity-30 absolute top-[50%] -left-10 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
          {`${dealDevice.Brand}`}
        </p>

        <h2 className="text-xl font-semibold tracking-wider relative z-20">LIMITED TIME</h2>
        <h1 className="text-5xl font-bold mb-2 relative z-20">SUPER OFFER</h1>
        <h3 className="text-xl font-bold text-stone-700 relative z-30">The Deal You Can't Miss</h3>

        <img
          src={dealDevice.Images[1]}
          alt={dealDevice.DeviceName}
          className="w-64 h-auto mx-auto relative z-20 bg-none rounded-lg transition-transform duration-300 transform hover:scale-110"
        />

        <h3 className="text-2xl font-bold mb-2 relative z-20 font-roboto tracking-wide">{dealDevice.DeviceName}</h3>

        <div className="flex flex-col items-center justify-center mb-6 relative z-30">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-5xl font-bold text-black">${discountedPrice.toFixed(2)}</span>
            <span className="text-2xl text-gray-400 line-through">${dealDevice.Price.toFixed(2)}</span>
          </div>
          <div className="bg-red-500 text-white text-sm font-bold px-4 py-1 rounded-full transform -rotate-3 shadow-lg">
            20% OFF
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-base mb-8 relative z-20">
          <Clock className="w-5 h-5 text-white" />
          <div className="flex space-x-6 bg-white p-4 rounded-lg shadow-lg">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-red-700">{formatTime(value)}</span>
                <span className="text-sm font-medium uppercase tracking-wider text-gray-600">{unit}</span>
              </div>
            ))}
          </div>
        </div>


        <button className="w-full px-6 py-3 bg-black text-white text-xl font-bold rounded-lg hover:bg-gray-800 transition-all duration-300 active:opacity-75 relative z-20">
          GRAB THE DEAL
        </button>
      </div>
    </section>
  );
};

