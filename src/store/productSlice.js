import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../globals/misc/statuses";
import { APIAuthenticated } from "../http";




const productSlice = createSlice({
    name:"product",
    initialState:{
        products: null,
        status: STATUSES.SUCCESS,
    },
    reducers:{                      // reducers are pure and synchronous , so no api calls
        setProducts(state,action){                       
            state.products = (action.payload)
        },
        setStatus(state,action){
            state.status = action.payload
        },
        deleteProductById(state, action) {
            const index = state.products.findIndex((product) =>product._id === action.payload.productId);
            state.products.splice(index, 1);
            
        },

        
        updateProductStatusById(state, action) {
            const index = state.products.findIndex((product) =>product._id === action.payload.productId);
            if(index !== -1){
                state.products[index] = action.payload.data;
            }
            
        },

        addProducts(state,action){
            state.products.push(action.payload)
        }
        
    }
})


export const {setStatus,setProducts,deleteProductById,updateProductStatusById,addProducts} = productSlice.actions
export default productSlice.reducer


// just fetch products




// fetch your all order
export function fetchProducts(){
    return async function fetchOrderThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await APIAuthenticated.get("/products/") 
            // console.log(response.data.data);
           dispatch(setProducts(response.data.data.reverse()))
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}


// add products 
export function addProduct(data){
    return async function addProductThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await APIAuthenticated.post("/products/",data,
                {
                    headers:{
                        "Content-Type":"multipart/form-data"                  // handle for image important
                    }
                }
            ) 
            console.log(response.data);
           dispatch(addProducts(response.data.data))
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}

// delete products by id (admin)
export function deleteProduct(productId){
    return async function deleteProductThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await APIAuthenticated.delete(`/products/${productId}`) 
            // console.log(response.data.data);
           dispatch(deleteProductById({productId}))
           // After deleting the product from the backend, re-fetch all orders.
            // This will ensure your orders state is up-to-date with any changes
            // made by the backend (like removing the deleted product from orders).
            dispatch(fetchOrder()); // <-- Call the fetchOrder thunk
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}





// update productStatus by id 
export function updateProductStatus(productId,productStatus){
    return async function updateProductStatusThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try { 
            
        const response = await APIAuthenticated.patch(`products/status/${productId}`,{productStatus}) 
        
        
           dispatch(updateProductStatusById({productId,data:response.data.data}))              // be aware of same name 
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}



// update productStatus by id 
export function updateStockAndPrice(productId,data){
    return async function updateStockAndPriceThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try { 
            
        const response = await APIAuthenticated.patch(`products/stockandprice/${productId}`,data) 
           dispatch(updateProductStatusById({productId,data:response.data.data}))              // be aware of same name 
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}

















