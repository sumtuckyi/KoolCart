import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    category: [],
    responseData: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCategory: (state, action) => {
        state.category = action.payload;
    },
    setData: (state, action) => {
      state.responseData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setCategory, setData, setLoading, setError } = dataSlice.actions;
export default dataSlice.reducer;
