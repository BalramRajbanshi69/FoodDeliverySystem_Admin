import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";


// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson
} from "react-icons/md";
import Products from "views/admin/products";
import Users from "views/admin/users";
import Orders from "views/admin/orders";
import SingleOrder from "views/admin/orders/SingleOrder";
import SingleProduct from "views/admin/products/SingleProduct";
import AddProduct from "views/admin/products/AddProduct";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Orders",
    layout: "/admin",
    path: "orders",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <Orders />,
    secondary: true,
  },
  {
    name: "Products",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "products",
    component: <Products />,
  },
  {
    name: "Add Product",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "products/add",
    component: <AddProduct />,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Users />,
  },
  {

   layout: "/admin",
   path: "orders/:id",
   component: <SingleOrder />,

 },
 {
    layout: "/admin",
    path: "products/:id",
    component: <SingleProduct/>,
  }
];
export default routes;
