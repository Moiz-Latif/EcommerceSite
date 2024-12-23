import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";




interface CartItem {
    DeviceId: string,
    Quantity: number
}

interface CartState {
    list: CartItem[]
}

const initialState: CartState = {
    list: [],
};

export const setCartAsync = createAsyncThunk(
    'Cart/Update', async ({ UserId }: { UserId: string }, { dispatch }) => {
        const response = await axios.get(`http://localhost:3000/UserDashboard/${UserId}/Cart/Set`);
        if (response && response.data.Cart) {
            dispatch(setCart(response.data.Cart));
        }
    }
)
export const addToCartAsync = createAsyncThunk(
    "Cart/Add", async ({ UserId, Quantity, DeviceId }: { UserId: string, Quantity: number, DeviceId: string }, { dispatch }) => {
        const response = await axios.post(`http://localhost:3000/UserDashboard/${UserId}/Cart/Add`, { Quantity, DeviceId });
        if (response && response.data) {
            console.log(response.data);
            dispatch(addToCart(response.data));
        }
    }
)

export const RemoveFromCartAsync = createAsyncThunk(
    "Cart/Remove", async ({ UserId, DeviceId }: { UserId: string, DeviceId: string }, { dispatch }) => {
        console.log('Removing the cart');
        const response = await axios.post(`http://localhost:3000/UserDashboard/${UserId}/Cart/Remove`, { DeviceId });
        if (response && response.data) {
            console.log(response.data.newCart);
            dispatch(removeFromCart(response.data));
        }
    }
)

export const updateCartAsync = createAsyncThunk(
    'Cart/Update', async ({ UserId, DeviceId, Quantity }: { UserId: string, DeviceId: string, Quantity: number }, { dispatch }) => {
        const response = await axios.post(`http://localhost:3000/UserDashboard/${UserId}/Cart/Update`, { DeviceId , Quantity});
        if(response && response.data){
            console.log(response.data);
            dispatch(updateCart(response.data))
        }
    }
)



const cartSlice = createSlice({
    name: "Cart",
    initialState,
    reducers: {
        // Set the entire Cart, ensuring all items have inCart as false
        setCart: (state, action) => {
            if (action.payload.length > 0 && !action.payload[0].DeviceName) {
                state.list = action.payload
            }
        },

        //add to wishlist
        addToCart: (state, action) => {
            const newItem = action.payload; // Should be { DeviceId, Quantity }
            const exists = state.list.find((item) => item.DeviceId === newItem.DeviceId);
            if (!exists) {
                console.log('I am here as well');
                state.list.push(newItem);
            }
        },


        //remove from Cart
        removeFromCart: (state, action) => {
            state.list = action.payload.newCart;
        },

        updateCart: (state, action) => {
            state.list = action.payload;
        }



    }
});

export const { setCart, addToCart, removeFromCart, updateCart } = cartSlice.actions;
export default cartSlice.reducer;