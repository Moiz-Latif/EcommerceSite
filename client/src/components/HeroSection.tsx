import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import HeadPhone from '../assets/HeadPhones.jpg';
import '../index.css';
import { setCategories } from '../state/features/categoriesSlice';
import { RootState } from '../state/store';
import { setDevices } from '../state/features/devicesSlice';

export const HeroSection: React.FC = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.category.categories);
    const devices = useSelector((state: RootState) => state.device.devices);

    useEffect(() => {
        if (categories.length === 0) {
            const getCategories = async () => {
                try {
                    const response = await axios.get("http://localhost:3000/AdminDashboard/GetCategory");
                    if (response && response.data) {
                        dispatch(setCategories(response.data));
                    }
                } catch (error) {
                    console.error("Error fetching categories:", error);
                }
            };
            getCategories();
        }
    }, [dispatch, categories.length]);

    useEffect(() => {
        if (devices.length === 0) {
            const getDevices = async () => {
                try {
                    const response = await axios.get("http://localhost:3000/AdminDashboard/GetDevices");
                    if (response && response.data) {
                        console.log(response.data.fixedDevices);
                        dispatch(setDevices(response.data.fixedDevices));
                    }
                } catch (error) {
                    console.error("Error fetching devices:", error);
                }
            };
            getDevices();
        }
    }, [dispatch, devices.length]);

    return (
        <div className='w-full min-h-screen bg-ghost_white-900 font-roboto px-4 sm:px-6 md:px-8 lg:px-16 flex flex-col items-center justify-start relative overflow-hidden'>
            {/* Main Content */}
            <div className='max-w-4xl w-full flex flex-col justify-center items-center text-center relative z-20'>
                {/* Title and Description at the top */}
                <h1 className='text-4xl sm:text-5xl md:text-5xl font-medium text-primary-dark tracking-tighter mb-4 z-40 mt-24'>
                    Experience Media Like Never Before
                </h1>
                <h2 className='text-xl sm:text-2xl text-stone-600 mb-4 tracking-widest z-40'>
                    Buy and sell the latest gadgets with ease.<br /> Discover your next favorite device today!
                </h2>

                {/* Buttons */}
                <div className='flex flex-col sm:flex-row gap-6 justify-center z-40'>
                    <button className='w-64 h-12 border-2 border-primary-dark rounded-lg bg-black text-ghost_white-900 text-xl font-semibold tracking-wide hover:bg-primary-dark hover:text-white transition-all duration-300 transform hover:scale-105 active:opacity-80 shadow-md hover:shadow-lg'>
                        Shop Now
                    </button>
                    <button className='w-64 h-12 border-2 border-primary-dark rounded-lg bg-primary-light text-primary-dark text-xl font-semibold tracking-wide hover:bg-primary-dark hover:text-primary-light transition-all duration-300 transform hover:scale-105 active:opacity-80 shadow-md hover:shadow-lg'>
                        Contact Us
                    </button>
                </div>


                {/* Product Image */}
                <div className='relative overflow-hidden -mt-20'>
                    <img src={HeadPhone} alt="Headphone" className="w-[30rem] relative z-20" />
                </div>

                {/* Enlarged Company Name at the bottom */}
                <div className='text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[20rem] font-bold text-primary-dark z-30 opacity-5 tracking-widest -mt-72'>
                    GIZMO
                </div>
            </div>
        </div>
    );
};
