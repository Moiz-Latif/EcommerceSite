import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { addToWishList, removeFromWishList } from '../state/features/wishSlice';
import bg from '../assets/fabian-albert-wJ_clVY0K-A-unsplash.jpg';
import { addToCart, removeFromCart } from "../state/features/cartSlice";

export const ProductsPage: React.FC = () => {
    const { CategoryId, UserId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state for devices and categories
    const devices = useSelector((state: RootState) => state.device.devices);
    const categories = useSelector((state: RootState) => state.category.categories);
    const wishlist = useSelector((state:RootState)=> state.wishList.list);
    const Cart = useSelector((state:RootState)=> state.cart.list);


    // Filter devices based on the selected category
    //@ts-ignore
    const filteredDevices = devices.filter((device) => device.categoryid === CategoryId);

    // Function to update the categoryId in the URL without reloading the page
    const changeCategory = (categoryId: string) => {
        navigate(`/UserDashboard/${UserId}/Category/${categoryId}`);
    };

    const toggleWishList =(deviceId : string) => {
        //@ts-ignore
        const isInWishlist = wishlist.some(item => item.DeviceId === deviceId && item.inWishList);
        if(isInWishlist){
            dispatch(removeFromWishList(deviceId));
        } else {
            dispatch(addToWishList(deviceId));
        }
    }

    const toggleCart =(deviceId : string) => {
        //@ts-ignore
        const isInCart = Cart.some(item => item.DeviceId === deviceId && item.inCart);
        if(isInCart){
            dispatch(removeFromCart(deviceId));
        } else {
            dispatch(addToCart(deviceId));
        }
    }

    return (
        <div className="font-roboto">
            {/* Hero Section */}
            <div className="relative bg-black text-white py-20 px-4">
                <img src={bg} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-70"/>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-wide text-white">
                        Discover Tech at Its Best
                    </h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto text-white">
                        Shop gadgets, laptops, and accessories with a sleek, modern touch.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                {/* Category Selection */}
                <div className="mb-12 text-center">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category : any) => (
                            <button
                            //@ts-ignore
                                onClick={() => changeCategory(category.CategoryId)}
                                //@ts-ignore
                                key={category.CategoryId}
                                //@ts-ignore
                                className={`px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ease-in-out border ${category.CategoryId === CategoryId
                                    ? "bg-black text-white border-white shadow-lg"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredDevices.map((device) => (
                            <div
                                key={device.DeviceId}
                                className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col justify-between"
                            >
                                <div className="relative">
                                    <img
                                        src={device.Images[1]}
                                        alt={device.DeviceName}
                                        className="w-full h-48 object-contain"
                                    />
                                    <button
                                        onClick={()=>toggleWishList(device.DeviceId)}
                                        className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white shadow-md transition-colors duration-300"

                                    >
                                        <Heart
                                        //@ts-ignore
                                        className={`w-6 h-6 ${
                                            //@ts-ignore
                                            wishlist.some((item) => item.DeviceId === device.DeviceId && item.inWishList)
                                              ? "fill-red-500 text-red-500"
                                              : "text-gray-400"
                                        }`}
                                        
                                        />
                                    </button>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h2 className="text-lg font-bold text-black mb-2">{device.DeviceName}</h2>
                                    <p className="text-sm text-gray-700 mb-3 line-clamp-3 flex-grow">{device.Description}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-xl font-bold text-black">${device.Price.toFixed(2)}</span>
                                        <button
                                            className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors duration-300 flex items-center"
                                            aria-label="Add to cart" onClick={()=>toggleCart(device.DeviceId)}
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            {Cart.some((item : any)=>item.DeviceId === device.DeviceId && item.inCart) ? "Added to Cart" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">No products available in this category.</p>
                )}

                {/* Pagination (simplified) */}
                <div className="mt-10 flex justify-center gap-4">
                    <button className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300">Previous</button>
                    <button className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300">Next</button>
                </div>
            </div>
        </div >
    );
};
