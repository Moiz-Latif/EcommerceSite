import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Grid, List, Search } from 'lucide-react';

export const ProductsPage: React.FC = () => {
    const { CategoryId, UserId } = useParams();
    const navigate = useNavigate();
    const categories = useSelector((state: RootState) => state.category.categories);
    const devices = useSelector((state: RootState) => state.device.devices);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('featured');

    // Filter devices that match the current categoryId
    //@ts-ignore
    const filteredDevices = devices.filter((device) => device.categoryid === CategoryId);

    // Function to update the categoryId in the URL without reloading the page
    function changeCategory(categoryId: string) {
        navigate(`/UserDashboard/${UserId}/Category/${categoryId}`);
    }

    return (
        <div className="font-roboto">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        Tech Deals, Delivered Fast!
                    </h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                        Shop the latest gadgets, smartphones, laptops, and accessories at unbeatable prices.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Category Selection */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Categories</h2>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category: any) => (
                            <button
                                onClick={() => changeCategory(category.CategoryId)}
                                key={category.CategoryId}
                                className={`
                                    px-6 py-2 rounded-full text-sm md:text-base font-medium
                                    transition-all duration-300 ease-in-out
                                    ${category.CategoryId === CategoryId
                                        ? "bg-black text-white shadow-lg"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                    }
                                `}
                            >
                                {category.CategoryName}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters and Sorting */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 border rounded-full w-full md:w-64"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border rounded-full px-4 py-2 pr-8 cursor-pointer"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="newest">Newest</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {filteredDevices.length > 0 ? (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                        {filteredDevices.map((device) => (
                            <div
                                key={device.DeviceId}
                                className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl ${viewMode === 'grid' ? '' : 'flex'}`}
                            >
                                <img
                                    src={device.Images[1]}
                                    alt={device.DeviceName}
                                    className={`w-full object-contain ${viewMode === 'grid' ? 'h-48' : 'w-1/3 h-auto'}`}
                                />
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{device.DeviceName}</h2>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{device.Description}</p>
                                        {device.Description.length > 150 && (
                                            <button className="text-blue-600 text-sm font-medium hover:underline">Read More</button>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-2xl font-bold text-blue-600">${device.Price.toFixed(2)}</span>
                                        <button className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors duration-300">
                                            Add to Cart
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
                <div className="mt-8 flex justify-center">
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full mr-2 hover:bg-gray-300 transition-colors duration-300">Previous</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-300">Next</button>
                </div>
            </div>
        </div>
    );
};
