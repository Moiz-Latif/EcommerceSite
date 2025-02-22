import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
    deviceId: string,
    quantity: number
}

interface CartState {
    list: CartItem[];
}

const initialState: CartState = {
    list: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addCartItemtoLocalStorage(state, action) {
            const CartItem = { deviceId: action.payload.deviceId, quantity: 1 };
            if (!state.list.includes(CartItem)) {
                state.list.push(CartItem);
            }
        },

        removeCartItemfromLocalStorage(state, action) {
            const CartItem = { deviceId: action.payload.deviceId, quantity: 1 };
            state.list = state.list.filter((item: any) => item != CartItem);
        },

        updateLocalCartItem(state, action) {
            const CartItem = { deviceId: action.payload.deviceId, quantity: action.payload.quantity };
            state.list = state.list.map((item) => item.deviceId === CartItem.deviceId ? { ...item, quantity: CartItem.quantity } : item)
        },

        syncLocalCart(state) {
            const localCart = JSON.parse(localStorage.getItem('cart') || "[]");
            state.list = localCart;
        },

        updateLocalCart(state) {
            localStorage.setItem("Cart", JSON.stringify(state.list));
        }

    }
});

export const { addCartItemtoLocalStorage, removeCartItemfromLocalStorage, syncLocalCart, updateLocalCart, updateLocalCartItem } = cartSlice.actions;

export default cartSlice.reducer;