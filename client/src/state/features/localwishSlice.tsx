import { createSlice } from "@reduxjs/toolkit";

interface WishListState {
    list : string[];
};

const initialState : WishListState = {
    list: []
};

const wishSlice = createSlice({
    name: "wish",
    initialState,
    reducers: {
        addtoLocalStorage(state ,action ){
            const productId = action.payload;
            if(!state.list.includes(productId)){
                state.list.push(action.payload);
            }
        },

        removefromLocalStorage(state, action){
            const productId = action.payload;
            state.list = state.list.filter((item:string)=>item != productId);
        },
        syncLocalStorage(state){
            const wishlist = JSON.parse(localStorage.getItem('WishList') || "[]");
            state.list = wishlist
        },
        updateLocalStorage(state){
            const wishlist = state.list;
            localStorage.setItem('WishList',JSON.stringify(wishlist));
        }
    }
});

export const {addtoLocalStorage , removefromLocalStorage, syncLocalStorage, updateLocalStorage} = wishSlice.actions;
export default wishSlice.reducer;