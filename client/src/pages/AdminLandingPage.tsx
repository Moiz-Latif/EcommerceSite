import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AdminLandingPage: React.FC = () => {
    const [data, setData] = useState({ Users: [], Devices: [], Orders: [], totalPrice: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getData() {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/AdminDashboard/getData`);
                if (response.data) {
                    const { Users, Devices, Orders, totalPrice } = response.data;
                    setData({
                        Users,
                        Devices,
                        Orders,
                        totalPrice
                    });
                }
            } catch (err) {
                setError('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const stats = [
        { label: 'Total Users', value: data.Users.length, icon: '👥' },
        { label: 'Total Products', value: data.Devices.length, icon: '📦' },
        { label: 'Total Orders', value: data.Orders.length, icon: '🛒' },
        { label: 'Total Revenue', value: `$${data.totalPrice.toFixed(2)}`, icon: '💰' },
    ];

    if (loading) {
        return <div className="pl-56 pt-20 pr-5">Loading...</div>;
    }

    if (error) {
        return <div className="pl-56 pt-20 pr-5 text-red-500">{error}</div>;
    }

    return (
        <div className='pl-56 pt-20 pr-5'>
            <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center">
                            <div className="text-3xl mr-4">{stat.icon}</div>
                            <div>
                                <h3 className="text-lg font-semibold">{stat.label}</h3>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left">Action</th>
                                <th className="py-3 px-4 text-left">User</th>
                                <th className="py-3 px-4 text-left">Id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.Users.slice(0, 3).map((order:any, index) => (
                                <tr key={order.id} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
                                    <td className="py-3 px-4">Order placed</td>
                                    <td className="py-3 px-4">{order.username || 'Unknown User'}</td>
                                    <td className="py-3 px-4">{order.id}</td>
                                </tr>
                            ))}
                            {data.Orders.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-3 px-4 text-center">No recent activity</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLandingPage;

