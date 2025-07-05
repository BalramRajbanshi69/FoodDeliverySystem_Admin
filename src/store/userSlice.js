import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../globals/misc/statuses";
import { APIAuthenticated } from "../http";




const userSlice = createSlice({
    name:"orders",
    initialState:{
        users: null,
        status: STATUSES.SUCCESS,
    },
    reducers:{                      // reducers are pure and synchronous , so no api calls
        setUsers(state,action){                       
            state.users = (action.payload)
        },
        setStatus(state,action){
            state.status = action.payload
        },
         deleteUserById(state, action) {
            const index = state.users.findIndex((user) =>user._id === action.payload.userId);
            state.users.splice(index, 1);
            
        },
        
    }
})


export const {setStatus,setUsers,deleteUserById} = userSlice.actions
export default userSlice.reducer


// admin dont need to create users
// just fetch users 




// fetch your all order
export function fetchUsers(){
    return async function fetchUsersThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await APIAuthenticated.get("/admin/users/")             
           dispatch(setUsers(response.data.data.reverse()))                 // .reverse() shows the newly added users to the top
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}





// delete user by id 
export function deleteUser(userId){
    return async function deleteUserThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING));
        try {
            
             const response = await APIAuthenticated.delete(`/admin/users/${userId}`) 
      
           dispatch(deleteUserById({userId}))              // be aware of same name 
            dispatch(setStatus(STATUSES.SUCCESS));
           
        } catch (error) {
            console.log(error);
            dispatch(setStatus(STATUSES.ERROR));
            
        }

    }
}

















