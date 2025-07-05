import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
import { deleteProduct } from "store/productSlice";
import { fetchProducts } from "store/productSlice";



const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {products} = useSelector((state)=>state.products)
  const [searchTerm,setSearchTerm] = useState("")   // search set empty first
  const [selectedItems,setSelectedItems] = useState("all")
  const [date,setDate] = useState("");
  // console.log(date);
  console.log(products);  
  // console.log(selectedItems);
  

  // filter products according to selectedItems that product select
  // const filteredproducts = selectedItems === "all" ? products: products.filter((product)=>product.productstatus === selectedItems) ; // if selected is all show all those status product ,else show selected products status. productstatus should be equal to product selected items
  // OR BEST WAY AND SHORTCUT
  const filteredProducts = products?.filter((product)=>selectedItems ==="all" || product.productStatus === selectedItems) 
  .filter((product)=>product._id.toLowerCase().includes(searchTerm.toLowerCase())  ||                // also search when your product _id should includes(match,present) , the selectedTerm that product select to search (|| means you can filter more according to your choice)
  product.productName.toLowerCase().includes(searchTerm.toLowerCase()))        // search with productname     // you can use || again and filter according to it whnat you gonna search accordingly

  .filter((product)=>date === "" || new Date(product.createdAt).toLocaleDateString() === new Date(date).toLocaleDateString())        // filter according to date product created at

  useEffect(() => {
    dispatch(fetchProducts());
  },[]);

  const handleDeleteProduct = (productId)=>{
    dispatch(deleteProduct(productId))
  }

  

  return (
    <div>
      <div className="bg-white p-8 rounded-md w-full container mx-auto max-w-2xl px-4  lg:max-w-7xl lg:px-8">
        <div className="pb-4">
            <h2 className="text-gray-900 font-semibold underline underline-offset-4">All Products</h2>
          </div>
        <div className="mb-4 flex items-center">

{/* filter by search */}
          {/* search */}
          <div className="flex items-center justify-between">
               <div>
          <select
            onChange={(e)=>setSelectedItems(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
            
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            
          </select>
          </div>
            <div className="flex bg-gray-50 items-center p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="bg-gray-50 outline-none ml-1 block "
                onChange={(e)=>setSearchTerm(e.target.value)}
                type="text"
                value={searchTerm}
                id=""
                placeholder="search..."
              />
            </div>

            {/* date */}
            <div className=" bg-gray-50 items-center p-2 rounded-md">
              <input
                className="bg-gray-50 outline-none ml-1 block "
                onChange={(e)=>setDate(e.target.value)}
                type="date"
                value={date}
                id=""
                
              />
            </div>
          </div>
        </div>


        <div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
               <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      S.N
                    </th>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      productId
                    </th>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      productName
                    </th>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product StockQty
                    </th>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product Price
                    </th>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Registered At
                    </th>
                    <th className="px-5 py-3 bproduct-b-2 bproduct-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts &&
                    filteredProducts.length > 0 &&
                    filteredProducts.map((product,index) => (
                      <tr key={product._id}>
                        <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-[#540b0e] whitespace-no-wrap font-bold ">
                            {index + 1}
                          </p>
                        </td>
                        <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-[#540b0e] whitespace-no-wrap font-bold hover:cursor-pointer hover:underline" onClick={()=>navigate(`/admin/products/${product._id}`)}>
                            {product._id}
                          </p>
                        </td>
                        <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {product.productName}
                          </p>
                        </td>

                        <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {product.productStockQuantity}
                          </p>
                        </td>
                         <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {product.productPrice}
                          </p>
                        </td>
                         <td className="px-5 py-5 bproduct-b bproduct-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {/* this will create a date   */}
                              {new Date(product.createdAt).toLocaleDateString()}                
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <button  onClick={()=>handleDeleteProduct(product._id)} className="text-white bg-red-800 px-4 py-2 rounded text-xm whitespace-no-wrap">
                            Delete                
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>  


{/*       
              <div className="px-5 py-5 bg-white bproduct-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                <span className="text-xs xs:text-sm text-gray-900">
                  Showing 1 to 4 of 50 Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">
                    Prev
                  </button>
                  &nbsp; &nbsp;
                  <button className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">
                    Next
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
