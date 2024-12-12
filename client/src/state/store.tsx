import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from './features/categoriesSlice';
import deviceReducer from './features/devicesSlice';

export const store = configureStore({
    reducer: {
        category : categoryReducer,
        device: deviceReducer
    }
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
