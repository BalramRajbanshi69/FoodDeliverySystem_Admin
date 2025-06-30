import axios from "axios";


// unauthenticated user register/login
const API = axios.create({
    baseURL : "http://localhost:3500/api",
    headers:{
        "Content-Type":"application/json",            // if form,image use multipart/formData
        "Accept":"application/json"
    }
})

// authenticated user (giving permision)
const APIAuthenticated = axios.create({
    baseURL : "http://localhost:3500/api",
    headers:{
        "Content-Type":"application/json",            // if form,image use multipart/formData
        "Accept":"application/json",
        "Authorization":`${localStorage.getItem("token")}`
    }
})


export {API,APIAuthenticated}