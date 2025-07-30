import { STATUSES } from "globals/misc/statuses"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addProduct } from "store/productSlice"

const AddProduct = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {status} = useSelector((state)=>state.products)
    const {register,handleSubmit,formState} = useForm()
    const handleProduct = (data)=>{
        try {
          data = {...data, productImage:data.productImage[0]}         // ...data takes all data except image, so for image use this
        dispatch(addProduct(data))
        if(status === STATUSES.SUCCESS){
         toast.success("Product Added Successfully") 
        navigate("/admin/products")
        }
        } catch (error) {
          console.error(error);
          toast.error("Failed to add products.Please try again later!")
          
          
        }
    }

  return (
    <div>
      <div className="min-h-screen  flex flex-col items-center justify-center bg-gray-100">
        <div
          className="
            flex flex-col
            bg-white
            shadow-md
            px-4
            sm:px-6
            md:px-8
            lg:px-10
            py-8
            rounded-3xl
            w-full
            max-w-2xl
          "
        >
          <div className="font-medium self-center text-xl sm:text-3xl text-gray-800 underline underline-offset-8">
            Add new product
          </div>
       

          <div className="mt-6">
            <form onSubmit={handleSubmit((data)=>{
                handleProduct(data)
                
            })}>
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="productName"
                  className="mb-1 text-xs sm:text-lg tracking-wide text-gray-900"
                >
                  ProductName
                </label>
                <div className="relative">
                  <div
                    className="
                      inline-flex
                      items-center
                      justify-center
                      absolute
                      left-0
                      top-0
                      h-full
                      w-10
                      text-gray-400
                    "
                  >
                    <span>
                      <i className="fas fa-lock text-blue-500"></i>
                    </span>
                  </div>

                  <input
                    id="productName"
                    type="text"
                    name="productName"
                    {...register("productName",{required:"ProductName is required "})}
                    
                    className="
                      text-lg
                      placeholder-gray-500
                      pl-10
                      pr-4
                      rounded-2xl
                      border border-gray-400
                      w-full
                      py-2
                      focus:outline-none focus:border-blue-400
                    "
                    placeholder="Enter your productName"
                  />
                </div>
                <p className="text-red-600 mt-1">{formState.errors.productName && formState.errors.productName.message}</p>
              </div>
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="productDescription"
                  className="mb-1 text-xs sm:text-lg tracking-wide text-gray-900"
                >
                  ProductDescription
                </label>
                <textarea name="productDescription" id="productDescription" className="text-lg
                      placeholder-gray-500
                      pl-10
                      pr-4
                      rounded-2xl
                      border border-gray-400
                      w-full
                      py-2
                      focus:outline-none focus:border-blue-400"
                      placeholder="Enter your productDescription"
                                          {...register("productDescription",{required:"ProductDescription is required "})}

                      >
                    
                </textarea>
             <p className="text-red-600 mt-1">{formState.errors.productDescription && formState.errors.productDescription.message}</p>

              </div>


            <div className="flex justify-between gap-4">
              {/* Stock and Price */}
              <div className="w-1/2">
                <div className="flex flex-col mb-4">
                  <label htmlFor="productPrice" className="mb-1 text-xs sm:text-lg tracking-wide text-gray-900">
                    ProductPrice
                  </label>
                  <div className="relative">
                    <input
                      id="productPrice"
                      type="number"
                      name="productPrice"
                      className="text-lg placeholder-gray-500 pl-10 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                      placeholder="ProductPrice"
                      {...register("productPrice",{required:"ProductPrice is required "})}

                    />
                  </div>
                   <p className="text-red-600 mt-1">{formState.errors.productPrice && formState.errors.productPrice.message}</p>
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="productStockQuantity" className="mb-1 text-xs sm:text-lg tracking-wide text-gray-900">
                    ProductStockQuantity
                  </label>
                  <div className="relative">
                    <input
                      id="productStockQuantity"
                      type="number"
                      name="productStockQuantity"
                      className="text-lg placeholder-gray-500 pl-10 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                      placeholder="StockQuantity"
                    {...register("productStockQuantity",{required:"ProductStockQuantity is required "})}

                    />
                  </div>
                   <p className="text-red-600 mt-1">{formState.errors.productStockQuantity && formState.errors.productStockQuantity.message}</p>
                </div>
              </div>

              <div className="w-1/2">
                <div className="flex flex-col mb-4">
                  <label htmlFor="productStatus" className="mb-1 text-xs sm:text-lg tracking-wide text-gray-900">
                    ProductStatus
                  </label>
                  <div>
                    <select name="productStatus" id="productStatus" {...register("productStatus",{required:"ProductStatus is required "})}
                    className="w-full rounded-2xl border border-gray-400 py-2 px-2">
                      <option value="" selected>Select Status</option>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                   <p className="text-red-600 mt-1">{formState.errors.productStatus && formState.errors.productStatus.message}</p>
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="productImage" className="mb-1 text-xs sm:text-lg tracking-wide text-gray-900">
                    ProductImage
                  </label>
                  <div className="relative">
                    <input
                      id="productImage"
                      type="file"
                      name="productImage"
                      className="text-lg placeholder-gray-500 pl-10 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
                      placeholder="productImage"
                       {...register("productImage",{required:"ProductImage is required "})}

                    />
                  </div>
                   <p className="text-red-600 mt-1">{formState.errors.productImage && formState.errors.productImage.message}</p>
                </div>
              </div>
            </div>
         

              <div className="flex w-full">
                <button
                  type="submit"
                  className="
                    flex
                    mt-2
                    items-center
                    justify-center
                    focus:outline-none
                    text-white text-sm
                    sm:text-base
                    bg-blue-500
                    hover:bg-blue-600
                    rounded-2xl
                    py-2
                    w-full
                    transition
                    duration-150
                    ease-in
                  "
                >
                    Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    
    </div>
  )
}

export default AddProduct










