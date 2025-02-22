import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { addToWishlistAsync, deleteFromWishListAsync, setWishListAsync } from '../state/features/wishSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { addToCartAsync, setCartAsync, updateCartAsync } from '../state/features/cartSlice';
import { addtoLocalStorage, removefromLocalStorage, updateLocalStorage } from '../state/features/localwishSlice';
import { addCartItemtoLocalStorage, updateLocalCart, updateLocalCartItem } from '../state/features/localcartSlice';

export const FeaturedProducts: React.FC = () => {
  const { UserId } = useParams();
  const dispatch = useDispatch();
  const allDevices = useSelector((state: RootState) => state.device.devices);
  const wishlist = useSelector((state: RootState) => state.wishList.list);
  const localWishList = useSelector((state: RootState) => state.localWishList.list);
  const cart = useSelector((state: RootState) => state.cart.list);
  const localCart = useSelector((state: RootState) => state.localCart.list);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const navigate = useNavigate();

  const featuredDevices = React.useMemo(() => {
    const uniqueBrands = new Set();
    return allDevices.filter(device => {
      if (uniqueBrands.size < 5 && !uniqueBrands.has(device.Brand)) {
        uniqueBrands.add(device.Brand);
        return true;
      }
      return false;
    }).slice(0, 5);
  }, [allDevices]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredDevices.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredDevices.length) % featuredDevices.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const toggleWishlist = (deviceId: string) => {
    const isInReduxWishlist = wishlist.some(item => item === deviceId);
    const isInLocalReduxWishlist = localWishList.some(item => item === deviceId);
    if (UserId == undefined) {
      if (isInLocalReduxWishlist) {
        //@ts-ignore
        dispatch(removefromLocalStorage(deviceId));
        dispatch(updateLocalStorage())
      } else {
        //@ts-ignore
        dispatch(addtoLocalStorage(deviceId));
        dispatch(updateLocalStorage());
      }
    } else {
      if (isInReduxWishlist) {
        //@ts-ignore
        dispatch(deleteFromWishListAsync({ productId: deviceId, UserId }));
      } else {
        //@ts-ignore
        dispatch(addToWishlistAsync({ productId: deviceId, UserId }));
      }
    }

  };
  const toggleCart = (deviceId: string) => {
    if (UserId == undefined) {
      const cartItem = localCart.find((item) => item.deviceId === deviceId);
      if (cartItem) {
        //@ts-ignore
        dispatch(updateLocalCartItem({ deviceId: deviceId, quantity: cartItem.quantity }))
        dispatch(updateLocalCart());
      } else {
        //@ts-ignore
        dispatch(addCartItemtoLocalStorage({ deviceId: deviceId }))
        dispatch(updateLocalCart());

      }
    } else {
      const cartItem = cart.find((item) => item.DeviceId === deviceId);
      if (cartItem) {
        //@ts-ignore
        dispatch(updateCartAsync({ UserId, Quantity: cartItem.Quantity + 1, DeviceId: deviceId }));
      } else {
        //@ts-ignore
        dispatch(addToCartAsync({ UserId, Quantity: 1, DeviceId: deviceId }));
      }
    }
  };

  useEffect(() => {
    //@ts-ignore
    dispatch(setWishListAsync({ UserId }));
    //@ts-ignore
    dispatch(setCartAsync({ UserId }));
  }, [dispatch, UserId]);

  return (
    <section className="h-screen w-full bg-black text-white relative overflow-hidden flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black opacity-90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full relative">
        <h2 className="text-4xl font-bold text-center mt-20 mb-3">
          Featured Products
        </h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {featuredDevices.map((device: any, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="max-w-xl mx-auto rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 bg-gradient-to-b from-gray-900 to-black mb-10">
                    <div className="relative group bg-white">
                      <img
                        src={device.Images[1]}
                        alt={device.DeviceName}
                        onClick={() => navigate(`Device/${device.DeviceId}`)}
                        className="w-full h-72 object-contain transition-all duration-500 transform group-hover:scale-105 cursor-pointer p-4"
                      />
                      <button
                        onClick={() => toggleWishlist(device.DeviceId)}
                        className="absolute top-4 right-4 p-3 rounded-full bg-black/10 hover:bg-black/20 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors duration-300 ${((UserId == undefined) ? localWishList : wishlist).some(item => item === device.DeviceId)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-700'
                            }`}
                        />
                      </button>
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-gray-500 to-transparent" />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <h3 className="text-2xl font-bold text-white">{device.DeviceName}</h3>
                        <p className="text-gray-400">{device.Brand} {device.Model}</p>
                        <p className="text-3xl font-bold text-white">${device.Price.toFixed(2)}</p>
                        <button
                          onClick={() => toggleCart(device.DeviceId)}
                          className="w-full py-4 mt-2 bg-white text-black rounded-xl flex items-center justify-center space-x-2 font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                          <ShoppingBag className="w-5 h-5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white/10 text-white p-4 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white/10 text-white p-4 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center mt-8 space-x-3">
          {featuredDevices.map((_, index) => (
            <button
              key={index}
              onClick={() => !isAnimating && setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-white scale-125'
                : 'bg-gray-600 hover:bg-gray-500'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;