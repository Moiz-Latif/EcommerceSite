import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AllUsers = () => {
    const [UserData, setUserData] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        async function getUsers() {
            try {
                const response = await axios.get(
                    "http://localhost:3000/AdminDashboard/Users",
                    { withCredentials: true }
                );
                setUserData(response.data);
            } catch (error: any) {
                console.error("Error fetching users:", error.response?.data?.message);
                navigate('/AdminDashboard/LoginPopup');
            }
        }
        getUsers();
    }, []);
    

    //@ts-ignore
    const Data = UserData?.map((user, index) => {
        var img = user.img;
        return (            
            <div key={user.id} className="grid grid-cols-[1fr,2fr,2fr,2fr] justify-start items-center p-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200 last:border-b-0">
                {/* Count field */}
                <span className="text-gray-500">{index + 1}</span>
                <div className="flex items-center gap-2">
                    <img
                        src={img}
                        alt={`${user.username}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <span className="font-medium text-gray-800">{user.username}</span>
                </div>
                <span className="text-gray-600">{user.identifier}</span>
                <span className="text-gray-600 text-sm">{user.id}</span>
            </div>
        );
    });

    return (
        <div className="bg-gray-100 min-h-screen pl-[210px] pt-20 font-roboto">
            <div className="w-[98%] mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">All Users</h1>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="grid grid-cols-[1fr,2fr,2fr,2fr] justify-center items-center p-4 bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">
                        <h2>#</h2>
                        <h2>Username</h2>
                        <h2>Email</h2>
                        <h2>Id</h2>
                    </div>
                    <div>
                        {Data}
                    </div>
                </div>
            </div>
        </div>
    );
};

