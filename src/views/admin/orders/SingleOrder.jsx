import { socket } from 'App'
import { APIAuthenticated } from 'http'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updatePaymentStatus } from 'store/orderSlice'
import { updateOrderStatus } from 'store/orderSlice'


const SingleOrder = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {orders} = useSelector((state)=>state.orders)


  
  // intermediate problem solved start
  const [newOrder,setNewOrder] = useState([])
  const fetchOrders = async()=>{
    const response = await APIAuthenticated.get("/admin/orders/") 
    if(response.status === 200){
      setNewOrder(response.data.data)
    }
  }

  useEffect(()=>{
    fetchOrders()
  })
  const [filteredOrder] = orders ? orders.filter((order)=>order._id === id)  : newOrder.filter((order)=>order._id === id)// here we need only single selected order deteail so, order._id should be equal to selected order id from params . directly array desctructing beacuse it coming array
  // console.log(filteredOrder);
  
  // intermediate problem solved end

  
  const [orderStatus,setOrderStatus] = useState(filteredOrder?.orderStatus);
  const [paymentStatus,setPaymentStatus] = useState(filteredOrder?.paymentStatus);
  
  


  const handleOrderChange = (e)=>{
    socket.emit("updateOrderStatus",{
      status:e.target.value,
      orderId:id,
      userId:filteredOrder.user._id
    })

    setOrderStatus(e.target.value)
    dispatch(updateOrderStatus(id,e.target.value))
    toast.success(` Order Status changed to : ${e.target.value}`)
    
  }

   const handlePaymentChange = (e)=>{
    setPaymentStatus(e.target.value)
    dispatch(updatePaymentStatus(id,e.target.value))
    toast.success(` Payment Status changed to : ${e.target.value}`)

    
  }
  // cancel order
  const deleteOrder = async()=>{
    try {
      const response = await APIAuthenticated.delete(`/admin/orders/${id}`)
      
      if(response.status ===200){
        toast.success("Order deleted successfully")
        navigate("/admin/orders")
      } 
    } catch (error) {
      console.log(error);
      toast.error(" failed to delete order!")
  
    }
  }
  
  
  return (
    <div className='container mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8'>
<div className="py-22">

  <div className="flex justify-start item-start space-y-2 flex-col my-6">
    <h1 className="text-2xl dark:text-white lg:text-2xl leading-4  text-gray-800"> <span className='font-semibold'>Order</span> : {id}</h1>
    <p className="text-2xl dark:text-white lg:text-2xl   text-gray-800"> <span className='font-semibold'>Order CreatedAt </span>  :  {filteredOrder && new Date(filteredOrder.createdAt).toLocaleString()}</p>
  </div>
  <div className='w-full h-[2px] bg-black mt-2 '></div>
  <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
    <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
      <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
        <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">My Order</p>
        {
          filteredOrder && filteredOrder.items.length > 0 && filteredOrder.items.map((item)=>{
            return(
              <div key={item._id} className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
          <div className="pb-4 md:pb-8 l md:w-[180px]">
            <img className="w-full hidden md:block" src={item.product.productImage} alt="dress" />
          </div>
          <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start  pb-8 space-y-4 md:space-y-0">
            <div className="md:w-40 flex flex-col justify-start items-start space-y-8">
              <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">{item.product.productName}</h3>
            </div>
            <div className="flex justify-between space-x-8 items-start w-full">
              <p className="text-base dark:text-white xl:text-lg leading-6">Rs: {item.product.productPrice}</p>
              <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">QTY : {item.quantity}</p>
              <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">Total Rs: {item.product.productPrice * item.quantity}</p>
            </div>
          </div>
        </div>
            )
          })
        }
      </div>
      <div className="flex justify-center flex-col md:flex-row  items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Summary</h3>
          <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Payment Method</p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">{filteredOrder?.paymentDetails.method}</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Payment Status</p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">{filteredOrder?.paymentDetails.status}</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Order Status</p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">{filteredOrder?.orderStatus}</p>
            </div>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Total</p>
            <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">{filteredOrder?.totalAmount}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Shipping</h3>
          <div className="flex justify-between items-start w-full">
            <div className="flex justify-center items-center space-x-4">
              <div className="w-8 h-8">
                <img className="w-full h-full" alt="logo" src="https://i.ibb.co/L8KSdNQ/image-3.png" />
              </div>
              <div className="flex flex-col justify-start items-center">
                <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800"> Delivery Charge<br /><span className="font-normal">Delivery with 24 Hours</span></p>
              </div>
            </div>
            <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">Rs 100</p>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-gray-50  dark:bg-gray-800 w-full h-[400px] xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
      <h3 className="text-xl dark:text-white font-semibold leading-4 text-gray-800 underline underline-offset-4 ">Customer</h3>
      <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
        <div className="flex flex-col justify-start items-start flex-shrink-0">
        </div>
        <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
          <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
            <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-2 xl:mt-8">
              {/* here finding userName from user by populating to user */}
              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">UserName : {filteredOrder?.user?.userName}</p>      
              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Address : {filteredOrder?.shippingAddress}</p>
              <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Phone : {filteredOrder?.phoneNumber}</p>
            </div>
          </div>

        <div className='mt-2'>
            {/* update order status */}
          <label class="block  text-sm font-medium text-gray-900 dark:text-gray-400">Select Order Status</label>
        <select  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleOrderChange}>
        {/* <option value={filteredOrder?.orderStatus}>{filteredOrder?.orderStatus}</option> */}
        <option value="delivered">Delivered</option>
        <option value="pending">Pending</option>
        <option value="preparation">Preparation</option>
        <option value="cancelled">Cancelled</option>
        <option value="ontheway">Ontheway</option>
    </select>


    {/* update payment status */}
    <label class="block  text-sm font-medium text-gray-900 dark:text-gray-400">Select Payment Status</label>
        <select  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full my-2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handlePaymentChange}>
        {/* <option value={filteredOrder?.orderStatus}>{filteredOrder?.orderStatus}</option> */}
        <option value="pending">Pending</option>
        <option value="unpaid">Unpaid</option>
        <option value="paid">Paid</option>
        
    </select>
        </div>
        

          {/* yedi orderStatus cancelled xa vane , edit order button, cancel button and delete button nadekhaune  nadekhaune */}
          {/* cancelled vako order haru lai edit and delete garna paudaina , so kina dekhaune? */}
          {/* only orderStatus jasko pending xa , uslai edit and delete and cancel dekhaune */}
         {
          filteredOrder?.orderStatus !== "cancelled" && (
          <div className="flex w-full justify-center items-center md:justify-start md:items-start">
            <button onClick={deleteOrder} className="mt-4 md:mt-0 bg-red-700 border-none text-white cursor-pointer rounded dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-3  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 w-96 2xl:w-full text-base font-medium leading-4 ">Delete Order</button>
          </div>
          

          )
         }
           
        </div>
      </div>
    </div>


  </div>
</div>
    </div>
  )
}

export default SingleOrder