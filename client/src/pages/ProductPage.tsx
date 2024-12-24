import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart, Star } from 'lucide-react';

export const ProductPage: React.FC = () => {
    const { DeviceId } = useParams();
    const devices = useSelector((state: RootState) => state.device.devices);
    const device = devices.find((d) => d.DeviceId === DeviceId);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'info' | 'specs'>('info');
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

    if (!device) {
        return <div className="text-center py-10 text-gray-700">Device not found</div>;
    }

    const nextImage = () => {
        setAnimationDirection('right');
        setCurrentImageIndex((prevIndex) =>
            prevIndex + 1 >= device.Images.length ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setAnimationDirection('left');
        setCurrentImageIndex((prevIndex) =>
            prevIndex - 1 < 0 ? device.Images.length - 1 : prevIndex - 1
        );
    };

    const averageRating = 4.5; // Mock data for average rating

    return (
        <div className="bg-white text-black min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="relative">
                        <div className="overflow-hidden relative h-96 rounded-lg shadow-md">
                            <img
                                src={device.Images[currentImageIndex]}
                                alt={device.DeviceName}
                                className={`w-full h-full object-cover transition-transform duration-500 ${
                                    animationDirection === 'right' ? 'translate-x-full' : ''
                                } ${animationDirection === 'left' ? '-translate-x-full' : ''}`}
                                onAnimationEnd={() => setAnimationDirection(null)}
                            />
                        </div>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-200"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-200"
                        >
                            <ChevronRight size={24} />
                        </button>
                        <div className="flex mt-4 space-x-2 justify-center">
                            {device.Images.slice(0, 4).map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${device.DeviceName} thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer shadow ${
                                        index === currentImageIndex
                                            ? "border-2 border-black"
                                            : "border border-gray-200"
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <div className="flex space-x-4 mb-6">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`flex-1 py-2 px-4 rounded-md transition duration-300 ${
                                    activeTab === 'info'
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black border border-black'
                                }`}
                            >
                                General Info
                            </button>
                            <button
                                onClick={() => setActiveTab('specs')}
                                className={`flex-1 py-2 px-4 rounded-md transition duration-300 ${
                                    activeTab === 'specs'
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black border border-black'
                                }`}
                            >
                                Specifications
                            </button>
                        </div>

                        <p className="text-lg text-gray-600 mb-4">
                            {device.Brand} {device.Model}
                        </p>
                        <h1 className="text-4xl font-bold mb-2">{device.DeviceName}</h1>
                        <p className="text-3xl font-semibold mb-4">
                            ${device.Price.toFixed(2)}
                        </p>

                        {activeTab === 'info' && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">Description</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    {device.Description}
                                </p>
                                <div className="flex items-center mb-4">
                                    <span className="text-xl font-semibold mr-2">Average Rating:</span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={24}
                                                fill={star <= averageRating ? "black" : "none"}
                                                stroke="black"
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-lg">({averageRating.toFixed(1)})</span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'specs' && (
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(device.Specifications).map(([key, value]) => (
                                    <div key={key} className="mb-3">
                                        <p className="font-semibold capitalize text-gray-800">
                                            {key.replace("_", " ")}
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            {typeof value === "object"
                                                ? JSON.stringify(value, null, 2)
                                                : value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <hr className="border-t border-gray-200 my-6" />

                        {/* Quantity Selector */}
                        <div className="flex items-center mb-6">
                            <span className="mr-4 font-semibold">Quantity:</span>
                            <div className="flex border border-gray-300 rounded-md">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                >
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                                    }
                                    className="w-16 text-center border-x border-gray-300 focus:outline-none"
                                />
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-4 mb-8">
                            <button className="flex-1 bg-black text-white py-3 px-6 rounded-md flex items-center justify-center hover:bg-gray-800 transition duration-300">
                                <ShoppingCart size={20} className="mr-2" />
                                Add to Cart
                            </button>
                            <button className="flex-1 bg-white text-black py-3 px-6 rounded-md border-2 border-black hover:bg-gray-100 transition duration-300">
                                Buy Now
                            </button>
                        </div>

                        {/* Customer Review Section */}
                        <div className="text-left">
                            <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
                            <div className="flex mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={24}
                                        className="cursor-pointer"
                                        fill={star <= userRating ? "black" : "none"}
                                        stroke="black"
                                        onClick={() => setUserRating(star)}
                                    />
                                ))}
                            </div>
                            <textarea
                                value={userReview}
                                onChange={(e) => setUserReview(e.target.value)}
                                placeholder="Write your review here..."
                                className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <button className="mt-4 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300">
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
