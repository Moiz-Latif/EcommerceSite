import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { string } from 'zod';

interface Device {
    DeviceId: string;
    DeviceName: string;
    category: string;
    Quantity: number;
    Price: number;
    Specifications: Record<string, string>;
    Description: string;
    Brand: string;
    Images: string[]
}

export const DeviceDetails = () => {
    const [device, setDevice] = useState<Device | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeviceDetails = async () => {
            try {
                setIsLoading(true);
                console.log(id);
                const response = await axios.get(`http://localhost:3000/AdminDashboard/GetDevice/${id}`);
                const { fixedDevices, categories } = response.data;
                console.log(fixedDevices, categories);
                setDevice({
                    DeviceId: fixedDevices.DeviceId,
                    DeviceName: fixedDevices.DeviceName,
                    category: categories.CategoryName,
                    Quantity: fixedDevices.Quantity,
                    Price: fixedDevices.Price,
                    Specifications: fixedDevices.Specifications,
                    Description: fixedDevices.Description,
                    Brand: fixedDevices.Brand,
                    Images: fixedDevices.Images
                });
            } catch (error) {
                console.error('Error fetching device details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeviceDetails();
    }, [id]);
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === device!.Images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? device!.Images.length - 1 : prevIndex - 1
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!device) {
        return <div className="text-center text-2xl text-gray-600 pl-52 pt-20">Device not found</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen pl-52 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            {device.DeviceName}
                        </h2>
                        <button
                            onClick={() => navigate('/AdminDashboard/Devices')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Devices
                        </button>
                    </div>

                    {/* Image Carousel */}
                    <div className="relative">
                        <div className="overflow-hidden h-96">
                            {device.Images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${device.DeviceName} - Image ${index + 1}`}
                                    className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-300 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="flex justify-center mt-4 space-x-2 pb-4">
                        {device.Images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-16 h-16 border-2 ${index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                                    } focus:outline-none`}
                            >
                                <img
                                    src={image}
                                    alt={`${device.DeviceName} - Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover z-40"
                                />
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Category</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.category}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.Quantity}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Price</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${device.Price.toFixed(2)}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.Description}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{device.Brand}</dd>
                            </div>

                            <div className="bg-white px-4 py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 mb-2">Specifications</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    <div className="border rounded-md overflow-hidden">
                                        {device.Specifications && typeof device.Specifications === 'object' ? (
                                            Object.entries(device.Specifications).map(([key, value], index) => (
                                                <div
                                                    key={key}
                                                    className={`px-4 py-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                        }`}
                                                >
                                                    {typeof value === 'object' ? (
                                                        // Handle nested object
                                                        <div>
                                                            <span className="font-medium block">{key}:</span>
                                                            <div>
                                                                {Object.entries(value).map(([nestedKey, nestedValue]) => (
                                                                    <div key={nestedKey} className="flex justify-between">
                                                                        <span>{nestedKey}</span>
                                                                        <span>{typeof nestedValue === 'string' || typeof nestedValue === 'number' ? nestedValue : JSON.stringify(nestedValue)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                        </div>
                                                    ) : (
                                                        // Handle flat key-value pair
                                                        <div className="flex justify-between">
                                                            <span className="font-medium">{key}</span>
                                                            <span>{value}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <span>No specifications available.</span>
                                        )}
                                    </div>
                                </dd>
                            </div>

                        </dl>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mr-3" onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/AdminDashboard/Devices/EditDevice/${device.DeviceId}`)
                            }}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </button>
                        <button
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

