import axios from "axios";
import { UserNavbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import { setCategories } from '../state/features/categoriesSlice';
import { RootState } from '../state/store';
import { setDevices } from '../state/features/devicesSlice';
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../state/features/cartSlice";




export const UserDashboard = () => {
  const { UserId } = useParams<{ UserId: string }>();
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.category.categories);
  const devices = useSelector((state: RootState) => state.device.devices);
  const cart = useSelector((state: RootState) => state.cart.list);

  useEffect(() => {
    if (categories.length === 0) {
      const getCategories = async () => {
        try {
          const response = await axios.get("http://localhost:3000/AdminDashboard/GetCategory");
          if (response && response.data) {
            dispatch(setCategories(response.data));
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      getCategories();
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (devices.length === 0) {
      const getDevices = async () => {
        try {
          const response = await axios.get("http://localhost:3000/AdminDashboard/GetDevices");
          if (response && response.data) {
            dispatch(setDevices(response.data.fixedDevices));
            if (cart.length === 0){
              dispatch(setCart(response.data.fixedDevices));
            }
          }
        } catch (error) {
          console.error("Error fetching devices:", error);
        }
      };
      getDevices();
    }
  }, [dispatch, devices.length]);
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`http://localhost:3000/UserDashboard/${UserId}`);
      if (response && response.data) {
        setImage(response.data.UserInfo.img);
      }
    }
    getData();
  }, [])



  return (
    <div className="w-screen min-h-screen">
      <UserNavbar ImageURl={image} />
      <Outlet />
    </div>
  );
};