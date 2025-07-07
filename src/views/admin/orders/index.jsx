import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
import { orderDelete } from "store/orderSlice";
import { fetchOrder } from "store/orderSlice";
import toast from "react-hot-toast"

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { orders } = useSelector((state) => state.orders);
  // console.log(orders);
  const [selectedItems,setSelectedItems] = useState("all")    // orderstauts
  const [searchTerm,setSearchTerm] = useState("")   // search set empty first
  const [date,setDate] = useState("");
  // console.log(date);
  // console.log(selectedItems);

  // filter orders according to selectedItems that user select
  // const filteredOrders = selectedItems === "all" ? orders: orders.filter((order)=>order.orderStatus === selectedItems) ; // if selected is all show all those status order ,else show selected orders status. orderStatus should be equal to user selected items
  // OR BEST WAY AND SHORTCUT
  const filteredOrders = orders?.filter((order)=>selectedItems ==="all" || order.orderStatus === selectedItems)             // it says that if initially set all true and if false select according to orderStatus user selected
  .filter((order)=>order._id.toLowerCase().includes(searchTerm.toLowerCase())  ||                // also search when your order _id should includes(match,present) , the selectedTerm that user select to search (|| means you can filter more according to your choice)
  order.paymentDetails.method.toLowerCase().includes(searchTerm.toLowerCase())  ||                 // you can use || again and filter according to it whnat you gonna search accordingly
  order.user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||             // you can use || again and filter according to it whnat you gonna search accordingly
  order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()))                // you can use || again and filter according to it whnat you gonna search accordingly
  .filter((order)=>date === "" || new Date(order.createdAt).toLocaleDateString() === new Date(date).toLocaleDateString())        // filter according to date order created at

  useEffect(() => {
    dispatch(fetchOrder());
  }, []);

const handleDeleteOrder = async (orderId) => { 
  try {
    await dispatch(orderDelete(orderId)).unwrap();
    toast.success("Order deleted successfully!");
  } catch (error) {
    console.error("Failed to delete order:", error);
    toast.error("Failed to delete order. Please try again.");
  }
};

  return (
    <div>
      <div className="bg-white p-8 rounded-md w-full container mx-auto max-w-2xl px-4  lg:max-w-7xl lg:px-8">
          <div className="pb-4">
            <h2 className="text-gray-900 font-semibold underline underline-offset-4">All Orders</h2>
          </div>
        
{/* filter by order Status */}
        <div className="mb-4 flex items-center">
            <div>
          <select
            onChange={(e)=>setSelectedItems(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
            
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="preparation">Preparation</option>
            <option value="ontheway">Ontheway</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          </div>
          {/* search */}
          <div className="flex items-center justify-between">
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
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      S.N.
                    </th>
                     <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      UserName
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      OrderId
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ordered At
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders &&
                    filteredOrders.length > 0 &&
                    filteredOrders.map((order,index) => (
                      <tr key={order._id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-[#540b0e] whitespace-no-wrap font-bold ">
                            {index + 1}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-[#540b0e] whitespace-no-wrap font-bold ">
                            {order?.user?.userName}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-[#540b0e] whitespace-no-wrap font-bold hover:cursor-pointer hover:underline" onClick={()=>navigate(`/admin/orders/${order._id}`)}>
                            {order._id}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {order.totalAmount}
                          </p>
                        </td>

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span
                            className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full
                                  ${
                                    order.paymentDetails.status === "paid"
                                      ? "text-green-900 bg-green-200"
                                      : "text-red-900 bg-red-200"
                                  }
                                `}
                          >
                            <span className="relative">
                              {order.paymentDetails.status} (
                              {order.paymentDetails.method})
                            </span>
                          </span>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span
                            className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full
                                  ${
                                    order.orderStatus === "pending"
                                      ? "text-red-900 bg-red-200"
                                      : "text-green-900 bg-green-200"
                                  }
                                `}
                          >
                            <span className="relative">
                              {order.orderStatus}
                            </span>
                          </span>
                        </td>
                         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {/* this will create a date  */}
                            {new Date(order.createdAt).toLocaleDateString()}                
                          </p>
                        </td>

                         <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <button  onClick={()=>handleDeleteOrder(order._id)} className="text-white bg-red-800 px-4 py-2 rounded text-xm whitespace-no-wrap">
                            Delete                
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
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

export default Orders;
