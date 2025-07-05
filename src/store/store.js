import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./authSlice"
import orderSlice from "./orderSlice"
import userSlice from "./userSlice"
import productSlice from "./productSlice"
import dataSlice from "./dataSlice"

const store = configureStore({
    reducer:{
        auth : authReducer,
        orders: orderSlice,
        users:userSlice,
        products:productSlice,
        datas:dataSlice
       
    }
})

export default store;






