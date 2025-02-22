import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface WishListState {
  list: string[]; // Array of deviceId strings
}

const initialState: WishListState = {
  list: [],
};

// Thunks for async actions

export const setWishListAsync = createAsyncThunk(
  'wishList/update',
  async ({ UserId }: { UserId: string }, { dispatch }) => {
    const response = await axios.get(`http://localhost:3000/UserDashboard/${UserId}/WishList/Get`);
    if (response && response.data) {
      dispatch(setWishList(response.data.User));
    }
  }
)
export const addToWishlistAsync = createAsyncThunk(
  'wishList/addToWishlist',
  async ({ productId, UserId }: { productId: string, UserId: String }, { dispatch }) => {
    const response = await axios.post(`http://localhost:3000/UserDashboard/${UserId}/WishList/Add`, { productId }); // API to add product cart
    if (response && response.data) {
      dispatch(addToWishList(productId)); // Add product with initial quantity of 1
    }
  }
);

export const deleteFromWishListAsync = createAsyncThunk(
  'wishlist/deleteFromWishList',
  async ({ productId, UserId }: { productId: string, UserId: string }, { dispatch }) => {

    const response = await axios.post(`http://localhost:3000/UserDashboard/${UserId}/WishList/Delete`, { productId }); // API to add product cart
    if (response && response.data) {
      console.log(response.data)
      dispatch(removeFromWishList(productId));
    }
  }

)

const wishlistSlice = createSlice({
  name: "WishList",
  initialState,
  reducers: {

    //updateWishlist
    setWishList: (state, action) => {
      state.list = action.payload
    },


    // Add to wishlist
    addToWishList: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      if (!state.list.includes(productId)) {
        state.list.push(productId);
      }
    },

    // Remove from wishlist
    removeFromWishList: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.list = state.list.filter((id) => id !== productId);
    },
  },
});

export const { addToWishList, removeFromWishList, setWishList } = wishlistSlice.actions;
export default wishlistSlice.reducer;
