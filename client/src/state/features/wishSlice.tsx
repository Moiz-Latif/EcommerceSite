import { createSlice } from "@reduxjs/toolkit";


interface Device {
    DeviceId: string; // Unique identifier for the device
    Quantity: number; // Stock count of the device
    DeviceName: string; // Name of the device
    Brand: string; // Brand of the device
    Model: string; // Model of the device
    Category: string; // Category like Smartphone, Laptop, etc.
    Condition: string; // Condition of the device: New, Used, etc.
    Specifications: Record<string, string | Record<string, string>>; // Supports nested objects like the camera property
    Description: string; // Device description
    Images: string[]; // Array of image URLs
    SerialNumber: string; // Serial number should be a string
    Price: number; // Price in dollars
}
  
interface WishListItem {
    Device: Device,
    inWishList: boolean
}

interface WishListState {
    list : WishListItem[]
}

const initialState : WishListState = {
    list: [],
};

const wishlistSlice = createSlice({
    name: "WishList",
    initialState,
    reducers : {
       // Set the entire wishlist, ensuring all items have inWishList as false
       setWishList: (state, action) => {
        state.list = action.payload.map((item : any) => ({
            ...item,
            inWishList: false, // Ensure all items default to false
        }));
    },

       //add to wishlist
       addToWishList: (state , action) => {
            const productId = action.payload;
            const product = state.list.find((item) => item.Device.DeviceId === productId);
            if(product){
                product.inWishList = true;
            } else {
                console.error(`Product with ID ${productId} not found in the list`);
            }
       },

       //remove from wishlist
       removeFromWishList: (state , action) => {
            const productId = action.payload;
            const product = state.list.find((item) => item.Device.DeviceId === productId);
            if(product){
                product.inWishList = false;
            } else {
                console.error(`Product with ID ${productId} not found in the list`);
            }
       }
    }
});

export const { setWishList , addToWishList , removeFromWishList } = wishlistSlice.actions;
export default wishlistSlice.reducer;