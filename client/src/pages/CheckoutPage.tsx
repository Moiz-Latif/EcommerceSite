import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../state/store";
import { clearCartAsync, updateCartAsync } from "../state/features/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useParams } from "react-router-dom";
import axios from "axios";

export const CheckoutPage: React.FC = () => {
  const { UserId } = useParams();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.list);
  const devices = useSelector((state: RootState) => state.device.devices);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const device = devices.find((d) => d.DeviceId === item.DeviceId);
      return total + (device ? device.Price * item.Quantity : 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    async function PlaceOrder() {
      const stripe = await loadStripe("pk_test_51QlxBiRq46mJj6NwaS3TFwq9HbiC1lzMdaNwLP1Le6qRngqtreZkxaEzGEQkaufspjRKNiWvM0h6geJJZTvhf8ds00hjD7d4xT");
      const totalPrice = calculateTotal();
      const response = await axios.post(`http://localhost:3000/UserDashboard/${UserId}/PlaceOrder`, { formData, cart, totalPrice });
      if (response) {
        console.log(response.data);
        setShowPopup(true);
        setFormData({
          name: "",
          email: "",
          address: "",
          city: "",
          country: "",
          zipCode: "",
        });
      }

      const sessionId = response.data.id;
      if (sessionId) {
        //@ts-ignore
        dispatch(clearCartAsync({ UserId }));
        const stripeResult = stripe?.redirectToCheckout({
          sessionId: sessionId
        })
      }

    };
    PlaceOrder();
  };

  function toggleIncrementCart(deviceId: string) {
    const CartItem = cart.find((item) => item.DeviceId === deviceId);
    if (CartItem) {
      const Quantity = CartItem.Quantity + 1;

      //@ts-ignore
      dispatch(updateCartAsync({ UserId, Quantity: Quantity, DeviceId: deviceId }));
    }
  };

  function toggleDecrementCart(deviceId: string) {
    const CartItem = cart.find((item) => item.DeviceId === deviceId);
    if (CartItem) {
      const Quantity = CartItem.Quantity - 1;

      //@ts-ignore
      dispatch(updateCartAsync({ UserId, Quantity: Quantity, DeviceId: deviceId }));
    }
  }

  const Popup = ({ message }: { message: string }) => {
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-md max-w-sm"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
        >
          <p className="text-center text-gray-800">{message}</p>
          <button
            onClick={() => setShowPopup(false)}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            OK
          </button>
        </motion.div>
      </motion.div>
    );
  };


  return (
    <motion.div
      className="w-full min-h-screen bg-gray-50 text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 pt-20">
        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Order Summary */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h2>
            {cart.map((item) => {
              const device = devices.find((d) => d.DeviceId === item.DeviceId);
              return device ? (
                <motion.div
                  key={item.DeviceId}
                  className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center">
                    <img src={device.Images[0]} alt={device.DeviceName} className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{device.DeviceName}</h3>
                      <p className="text-gray-500">${device.Price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        if (item.Quantity > 1) {
                          toggleDecrementCart(item.DeviceId);
                        }
                      }}
                      disabled={item.Quantity === 1}
                      className="bg-gray-200 text-black px-2 py-1 rounded-l hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="bg-gray-100 px-4 py-1">{item.Quantity}</span>
                    <button
                      onClick={() => toggleIncrementCart(item.DeviceId)}
                      className="bg-gray-200 text-black px-2 py-1 rounded-r hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              ) : null;
            })}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total:</span>
                <span className="font-bold text-2xl text-gray-800">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 pl-2 block w-full rounded-md py-1 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 pl-2 block w-full rounded-md  py-1 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="mt-1 pl-2 block w-full rounded-md  py-1 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="mt-1 pl-2 block w-full rounded-md  py-1 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="mt-1 pl-2 block w-full rounded-md  py-1 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP / Postal Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="mt-1 pl-2 block w-full rounded-md  py-1 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="pt-4">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Place Order
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
        <AnimatePresence>
          {showPopup && <Popup message="Order has been placed successfully!" />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;

