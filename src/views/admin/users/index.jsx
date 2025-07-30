import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {useNavigate} from "react-router-dom"
import { deleteUser } from "store/userSlice";
import { fetchUsers } from "store/userSlice";


const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {users} = useSelector((state)=>state.users)
  console.log(users);  
  const [searchTerm,setSearchTerm] = useState("")   // search set empty first
  const [date,setDate] = useState("");
  // console.log(date);
  // console.log(selectedItems);
  

  // filter users according to selectedItems that user select
  // const filteredusers = selectedItems === "all" ? users: users.filter((user)=>user.userstatus === selectedItems) ; // if selected is all show all those status user ,else show selected users status. userstatus should be equal to user selected items
  // OR BEST WAY AND SHORTCUT
  const filteredUsers = users?.filter((user)=>user._id.toLowerCase().includes(searchTerm.toLowerCase())  ||                // also search when your user _id should includes(match,present) , the selectedTerm that user select to search (|| means you can filter more according to your choice)
  user.userName.toLowerCase().includes(searchTerm.toLowerCase())  ||        // search with username     // you can use || again and filter according to it whnat you gonna search accordingly
  user.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||              // search with email
  user.userPhoneNumber.toString().includes(searchTerm))              // search with phone

  .filter((user)=>date === "" || new Date(user.createdAt).toLocaleDateString() === new Date(date).toLocaleDateString())        // filter according to date user created at

  useEffect(() => {
    dispatch(fetchUsers());
  },[]);

  const handleDeleteId = (userId)=>{
    try {
    dispatch(deleteUser(userId))
    toast.success("User deleted successfully")
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user") 
      
    }
  }
  

  return (
    <div>
      <div className="bg-white p-8 rounded-md w-full container mx-auto max-w-2xl px-4  lg:max-w-7xl lg:px-8">
       <div className="pb-4">
            <h2 className="text-gray-900 font-semibold underline underline-offset-4">All Users</h2>
          </div>
        <div className="mb-4 flex items-center">

{/* filter by search */}
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
                    <th className="px-5 py-3 buser-b-2 buser-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      S.N
                    </th>
                    <th className="px-5 py-3 buser-b-2 buser-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      userId
                    </th>
                    <th className="px-5 py-3 buser-b-2 buser-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      UserName
                    </th>
                    <th className="px-5 py-3 buser-b-2 buser-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3 buser-b-2 buser-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-5 py-3 buser-b-2 buser-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Registered At
                    </th>
                    <th className="px-5 py-3 buser-b-2 buser-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers &&
                    filteredUsers.length > 0 &&
                    filteredUsers.map((user,index) => (
                      <tr key={user._id}>
                        <td className="px-5 py-5 buser-b buser-gray-200 bg-white text-sm">
                          <p className="text-[#540b0e] whitespace-no-wrap font-bold ">
                            {index + 1}
                          </p>
                        </td>
                        <td className="px-5 py-5 buser-b buser-gray-200 bg-white text-sm">
                          <p className="text-[#540b0e] whitespace-no-wrap font-bold " >
                            {user._id}
                          </p>
                        </td>
                        <td className="px-5 py-5 buser-b buser-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {user.userName}
                          </p>
                        </td>

                        <td className="px-5 py-5 buser-b buser-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {user.userEmail}
                          </p>
                        </td>
                         <td className="px-5 py-5 buser-b buser-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {user.userPhoneNumber}
                          </p>
                        </td>
                         <td className="px-5 py-5 buser-b buser-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap font-semibold">
                            {/* this will create a date  */}
                            {new Date(user.createdAt).toLocaleDateString()}                
                          </p>
                        </td>
                         <td className="px-5 py-5 buser-b buser-gray-200 bg-white text-sm cursor-pointer" onClick={()=>handleDeleteId(user._id)}>
                          <p className=" text-white bg-red-800 px-4 py-2 rounded text-xm whitespace-no-wrap">
                            Delete                
                          </p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* <div className="px-5 py-5 bg-white buser-t flex flex-col xs:flex-row items-center xs:justify-between          ">
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

export default Users;
