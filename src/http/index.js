// import axios from "axios";

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3500";
// // unauthenticated user register/login
// const API = axios.create({
//     baseURL : API_BASE_URL + "/api",
//     headers:{
//         "Content-Type":"application/json",            // if form,image use multipart/formData
//         "Accept":"application/json"
//     }
// })

// // authenticated user (giving permision)
// const APIAuthenticated = axios.create({
//     baseURL : API_BASE_URL + "/api",
//     headers:{
//         "Content-Type":"application/json",            // if form,image use multipart/formData
//         "Accept":"application/json",
//         "Authorization":`${localStorage.getItem("token")}`
//     }
// })


// export {API,APIAuthenticated}











import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3500";

// Unauthenticated API instance
const API = axios.create({
  baseURL: API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Authenticated API instance
const APIAuthenticated = axios.create({
  baseURL: API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
    
  }
});

// Add Bearer token dynamically using request interceptor
APIAuthenticated.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { API, APIAuthenticated };
