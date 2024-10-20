import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    address: false
}

const authSlice = createSlice({
    name: "addressSlice", initialState, reducers: {
        setAddress: (state, action) => {
            state.address = action.payload.address;
        }
    }
});

export const { setAddress } = authSlice.actions;
export default authSlice.reducer;