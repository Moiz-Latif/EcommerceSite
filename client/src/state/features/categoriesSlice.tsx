// devicesSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface Category {
  _id: number;
  name: string;
  image: string;
}

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [], // Make sure this is an empty array
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload; // Expecting action.payload to be an array
    },
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
