import { Outlet } from "react-router-dom"
import { AdminNavBar } from "../components/AdminNavBar"
import { AdminSideBar } from "../components/AdminSideBar"

export const AdminDashboard = () => {
    return(
        <div className="w-screen min-h-screen bg-gray-200">
            <div>
                <AdminSideBar/>
                <AdminNavBar/>
                <Outlet/>
            </div> 
        </div>
    )
}