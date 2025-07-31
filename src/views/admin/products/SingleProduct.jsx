import { socket } from "App";
import { APIAuthenticated } from "http";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateStockAndPrice } from "store/productSlice";
import { updateProductStatus } from "store/productSlice";
import s1 from '../../.../../../../src/assets/footer-bg-image1.jpg';

const SingleProduct = () => {
// const apiUrl = process.env.REACT_APP_API_URL;  // since using cloudinary full absolute url required   
  const { id } = useParams();
  const dispatch = useDispatch();
  const {products}  = useSelector((state) => state.products);
  const {data:user} = useSelector((state)=>state.auth);
 
  
  
  const [orders,setOrders] = useState([])       // for getting orders of product


     // intermediate problem solved start
  const [newProduct,setNewProduct] = useState([])
  const fetchProducts = async()=>{
     const response = await APIAuthenticated.get("/products/") 
    if(response.status === 200){
      setNewProduct(response.data.data)
    }
  }
  useEffect(()=>{
    fetchProducts()
  })

  const [filteredProduct] = products ?  products.filter((product) => product._id === id) : newProduct.filter((product) => product._id === id) // here we need only single selected product deteail so, product._id should be equal to selected product id from params . directly array desctructing beacuse it coming array
  
  
  // intermediate problem solved end

  const [productStatus, setProductStatus] = useState(
    filteredProduct?.productStatus
  );

  const handleProductStatus = (e) => {
    setProductStatus(e.target.value);
    dispatch(updateProductStatus(id, e.target.value));
    toast.success(`Product Status changed to ${e.target.value}`)
  };

  const handleChange = (value, name) => {
    let data = {};
    if (name === "price") {
      data.productPrice = value;
    } else {
      data.productStockQuantity = value;
    }
    dispatch(updateStockAndPrice(id, data));

   

  };


  // fetching to get orders of product
  const fetchOrdersProduct = async()=>{
    const response = await APIAuthenticated.get(`/products/productOrders/${id}`)
    
    
   if(response.status ===200){
     setOrders(response.data.data)
   }
  }
  useEffect(()=>{
    fetchOrdersProduct()  
     
  },[])

  
  

  return (
    <div className="container mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
      <div className="py-22">
        <div className="item-start my-6 flex flex-col justify-start space-y-2">
          <h1 className="text-2xl leading-4 text-gray-800 dark:text-white  lg:text-2xl">
            {" "}
            <span className="font-semibold">product</span> : {id}
          </h1>
          <p className="text-2xl text-gray-800 dark:text-white   lg:text-2xl">
            {" "}
            <span className="font-semibold">product CreatedAt </span> :{" "}
            {filteredProduct &&
              new Date(filteredProduct?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-black mt-2 h-[2px] w-full "></div>
        <div className="jusitfy-center mt-10 flex w-full flex-col items-stretch space-y-4 md:space-y-6 xl:flex-row xl:space-x-8 xl:space-y-0">
          <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8">
            <div className="flex w-full flex-col items-start justify-start bg-gray-50 px-4 py-4 dark:bg-gray-800 md:p-6 md:py-6 xl:p-8">
              <p className="text-lg font-semibold leading-6 text-gray-800 underline underline-offset-4 dark:text-white md:text-xl xl:leading-5">
                My product
              </p>

              <div className="mt-4 flex w-full flex-col items-start justify-start md:mt-6 md:flex-row md:items-center md:space-x-6 xl:space-x-8">
                <div className="l pb-4 md:w-[150px] md:pb-8">
                  <img
                    className="hidden w-full md:block"
                    // src={filteredProduct?.productImage}
                       src={filteredProduct?.productImage && filteredProduct.productImage.length > 0 ? filteredProduct.productImage[0] : s1}
                    alt={filteredProduct?.productName}
                  />
                </div>
                <div className="border-b border-gray-200 flex flex-col items-start justify-between space-y-4  pb-8 md:flex-row md:space-y-0">
                  <div className="flex flex-col items-start justify-start space-y-8 md:w-40">
                    <h3 className="text-xl font-semibold leading-6 text-gray-800 dark:text-white xl:text-2xl">
                      {filteredProduct?.productName}
                    </h3>
                  </div>
                  <div className="flex w-full items-start justify-between space-x-8">
                    <p className="text-base leading-6 text-gray-800  dark:text-white xl:text-lg">
                      {" "}
                      <span className="font-semibold">Status</span>{" "}
                      {filteredProduct?.productStatus}
                    </p>
                    <p className="text-base leading-6 text-gray-800  dark:text-white xl:text-lg">
                      {" "}
                      <span className="font-semibold">Price</span>{" "}
                      {filteredProduct?.productPrice}
                    </p>
                    <p className="text-base leading-6 text-gray-800  dark:text-white xl:text-lg">
                      {" "}
                      <span className="font-semibold">TSQ</span> :{" "}
                      {filteredProduct?.productStockQuantity}
                    </p>
                    <p className="text-base leading-6 text-gray-800  dark:text-white xl:text-lg">
                      {" "}
                      <span className="font-semibold">TotalPrice</span>{" "}
                      {filteredProduct?.productPrice *
                        filteredProduct?.productStockQuantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-start justify-start space-y-4 md:space-y-6 xl:space-y-8">
            <div className="flex w-full flex-col items-start justify-start bg-gray-50 px-4 py-4 dark:bg-gray-800 md:p-6 md:py-6 xl:p-8">
              <p className="text-lg font-semibold leading-6 text-gray-800 underline underline-offset-4 dark:text-white md:text-xl xl:leading-5">
              Orders
              </p>

              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden mt-4">
               <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      OrderId
                    </th>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      OrderStatus
                    </th>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Shipping Addresss
                    </th>
                    
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.length > 0 &&
                    orders.map((order,index) => (
                      <tr key={order._id}>
                        <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-[#540b0e] whitespace-no-wrap font-bold hover:cursor-pointer hover:underline" >
                            {order._id}
                          </p>
                        </td>
                        <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {order.orderStatus}
                          </p>
                        </td>

                        <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {order.phoneNumber}
                          </p>
                        </td>
                         <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {order.shippingAddress}
                          </p>
                        </td>
                        
                       
                      </tr>
                    ))}
                </tbody>
              </table> 
             
            </div>

            </div>
          </div>


          </div>

          

          <div className="flex  h-[300px] w-full flex-col items-center justify-between bg-gray-50 px-4 py-6 dark:bg-gray-800 md:items-start md:p-6 xl:w-96 xl:p-8">
            <h3 className="text-xl font-semibold leading-4 text-gray-800 underline underline-offset-4 dark:text-white ">
              Customer
            </h3>
            <div className="flex h-full w-full flex-col items-stretch justify-start md:flex-row md:space-x-6 lg:space-x-8 xl:flex-col xl:space-x-0">
              <div className="mt-6 flex w-full flex-col items-stretch justify-between md:mt-0  my-6 xl:h-full">
                <div className="mt-3">
                  {/* update product status */}
                  <label class="block  text-sm font-medium text-gray-900 dark:text-gray-400">
                    Select Product Status
                  </label>
                  <select
                    className="focus:bg-blue-500  dark:focus:bg-blue-500  block w-full rounded-lg border-2 border-gray-500 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500"
                    onClick={handleProductStatus}
                  >
                    {/* <option value={filteredproduct?.productStatus}>{filteredproduct?.productStatus}</option> */}
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                {/* update payment status */}
                <div>
                  <label class="block mt-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                    Update Product Stock
                  </label>
                  <input
                    type="number"
                    value={filteredProduct?.productStockQuantity}
                    name="tsq"
                    id="tsq"
                    min={0}
                    max={500}
                    className=" focus:bg-blue-500 mb-2  dark:focus:bg-blue-500  block w-full rounded-lg border-2 border-gray-500 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500"
                    onChange={(e) => handleChange(e.target.value, "tsq")}
                  />
                  <label class="block  text-sm font-medium text-gray-900 dark:text-gray-400">
                    Update Product Price
                  </label>
                  <input
                    value={filteredProduct?.productPrice}
                    onChange={(e) => handleChange(e.target.value, "price")}
                    type="number"
                    name="price"
                    id="price"
                    min={0}
                    className="focus:bg-blue-500  dark:focus:bg-blue-500  block w-full rounded-lg border-2 border-gray-500 bg-gray-50 p-2.5 text-sm text-gray-900 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
