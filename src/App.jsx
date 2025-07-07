import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import AdminLogin from "views/admin/login/AdminLogin";
import { Provider } from "react-redux";
import store from "store/store";
import ProtectedRoute from "ProtectedRoute";

// socket connection
import {io} from "socket.io-client"
import Toast from "toast/Toast";
export const socket = io("https://fooddeliverysystem-backend-1.onrender.com",{
  auth:{
    token:localStorage.getItem("token")
  }
})           // with whom you are trying to connect (we are in client side , so connecting with backend path)

const App = () => {
  return (
    <Provider store={store}>
      <Toast/>
    <Routes>
      {/* when in home page, navigate to admin login page */}
      <Route path="/" element={<AdminLogin />} />             
      <Route path="admin/*" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>} />
      {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
    </Routes>
    </Provider>
 
  );
};

export default App;
