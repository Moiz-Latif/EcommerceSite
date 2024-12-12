import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AddDeviceModal from '../components/AddDeviceModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'
import { Outlet, useNavigate } from 'react-router-dom'

interface Device {
    DeviceName: string
    category: string
    Quantity: number
    Price: number
    DeviceId: string
}

interface Category {
    CategoryId: string
    CategoryName: string
}

export const AdminDevices = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [devices, setDevices] = useState<Device[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null)
    const navigate = useNavigate();

    useEffect(() => {
        async function getDevices() {
            try {
                setIsLoading(true)
                const response = await axios.get('http://localhost:3000/AdminDashboard/GetDevices')
                if (response && response.data) {
                    const { fixedDevices, categories } = response.data

                    const mappedDevices = fixedDevices.map((device: any) => {
                        const category = categories.find(
                            (cat: Category) => cat.CategoryId === device.categoryid
                        )?.CategoryName || 'Unknown Category'

                        return {
                            DeviceName: device.DeviceName,
                            category,
                            Quantity: device.Quantity,
                            Price: device.Price,
                            DeviceId: device.DeviceId
                        }
                    })

                    setDevices(mappedDevices)
                    setCategories(categories)
                }
            } catch (error: any) {
                console.error('Error fetching devices:', error.message)
            } finally {
                setIsLoading(false)
            }
        }
        getDevices()
    }, [])

    function showDevice(id: string) {
        navigate(`${id}`)
    }

    const handleDeleteClick = (e: React.MouseEvent, device: Device) => {
        e.stopPropagation();
        setDeviceToDelete(device);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deviceToDelete) {
            try {
                await axios.post(`http://localhost:3000/AdminDashboard/DeleteDevice/${deviceToDelete.DeviceId}`);
                setDevices(devices.filter((d) => d.DeviceId !== deviceToDelete.DeviceId));
            } catch (error) {
                console.error('Error deleting device:', error);
            }
        }
        setIsDeleteModalOpen(false);
        setDeviceToDelete(null);
    };

    return (
        <div className="bg-gray-100 min-h-screen pl-52 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="md:flex md:items-center md:justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">All Devices</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-300 ease-in-out"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Device
                    </button>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                #
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Device Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Device Category
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Stock Quantity
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Device Price
                                            </th>
                                            <th scope="col" className="px-3 pl-8 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-4">
                                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            devices.map((device, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition duration-150 ease-in-out hover:cursor-pointer" onClick={() => showDevice(device.DeviceId)}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {index + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{device.DeviceName}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{device.category}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{device.Quantity}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${device.Price.toFixed(2)}</td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-between items-center">
                                                        <div className='flex px-2 py-1 rounded-md'>
                                                            <button
                                                                className="text-indigo-600 hover:text-indigo-900 mr-2 border-2 border-indigo-600 p-1 rounded-md bg-indigo-50"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/AdminDashboard/Devices/EditDevice/${device.DeviceId}`)
                                                                }}
                                                            >
                                                                <Pencil className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:text-red-900 border-2 border-red-600 p-1 rounded-md bg-red-50"
                                                                onClick={(e) => handleDeleteClick(e, device)}
                                                            >
                                                                <Trash2 className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <AddDeviceModal onClose={() => setIsModalOpen(false)} />
            )}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                deviceName={deviceToDelete?.DeviceName || ''}
            />
            <Outlet />
        </div>
    )
}

