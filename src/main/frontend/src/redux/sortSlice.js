import { createSlice } from "@reduxjs/toolkit";

export const sortSlice = createSlice({
  name: "sort",
  initialState: {
    value: "date",
  },
  reducers: {
    setSortType: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSortType } = sortSlice.actions;

export default sortSlice.reducer;
