import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { addToWishlistAsync, deleteFromWishListAsync } from '../state/features/wishSlice';
import bg from '../assets/fabian-albert-wJ_clVY0K-A-unsplash.jpg';
import { addToCartAsync, updateCartAsync } from "../state/features/cartSlice";

export const ProductsPage: React.FC = () => {
    const { CategoryId, UserId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state for devices and categories
    const devices = useSelector((state: RootState) => state.device.devices);
    const categories = useSelector((state: RootState) => state.category.categories);
    const wishlist = useSelector((state: RootState) => state.wishList.list);
    const cart = useSelector((state: RootState) => state.cart.list);

    // Filter devices based on the selected category
    //@ts-ignore
    const filteredDevices = devices.filter((device) => device.categoryid === CategoryId);

    // Function to update the categoryId in the URL without reloading the page
    const changeCategory = (categoryId: string) => {
        navigate(`/UserDashboard/${UserId}/Category/${categoryId}`);
    };

    const toggleWishlist = (deviceId: string) => {
        const isInWishlist = wishlist.some(item => item === deviceId);
        if (isInWishlist) {
            //@ts-ignore
            dispatch(deleteFromWishListAsync({ productId: deviceId, UserId: UserId }));
        } else {
            //@ts-ignore
            dispatch(addToWishlistAsync({ productId: deviceId, UserId: UserId }));
        }
    };

    const toggleCart = (deviceId: string) => {
        const CartItem = cart.find((item) => item.DeviceId === deviceId);
        if (CartItem) {
            const Quantity = CartItem.Quantity + 1;

            //@ts-ignore
            dispatch(updateCartAsync({ UserId, Quantity: Quantity, DeviceId: deviceId }));
        } else {
            //@ts-ignore
            dispatch(addToCartAsync({ UserId, Quantity: 1, DeviceId: deviceId }));
        }
    };

    return (
        <div className="font-roboto">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-black to-gray-800 text-white py-20 px-4">
                <img src={bg} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-wide text-white animate-pulse">
                        Discover Tech at Its Best
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
                        Shop gadgets, laptops, and accessories with a sleek, modern touch.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Category Selection */}
                <div className="mb-12 text-center">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {categories.map((category: any) => (
                            <button
                                //@ts-ignore
                                onClick={() => changeCategory(category.CategoryId)}
                                //@ts-ignore
                                key={category.CategoryId}
                                //@ts-ignore
                                className={`px-6 py-2 rounded-full text-sm md:text-base font-medium transition-transform transform duration-300 ease-in-out border ${category.CategoryId === CategoryId
                                    ? "bg-gradient-to-r from-black to-gray-800 text-white border-white shadow-lg scale-110"
                                    : "bg-white text-black hover:bg-gray-100 border-black"
                                    }`}
                            >
                                {category.CategoryName}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {filteredDevices.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                        {filteredDevices.map((device) => (
                            <div
                                key={device.DeviceId}
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg flex flex-col justify-between group border-[1px] border-gray-200 "
                            >
                                {/* Image Section */}
                                <div
                                    className="relative cursor-pointer h-64"
                                    onClick={() => navigate(`/UserDashboard/${UserId}/Device/${device.DeviceId}`)}
                                >
                                    <img
                                        src={device.Images[1]}
                                        alt={device.DeviceName}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(device.DeviceId);
                                        }}
                                        className="absolute top-4 right-4 z-30 p-2 rounded-full shadow-md hover:shadow-lg transition-all"
                                    >
                                        <Heart
                                            //@ts-ignore
                                            className={`w-6 h-6 ${
                                                //@ts-ignore
                                                wishlist.some((item) => item === device.DeviceId)
                                                    ? "fill-red-500 text-red-500"
                                                    : "text-gray-400"
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Content Section */}
                                <div className="px-6 pt-2 pb-3 flex flex-col bg-ghost_white-700">
                                    {/* Title and Price */}
                                    <h1 className="text-lg font-normal text-black">${device.Price.toFixed(2)}</h1>
                                    <h2 className="text-lg font-semibold text-black tracking-tight group-hover:text-gray-800 transition-colors">
                                        {device.DeviceName}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                                        {device.Description}
                                    </p>

                                    {/* Add to Cart Button */}
                                    <button
                                        className="mt-auto px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-md text-sm hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"
                                        aria-label="Add to cart"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCart(device.DeviceId);
                                        }}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">
                        No products available in this category.
                    </p>
                )}


                {/* Pagination (simplified) */}
                <div className="mt-10 flex justify-center gap-4">
                    <button className="w-28 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:opacity-90 transition-opacity">Previous</button>
                    <button className="w-28 py-2 bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:opacity-90 transition-opacity">Next</button>
                </div>
            </div>
        </div>
    );
};
