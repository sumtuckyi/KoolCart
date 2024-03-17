import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userSeq: null,
};

//User_seq 가져오기
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action)=>{
            state.userSeq = action.payload.userSeq;
        },
    },
});


export const { setUser } = userSlice.actions;

export const selectUserseq = (state) => state.user.userSeq;

export default userSlice.reducer;