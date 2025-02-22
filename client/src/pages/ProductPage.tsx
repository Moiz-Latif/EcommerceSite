import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useParams } from "react-router-dom";
import { updateCartAsync } from "../state/features/cartSlice";
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart, Star, ThumbsUp, ThumbsDown, MoreVertical } from 'lucide-react';
import axios from "axios";

export const ProductPage: React.FC = () => {
    const { DeviceId, UserId } = useParams();
    const devices = useSelector((state: RootState) => state.device.devices);
    const Cart = useSelector((state: RootState) => state.cart.list);
    const device = devices.find((d) => d.DeviceId === DeviceId);
    const cart = device ? Cart.find((item) => item.DeviceId === device.DeviceId) : undefined;
    const dispatch = useDispatch();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
    const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState("");
    const [existingReview, setExistingReview] = useState<{ rating: number; description: string, date: string } | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [UserData, setUserData] = useState<{ UserImg: string, Username: string } | null>(null);

    useEffect(() => {
        if (DeviceId && UserId) {
            async function getReviewData() {
                try {
                    const response = await axios.get(
                        `http://localhost:3000/UserDashboard/${UserId}/Device/${DeviceId}/Get`
                    );
                    if (response && response.data) {
                        setUserData({ UserImg: response.data.UserImg, Username: response.data.UserUsername });
                        console.log(response.data.UserImg)
                        const dateStr = response.data.getReview.createdAt;
                        const dateObj = new Date(dateStr);
                        const options = { year: '2-digit' as const, month: '2-digit' as const, day: '2-digit' as const };
                        const formattedDate = dateObj.toLocaleDateString('en-GB', options).replace(/-/g, '/');
                        setExistingReview({
                            rating: response.data.getReview.rating,
                            description: response.data.getReview.description,
                            date: formattedDate
                        });
                        setUserRating(response.data.getReview.rating);
                        setUserReview(response.data.getReview.description);
                    }
                } catch (error) {
                    console.error("Failed to fetch review data:", error);
                }
            }
            getReviewData();
        }
    }, [DeviceId, UserId]);

    if (!device) {
        return <div className="text-center py-10 text-gray-700">Device not found</div>;
    }

    const nextImage = () => {
        setAnimationDirection('right');
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex + 1 >= device.Images.length ? 0 : prevIndex + 1
            );
            setAnimationDirection(null);
        }, 500);
    };

    const prevImage = () => {
        setAnimationDirection('left');
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex - 1 < 0 ? device.Images.length - 1 : prevIndex - 1
            );
            setAnimationDirection(null);
        }, 500);
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

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3000/UserDashboard/${UserId}/Device/${device.DeviceId}/Create`, {
                rating: userRating,
                review: userReview,
                date: Date()
            });

            setExistingReview({ rating: userRating, description: userReview, date: new Date().toISOString().split('T')[0] });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to submit review:", error);
        }
    };

    const handleEditReview = () => {
        setIsEditing(true);
    };

    const handleDeleteReview = async () => {
        try {
            await axios.delete(`http://localhost:3000/UserDashboard/${UserId}/Device/${device.DeviceId}/Delete`);
            setExistingReview(null);
            setUserRating(0);
            setUserReview("");
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    return (
        <div className="bg-white text-black min-h-screen font-roboto pt-20 px-4 sm:px-6 lg:pl-16 lg:pr-20">
            <div className="max-w-7xl mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Gallery Card */}
                    <div className="border border-gray-200 p-5 rounded-3xl shadow-md bg-ghost_white-800">
                        <h2 className="text-xl font-medium mb-4">Product Images</h2>
                        <div className="relative overflow-hidden h-96 rounded-3xl border border-gray-200">
                            <img
                                src={device.Images[currentImageIndex]}
                                alt={device.DeviceName}
                                className={`absolute w-full h-full object-cover rounded-lg shadow-md transition-transform duration-500 ease-in-out ${animationDirection === 'right' ? 'translate-x-full opacity-0' : ''
                                    } ${animationDirection === 'left' ? '-translate-x-full opacity-0' : ''}`}
                                onAnimationEnd={() => setAnimationDirection(null)}
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

                {/* Specs and Reviews Tabs */}
                <div className="mt-8">
                    <div className="flex justify-center mb-4">
                        <button
                            className={`px-6 py-2 rounded-l-md ${activeTab === 'specs' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                            onClick={() => setActiveTab('specs')}
                        >
                            Specifications
                        </button>
                        <button
                            className={`px-6 py-2 rounded-r-md ${activeTab === 'reviews' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Reviews
                        </button>
                    </div>

                    {activeTab === 'specs' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(device.Specifications).map(([key, value], index) => (
                                <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                                    <h3 className="text-lg font-semibold capitalize mb-2">
                                        {key.replace("_", " ")}
                                    </h3>
                                    <p className="text-gray-700">
                                        {typeof value === "object"
                                            ? JSON.stringify(value, null, 2)
                                            : value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="bg-white text-black font-sans p-4 md:p-8">
                            <div className="max-w-7xl mx-auto">

                                {/* Add/Edit Review Form */}
                                <div className="mb-8 bg-gray-100 p-4 rounded-lg">
                                    <div className="flex items-start space-x-4">
                                        <img src={UserData?.UserImg} alt={UserData?.Username} className="w-10 h-10 rounded-full" />
                                        <div className="flex-grow">
                                            <textarea
                                                rows={3}
                                                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                value={userReview}
                                                onChange={(e) => setUserReview(e.target.value)}
                                                placeholder="Add a public comment..."
                                            ></textarea>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={20}
                                                            className={`cursor-pointer transition-all ${star <= userRating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                                                            fill={star <= userRating ? "currentColor" : "none"}
                                                            onClick={() => setUserRating(star)}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => { setUserReview(''); setUserRating(0); }}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSubmitReview}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {isEditing ? "Update" : "Comment"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Display Reviews */}
                                <div className="space-y-6">
                                    {customerReviews.map((review) => (
                                        <div key={review.id} className="flex space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    {review.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center mb-1">
                                                    <span className="font-medium text-sm mr-2">{review.name}</span>
                                                    <span className="text-gray-500 text-xs">{review.date}</span>
                                                </div>
                                                <div className="flex items-center mb-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={16}
                                                            className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}
                                                            fill={star <= review.rating ? "currentColor" : "none"}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-sm mb-2">{review.comment}</p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <button className="flex items-center space-x-1 hover:text-blue-600">
                                                        <ThumbsUp size={16} />
                                                    </button>
                                                    <button className="flex items-center space-x-1 hover:text-blue-600">
                                                        <ThumbsDown size={16} />
                                                    </button>
                                                    <button className="hover:text-blue-600">Reply</button>
                                                    <button className="hover:text-blue-600">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

