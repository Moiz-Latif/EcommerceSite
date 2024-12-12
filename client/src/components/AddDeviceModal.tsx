import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

interface AddDeviceModalProps {
    onClose: () => void;
}



const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ onClose }) => {
    const [categories, setCategories] = useState([]);
    const [deviceData, setDeviceData] = useState({
        name: '',
        model: '',
        brand: '',
        quantity: '',
        category: '',
        price: '',
        description: '',
        condition: '',
        serialNumber: '',
        specifications: '',
        images: null as File[] | null,
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/AdminDashboard/getCategory`);
                if (response && response.data) {
                    setCategories(response.data);
                    console.log('Category:', response.data);
                    return response.data;
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getData();
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDeviceData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDeviceData(prev => ({ ...prev, images: Array.from(e.target.files as FileList) }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        // Append all fields to FormData
        Object.entries(deviceData).forEach(([key, value]) => {
            if (key === 'specifications') {
                // Parse specifications as JSON
                //@ts-ignore
                formData.append(key, JSON.stringify(JSON.parse(value)));
            } else if (key !== 'images') {
                //@ts-ignore
                formData.append(key, value);
            }
        });

        // Append each image file to FormData
        if (deviceData.images) {
            deviceData.images.forEach((image) => {
                formData.append(`images`, image);
            });
        }

        try {
            const response = await axios.post('http://localhost:3000/AdminDashboard/AddDevice', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(response && response.data){
                console.log('Response:', response.data);
                onClose();
                window.location.reload();
            }
          
        } catch (error) {
            console.error('Error uploading device:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Add New Device</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4" encType='multipart/form-data'>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Device Name</label>
                        <input type="text" id="name" name="name" value={deviceData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-[1px] border-gray-400 shadow-sm h-8 pl-2" required />
                    </div>
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                        <input type="text" id="model" name="model" value={deviceData.model} onChange={handleChange} className="mt-1 block w-full rounded-md border-[1px] border-gray-400 shadow-sm h-8 pl-2" required />
                    </div>
                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
                        <input type="text" id="brand" name="brand" value={deviceData.brand} onChange={handleChange} className="mt-1 block w-full rounded-md border-[1px] border-gray-400 shadow-sm h-8 pl-2" required />
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input type="number" id="quantity" name="quantity" value={deviceData.quantity} onChange={handleChange} className="mt-1 block w-full rounded-md border-[1px] border-gray-400 shadow-sm h-8 pl-2" required />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={deviceData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-[1px] border-gray-400 shadow-sm h-8 pl-2"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category : any, index) => (
                                <option value={category.CategoryName} key={index}>
                                    {category.CategoryName}
                                </option>
                            ))}
                        </select>

                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" id="price" name="price" value={deviceData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-[1px] border-gray-400 shadow-sm h-8 pl-2" required />
                    </div>
                    <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
                        <select id="condition" name="condition" value={deviceData.condition} onChange={handleChange} className="mt-1 block w-full rounded-md border-[1px] border-gray-400 shadow-sm h-8 pl-2" required>
                            <option value="">Select condition</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                            <option value="Refurbished">Refurbished</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Serial Number</label>
                        <input type="text" id="serialNumber" name="serialNumber" value={deviceData.serialNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-[1px] border-gray-400 shadow-sm h-8 pl-2" required />
                    </div>
                    <div>
                        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">Specifications (JSON format)</label>
                        <textarea
                            id="specifications"
                            name="specifications"
                            value={deviceData.specifications}
                            onChange={handleChange}
                            rows={5}
                            className="mt-1 block w-full rounded-md border-[1px] border-gray-400 shadow-sm  p-2"
                            placeholder={`{
  "cpu": "Intel i7 10th Gen",
  "ram": "16GB DDR4",
  "storage": "512GB SSD",
  "gpu": "NVIDIA GTX 1650",
  "screen_size": "15.6 inches",
  "battery": "6 hours",
  "os": "Windows 11"
}`}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" name="description" value={deviceData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md  border-[1px] border-gray-400 shadow-sm p-2" required></textarea>
                    </div>
                    <div>
                        <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
                        <input type="file" id="images" name="images" onChange={handleImageChange} multiple accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:hover:cursor-pointer file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 border  rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Add Device
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDeviceModal;

