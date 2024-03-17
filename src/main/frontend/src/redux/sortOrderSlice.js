import { createSlice } from "@reduxjs/toolkit";

export const sortOrderSlice = createSlice({
  name: "sortOrder",
  initialState: {
    customOrder: [],
  },
  reducers: {
    setCustomOrder: (state, action) => {
      state.customOrder = action.payload;
    },
  },
});

export const { setCustomOrder } = sortOrderSlice.actions;

export default sortOrderSlice.reducer;
