import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

interface Device {
    DeviceId: string;
    DeviceName: string;
    category: string;
    Quantity: number;
    Price: number;
    Specifications: Record<string, string>;
    Description: string;
    Brand: string;
    Images: string[];
}

export const EditDevice: React.FC = () => {
    const [device, setDevice] = useState<Device | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newSpec, setNewSpec] = useState({ key: '', value: '' });
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeviceDetails = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3000/AdminDashboard/GetDevice/${id}`);
                const { fixedDevices, categories } = response.data;
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
                setError('Failed to fetch device details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeviceDetails();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDevice(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSpecificationChange = (key: string, value: string) => {
        setDevice(prev => {
            if (!prev) return null;
            return {
                ...prev,
                Specifications: {
                    ...prev.Specifications,
                    [key]: value
                }
            };
        });
    };

    
    const handleAddSpecification = () => {
        if (newSpec.key && newSpec.value) {
            setDevice(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    Specifications: {
                        ...prev.Specifications,
                        [newSpec.key]: newSpec.value
                    }
                };
            });
            setNewSpec({ key: '', value: '' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3000/AdminDashboard/UpdateDevice/${id}`, device);
            navigate('/AdminDashboard/Devices');
        } catch (error) {
            console.error('Error updating device:', error);
            setError('Failed to update device. Please try again.');
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === (device?.Images.length ?? 0) - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? (device?.Images.length ?? 1) - 1 : prevIndex - 1
        );
    };

    const addImage = () => {
        if (newImageUrl && device) {
            setDevice({
                ...device,
                Images: [...device.Images, newImageUrl]
            });
            setNewImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        if (device) {
            const newImages = device.Images.filter((_, i) => i !== index);
            setDevice({
                ...device,
                Images: newImages
            });
            if (currentImageIndex >= newImages.length) {
                setCurrentImageIndex(newImages.length - 1);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error || !device) {
        return <div className="text-center text-2xl text-gray-600 pl-52 pt-20">{error || 'Device not found'}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen pl-52 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Edit Device: {device.DeviceName}
                        </h2>
                        <button
                            type="button"
                            onClick={() => navigate('/AdminDashboard/Devices')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Devices
                        </button>
                    </div>

                    {/* Image Carousel */}
                    <div className="relative h-96 bg-gray-200">
                        {device.Images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Device ${index + 1}`}
                                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            type="button"
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Thumbnail Navigation and Image Management */}
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex flex-wrap justify-center gap-2">
                            {device.Images.map((image, index) => (
                                <div key={index} className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-16 h-16 border-2 ${
                                            index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                                        } focus:outline-none`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex items-center">
                            <input
                                type="text"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="Enter new image URL"
                                className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={addImage}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Image
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-200">
                        <dl className="divide-y divide-gray-200">
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Device Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="text"
                                        name="DeviceName"
                                        value={device.DeviceName}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Category</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="text"
                                        name="category"
                                        value={device.category}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="number"
                                        name="Quantity"
                                        value={device.Quantity}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Price</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="number"
                                        name="Price"
                                        value={device.Price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Description</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <textarea
                                        name="Description"
                                        value={device.Description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <input
                                        type="text"
                                        name="Brand"
                                        value={device.Brand}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </dd>
                            </div>
                            <div className="px-4 py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 mb-2">Specifications</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <input
                                            type="text"
                                            value={newSpec.key}
                                            onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
                                            placeholder="New spec name"
                                            className="w-5/12 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={newSpec.value}
                                            onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                                            placeholder="New spec value"
                                            className="w-5/12 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSpecification}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="border rounded-md overflow-hidden">
                                        {Object.entries(device.Specifications).map(([key, value], index) => (
                                            <div key={key} className={`px-4 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} flex justify-between items-center`}>
                                                <input
                                                    type="text"
                                                    value={key}
                                                    onChange={(e) => {
                                                        const newKey = e.target.value;
                                                        const newSpecs = { ...device.Specifications };
                                                        delete newSpecs[key];
                                                        newSpecs[newKey] = value;
                                                        setDevice(prev => prev ? { ...prev, Specifications: newSpecs } : null);
                                                    }}
                                                    className="w-5/12 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) => handleSpecificationChange(key, e.target.value)}
                                                    className="w-5/12 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 mr-3"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/AdminDashboard/Devices')}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
