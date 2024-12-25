import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useParams } from "react-router-dom";
import { updateCartAsync } from "../state/features/cartSlice";
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart, Star, ChevronDown, ChevronUp } from 'lucide-react';

export const ProductPage: React.FC = () => {
    const { DeviceId } = useParams();
    const devices = useSelector((state: RootState) => state.device.devices);
    const Cart = useSelector((state: RootState) => state.cart.list);
    const device = devices.find((d) => d.DeviceId === DeviceId);
    const cart = device ? Cart.find((item) => item.DeviceId === device.DeviceId) : undefined;
    const dispatch = useDispatch();
    const { UserId } = useParams();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
    const [isSpecsOpen, setIsSpecsOpen] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");

    if (!device) {
        return <div className="text-center py-10 text-gray-700">Device not found</div>;
    }

    const nextImage = () => {
        setAnimationDirection('right');
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex + 1 >= device.Images.length ? 0 : prevIndex + 1
            );
            setAnimationDirection(null); // Reset after transition
        }, 500); // Match the animation duration
    };

    const prevImage = () => {
        setAnimationDirection('left');
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex - 1 < 0 ? device.Images.length - 1 : prevIndex - 1
            );
            setAnimationDirection(null); // Reset after transition
        }, 500); // Match the animation duration
    };


    const averageRating = 4.5; // Mock data for average rating

    function toggleIncrementCart(deviceId: string) {
        const CartItem = Cart.find((item) => item.DeviceId === deviceId);
        if (CartItem) {
            const Quantity = CartItem.Quantity + 1;
            //@ts-ignore
            dispatch(updateCartAsync({ UserId, Quantity: Quantity, DeviceId: deviceId }));
        }
    };
    function toggleDecrementCart(deviceId: string) {
        const CartItem = Cart.find((item) => item.DeviceId === deviceId);
        if (CartItem) {
            const Quantity = CartItem.Quantity - 1;
            //@ts-ignore
            dispatch(updateCartAsync({ UserId, Quantity: Quantity, DeviceId: deviceId }));
        }
    }
    const customerReviews = [
        { id: 1, name: "John Doe", rating: 5, comment: "Great product! Highly recommended.", date: "2023-06-01" },
        { id: 2, name: "Jane Smith", rating: 4, comment: "Good value for money, but could be improved.", date: "2023-05-28" },
        { id: 3, name: "Mike Johnson", rating: 3, comment: "Decent product, but not as expected.", date: "2023-05-25" },
    ];

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the review to your backend
        console.log("Submitting review:", { rating: userRating, comment: userReview });
        // Reset form
        setUserRating(0);
        setUserReview("");
    };

    return (
        <div className="bg-white text-black min-h-screen font-roboto pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Gallery Card */}
                    <div className="border border-gray-200 p-5 rounded-3xl shadow-md bg-ghost_white-800">
                        <h2 className="text-xl font-medium mb-4">Product Images</h2>
                        <div className="relative overflow-hidden h-96 rounded-3xl border border-gray-200">
                            <img
                                src={device.Images[currentImageIndex]}
                                alt={device.DeviceName}
                                className={`w-full h-full object-cover rounded-lg shadow-md transition-transform duration-500 ease-in-out ${animationDirection === 'right' ? 'translate-x-full opacity-0' : ''
                                    } ${animationDirection === 'left' ? '-translate-x-full opacity-0' : ''}`}
                                onAnimationEnd={() => setAnimationDirection(null)} // Ensure reset
                            />
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-200 z-10"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition duration-200 z-10"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        <div className="flex mt-4 space-x-2 justify-center">
                            {device.Images.slice(0, 4).map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`${device.DeviceName} thumbnail ${index + 1}`}
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer shadow ${index === currentImageIndex
                                        ? "border-2 border-black"
                                        : "border border-gray-200"
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* General Info Card */}
                    <div className="border border-gray-200 p-5 rounded-3xl shadow-md">
                        <h2 className="text-xl font-medium mb-4">General Information</h2>
                        <p className="text-lg text-gray-600 mb-2">
                            {device.Brand} {device.Model}
                        </p>
                        <h1 className="text-3xl font-bold mb-2">{device.DeviceName}</h1>
                        <p className="text-4xl font-normal font-roboto mb-4">
                            ${device.Price.toFixed(2)}
                        </p>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed text-justify">
                                {device.Description}
                            </p>
                        </div>
                        <div className="flex items-center mb-4">
                            <span className="text-lg font-semibold mr-2">Average Rating:</span>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={20}
                                        fill={star <= averageRating ? "#FFD700" : "none"}
                                        stroke="#FFD700"
                                    />
                                ))}
                            </div>
                            <span className="ml-2">({averageRating.toFixed(1)})</span>
                        </div>
                        <div className="flex items-center mb-4">
                            <span className="mr-4 font-semibold">Quantity:</span>
                            <div className="flex border border-gray-300 rounded-md">
                                <button
                                    onClick={() => {
                                        if (cart && cart.Quantity > 1) {
                                            toggleDecrementCart(device.DeviceId);
                                        }
                                    }}
                                    disabled={cart?.Quantity === 1}
                                    className={`px-3 py-2 transition ${cart?.Quantity === 1
                                        ? "opacity-70 cursor-not-allowed"
                                        : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="number"
                                    value={cart?.Quantity}
                                    className="w-16 pl-3 text-center border-x border-gray-300 focus:outline-none"
                                    readOnly
                                />
                                <button
                                    onClick={() => toggleIncrementCart(device.DeviceId)}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button className="flex-1 bg-black text-white py-3 px-6 rounded-md flex items-center justify-center hover:bg-gray-800 transition duration-300">
                                <ShoppingCart size={20} className="mr-2" />
                                Add to Cart
                            </button>
                            <button className="flex-1 bg-white text-black py-3 px-6 rounded-md border-2 border-black hover:bg-gray-100 transition duration-300">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Specifications Dropdown */}
                <div className="mt-8 border border-gray-200 rounded-3xl shadow-md overflow-hidden">
                    <button
                        onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                        className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                        <h2 className="text-xl font-medium">Specifications</h2>
                        {isSpecsOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                    {isSpecsOpen && (
                        <div className="p-5">
                            <table className="w-full border-collapse">
                                <tbody>
                                    {Object.entries(device.Specifications).map(([key, value], index) => (
                                        <tr key={key} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                            <td className="py-2 px-4 border-b border-gray-200 font-semibold capitalize">
                                                {key.replace("_", " ")}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {typeof value === "object"
                                                    ? JSON.stringify(value, null, 2)
                                                    : value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full my-12 border-[1px] border-gray-200 rounded-3xl px-5 shadow-lg bg-ghost_white-800">
                <div className="w-full my-12">
                    <h1 className="text-4xl font-bold mb-8 text-center">Customer Reviews</h1>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Add a review form */}
                        <div className="lg:w-1/2 p-6 border border-gray-700 rounded-xl bg-white">
                            <h2 className="text-3xl font-semibold mb-6 text-black">Write a Review</h2>
                            <form onSubmit={handleSubmitReview}>
                                {/* Star Rating */}
                                <div className="mb-6">
                                    <label className="block text-md font-medium text-black mb-2">
                                        Your Rating <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={28}
                                                className={`cursor-pointer transition-all ${star <= userRating ? "text-yellow-400 scale-110" : "text-gray-600"
                                                    }`}
                                                fill={star <= userRating ? "currentColor" : "none"}
                                                onClick={() => setUserRating(star)}
                                                onMouseEnter={() => setUserRating(star)}
                                                onMouseLeave={() => setUserRating(userRating)}
                                                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                            />
                                        ))}
                                    </div>
                                    {userRating === 0 && (
                                        <p className="text-sm text-red-500 mt-2">Please select a rating.</p>
                                    )}
                                </div>

                                {/* Review Text */}
                                <div className="mb-6">
                                    <label htmlFor="review" className="block text-md font-medium text-black mb-2">
                                        Your Review <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="review"
                                        rows={4}
                                        className="w-full px-2 py-3 text-black bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black "
                                        value={userReview}
                                        onChange={(e) => setUserReview(e.target.value)}
                                        placeholder="Write your review here..."
                                        required
                                        aria-required="true"
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full px-6 py-3 bg-black text-lg tracking-wide text-white rounded-lg shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white transition-all"
                                >
                                    Submit Review
                                </button>
                            </form>
                        </div>

                        {/* Display customer reviews */}
                        <div className="lg:w-1/2 p-6 border border-gray-700 rounded-xl bg-white">
                            <h2 className="text-3xl font-semibold mb-6 text-black">Recent Reviews</h2>
                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
                                {customerReviews.map((review) => (
                                    <div key={review.id} className="p-4 bg-gray-100 rounded-lg shadow">
                                        <div className="flex items-center mb-2">
                                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                                {/* <User size={20} className="text-gray-300" /> */}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-lg text-black">{review.name}</span>
                                                <div className="flex items-center">
                                                    <div className="flex mr-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                size={16}
                                                                className={star <= review.rating ? "text-yellow-400" : "text-gray-600"}
                                                                fill="currentColor"
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-gray-400">{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-black mt-2">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

