import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    address: null
}

const authSlice = createSlice({
    name: "addressSlice", initialState, reducers: {
        setAddress: (state, action) => {
            state.address = action.payload;
        }
    }
});

export const { setAddress } = authSlice.actions;
export default authSlice.reducer;