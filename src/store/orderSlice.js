import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../globals/misc/statuses";
import { APIAuthenticated } from "../http";




const orderSlice = createSlice({
    name:"orders",
    initialState:{
        
        orders: null,
        status: STATUSES.SUCCESS,
    },
    reducers:{                      // reducers are pure and synchronous , so no api calls
        setOrders(state,action){                       
            state.orders = (action.payload)
        },
        setStatus(state,action){
            state.status = action.payload
        },
        deleteOrderById(state, action) {
            const index = state.orders.findIndex((order) =>order._id === action.payload.orderId);
            state.orders.splice(index, 1);
            
        },

        updateOrderById(state, action) {
            const index = state.orders?.findIndex((order) =>order._id === action.payload.orderId);
            state.orders[index] = action.payload.data;
            
            
        },


        updatePaymentStatusById(state, action) {
            const index = state.orders.findIndex((order) =>order._id === action.payload.orderId);
            state.orders[index] = action.payload.data;
            
        },
        
    }
})


export const {setStatus,setOrders,deleteOrderById,updateOrderById,updatePaymentStatusById} = orderSlice.actions
export default orderSlice.reducer


// admin dont need to create order 
// just fetch order 




// fetch your all order
export function fetchOrder(){
    return async function fetchOrderThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await APIAuthenticated.get("/admin/orders/") 
            // console.log(response.data.data);
           dispatch(setOrders(response.data.data.reverse()))                  // here .reverse() will show all the new added orders to the top 
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}




// delete order by id 
export function orderDelete(orderId){
    return async function orderDeleteThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try {            
             const response = await APIAuthenticated.delete(`/admin/orders/${orderId}`) 
      console.log('response',response);
           dispatch(deleteOrderById({orderId}))              // be aware of same name 
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}



// update orderstus by id 
export function updateOrderStatus(orderId,orderStatus){
    return async function updateOrderStatusThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try { 
            
        const response = await APIAuthenticated.patch(`/admin/orders/${orderId}`,{orderStatus}) 
        
           dispatch(updateOrderById({orderId,data:response.data.data}))              // be aware of same name 
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}



// update paymentStatus by id 
export function updatePaymentStatus(orderId,paymentStatus){
    return async function updatePaymentStatusThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try { 
            
        const response = await APIAuthenticated.patch(`/admin/orders/paymentstatus/${orderId}`,{paymentStatus}) 
        console.log(response.data);
    
           dispatch(updatePaymentStatusById({orderId,data:response.data.data}))              // be aware of same name 
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}





















