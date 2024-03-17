import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: 0,
        responseData: null,
        loading: false,
        error: null,
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload.length;
        }
    },
});

export const setItems = cartSlice.actions;
export default cartSlice.reducer;