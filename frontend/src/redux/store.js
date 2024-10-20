import { configureStore } from '@reduxjs/toolkit'
import addressSlice from './slice/AddressSlice'
export default configureStore({
    reducer: {
        address: addressSlice,
    },
})