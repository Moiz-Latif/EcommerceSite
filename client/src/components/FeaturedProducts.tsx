import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { addToWishlistAsync, deleteFromWishListAsync, setWishListAsync } from '../state/features/wishSlice';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { addToCartAsync, setCartAsync, updateCartAsync } from '../state/features/cartSlice';

export const FeaturedProducts: React.FC = () => {
  const { UserId } = useParams();
  const dispatch = useDispatch();
  const allDevices = useSelector((state: RootState) => state.device.devices);
  const wishlist = useSelector((state: RootState) => state.wishList.list);
  const cart = useSelector((state: RootState) => state.cart.list);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  // Select 5 devices of different brands
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
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredDevices.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredDevices.length) % featuredDevices.length);
  };

  const toggleWishlist = (deviceId: string) => {
    const isInWishlist = wishlist.some(item => item === deviceId);
    if (isInWishlist) {
      //@ts-ignore
      dispatch(deleteFromWishListAsync({ productId: deviceId, UserId: UserId }));
    } else {
      //@ts-ignore
      dispatch(addToWishlistAsync({ productId: deviceId, UserId: UserId }));
    }
  };
  const toggleCart = (deviceId: string) => {
    const CartItem = cart.find((item) => item.DeviceId === deviceId);
    if (CartItem) {
      const Quantity = CartItem.Quantity + 1;

      //@ts-ignore
      dispatch(updateCartAsync({ UserId, Quantity: Quantity, DeviceId: deviceId }));
    } else {
      //@ts-ignore
      dispatch(addToCartAsync({ UserId, Quantity: 1, DeviceId: deviceId }));
    }


  };


  // Handle the wishlist update
  useEffect(() => {
    //@ts-ignore
    dispatch(setWishListAsync({ UserId: UserId }));

  }, [dispatch]);

  useEffect(() => {
    // Only set cart after it has been successfully fetched
    //@ts-ignore
    dispatch(setCartAsync({ UserId: UserId })).then(() => {
      // This ensures the cart is set after fetching
      console.log('Cart has been set after fetching:', cart);
    });
  }, []);
  console.log(cart);


  // Scroll to the correct index in the slider
  useEffect(() => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * currentIndex;
      sliderRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [currentIndex]);

  useEffect(() => {
    console.log('Cart state updated:', cart);
  }, [cart]);

  return (
    <section className="w-full bg-black text-white px-4 py-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-medium tracking-tight mb-5 text-center font-roboto">Featured Products</h2>
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex overflow-hidden snap-x snap-mandatory"
          >
            {featuredDevices.map((device: any, index) => (
              <div
                key={index}
                className="flex-none w-full snap-center hover:"
              >
                <div className="max-w-lg mx-auto bg-white text-black rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative">
                  <img
                    src={device.Images[1]}
                    alt={device.DeviceName}
                    onClick={()=>navigate(`Device/${device.DeviceId}`)}
                    className="w-full h-72 object-contain transition-transform duration-300 transform hover:scale-110 z-20  hover:cursor-pointer"
                  />
                  <button
                    onClick={() => toggleWishlist(device.DeviceId)}
                    className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white shadow-md transition-colors duration-300"
                    //@ts-ignore
                    aria-label={wishlist.some(item => item === device.DeviceId) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        //@ts-ignore
                        wishlist.some(item => item === device.DeviceId) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                        }`}
                    />
                  </button>
                  <div className="p-6 -mt-12 flex flex-col justify-center items-center">
                    <h3 className="text-xl font-bold mb-2 truncate z-40">{device.DeviceName}</h3>
                    <p className="text-sm text-gray-600 mb-2 z-40">
                      {device.Brand} {device.Model}
                    </p>
                    <p className="text-lg font-semibold mb-4">${device.Price.toFixed(2)}</p>
                    <button
                      className="w-full px-4 py-2 bg-black text-white rounded-lg text-lg tracking-wide hover:opacity-90 transition-colors duration-300"
                      // onClick={() => toggleCart(device.DeviceId)}
                      onClick={() => { toggleCart(device.DeviceId) }}
                    >
                      Add to Cart
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition-all duration-300"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md hover:bg-gray-700 transition-all duration-300"
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          {featuredDevices.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white scale-125' : 'bg-gray-500'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
