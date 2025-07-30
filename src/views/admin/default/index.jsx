
import { MdBarChart, MdOutlineShoppingCart, MdPerson } from "react-icons/md";


import Widget from "components/widget/Widget";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllData } from "store/dataSlice";

const Dashboard = () => {
  const dispatch = useDispatch()
  const {data:datas} = useSelector((state)=>state.datas)    // data from reduc toolkit and initializing to datas

  useEffect(()=>{
    dispatch(fetchAllData())
  },[])


  // finding recently ordered users shortcut
  // we have datas , from there taking userId 
  const totalOrderedUsers = datas && datas.allOrders?.map((order)=>{
    return {
      userId: order.user?._id
    }
  })
  const uniqueTotalOrderedUsers = [...new Set( totalOrderedUsers?.map((user)=>user.userId))]
  
 
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdPerson className="h-7 w-7" />}
          title={"Users"}
          subtitle={datas.users}
        />
        <Widget
          icon={<MdBarChart className="h-6 w-6" />}
          title={"Products"}
          subtitle={datas.products}
        />
        <Widget
          icon={<MdOutlineShoppingCart className="h-7 w-7" />}
          title={"Orders"}
          subtitle={datas.orders}
        />
       
      </div>
    </div>
  );
};

export default Dashboard;
