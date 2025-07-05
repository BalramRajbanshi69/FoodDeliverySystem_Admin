import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import AdminLogin from "views/admin/login/AdminLogin";
import { Provider } from "react-redux";
import store from "store/store";
import ProtectedRoute from "ProtectedRoute";

// socket connection
import {io} from "socket.io-client"
export const socket = io("http://localhost:3500")           // with whom you are trying to connect (we are in client side , so connecting with backend path)

const App = () => {
  return (
    <Provider store={store}>
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
