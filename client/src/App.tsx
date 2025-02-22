import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Login } from "./Layouts/Login"
import { AdminLogin } from "./pages/AdminLogin"
import { UserDashboard } from "./Layouts/UserDashboard"
import { AdminDashboard } from "./Layouts/AdminDashboard"
import { AdminDevices } from "./pages/AdminDevices"
import { AllUsers } from "./pages/AllUsers"
import ApprovalsPage from "./pages/ApprovalPage"
import CategoriesPage from "./pages/CategoriesPage"
import { DeviceDetails } from "./pages/AdminDevicePage"
import { EditDevice } from "./pages/EditDevice"
import { Provider } from "react-redux"
import { store } from "./state/store"
import { ProductsPage } from "./pages/ProductsPage"
import { LandingPage } from "./pages/LandingPage"
import { ProductPage } from "./pages/ProductPage"
import { CheckoutPage } from "./pages/CheckoutPage"
import AdminLandingPage from "./pages/AdminLandingPage"


const router = createBrowserRouter([
  {
    path: '/',
    element: <UserDashboard />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'Category/:CategoryId',
        element: <ProductsPage/>
      },
      {
        path: 'Device/:DeviceId',
        element: <ProductPage/>
      },
      {
        path:"Checkout",
        element: <CheckoutPage/>
      }
    ]
  },
  {
    path: 'UserDashboard/:UserId',
    element: <UserDashboard />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'Category/:CategoryId',
        element: <ProductsPage/>
      },
      {
        path: 'Device/:DeviceId',
        element: <ProductPage/>
      },
      {
        path:"Checkout",
        element: <CheckoutPage/>
      }
    ]
  },
  {
    path: 'AdminDashboard',
    element: <AdminDashboard />,
    children: [
      {
        index:true,
        element:<AdminLandingPage/>
      },

      {
        path: 'Devices',
        element: <AdminDevices />,
      },
      {
        path: 'Devices/:id',
        element: <DeviceDetails />
      },
      {
        path: 'Devices/EditDevice/:id',
        element: <EditDevice />
      },
      {
        path: 'Users',
        element: <AllUsers />
      },
      {
        path: 'approvals',
        element: <ApprovalsPage />
      },
      {
        path: 'categories',
        element: <CategoriesPage />
      },
    ]
  }

])

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  )
}