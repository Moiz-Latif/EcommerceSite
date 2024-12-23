import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from './features/categoriesSlice';
import deviceReducer from './features/devicesSlice';
import wishListReducer from "./features/wishSlice";
import cartReducer from './features/cartSlice';

export const store = configureStore({
    reducer: {
        category : categoryReducer,
        device: deviceReducer,
        wishList: wishListReducer,
        cart: cartReducer,
    }
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
