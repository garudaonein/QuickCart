import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import QRCode from 'react-qr-code';

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, getToken, user , cartItems, setCartItems, products } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const upiId = "prabudulasi90@oksbi"; //Seller UPI ID prabudulasi90@oksbi
  const upiLink = `upi://pay?pa=${upiId}&pn=Prabu%20D&am=${getCartAmount() + Math.floor(getCartAmount() * 0.05)}&cu=INR`;
  const upiRedirect = `upi://pay?pa=${upiId}&pn=Prabu%20D&cu=INR`;

  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    try {
      
      const token = await getToken()
      const {data} = await axios.get('/api/user/get-address',{headers:{Authorization:`Bearer ${token}`}})
      if (data.success) {
        setUserAddresses(data.addresses)
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0])
        }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    try {

      if (!user) {
        return toast('Please login to place order',{
          icon: '⚠️',
        })
    }
      
      if (!selectedAddress) {
        return toast.error('Please select an address')
      }

      let cartItemsArray = Object.keys(cartItems).map((key) => {
        const productInfo = products.find(p => p._id === key);
        return {
          product: key,
          product_name: productInfo?.name,
          quantity: cartItems[key]
        };
      });

      cartItemsArray = cartItemsArray.filter(item => item.quantity > 0)

      if (cartItemsArray.length === 0) {
        return toast.error('Cart is empty')
      }

      const token = await getToken()

      const { data } = await axios.post('/api/order/create',{
        address: selectedAddress._id,
        items: cartItemsArray,
      },{
        headers: {Authorization:`Bearer ${token}`}
      })

      if (data.success) {
        toast.success(data.message)
        setCartItems({})
        router.push('/order-placed')
        console.log(products.name)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserAddresses();
    }
  }, [user])

  return (
    <div className="w-100 md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">

        <div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-base font-medium">
              <p className="uppercase text-gray-600">Items {getCartCount()}</p>
              <p className="text-gray-800">{currency}{getCartAmount()}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Shipping Fee</p>
              <p className="font-medium text-gray-800">Free</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Tax (5%)</p>
              <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.05)}</p>
            </div>
            <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
              <p>Total</p>
              <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.05)}</p>
            </div>
          </div>
          
          <hr className="border-gray-500/30 my-5" />

          <div className="">
            <label className="text-base font-medium uppercase text-gray-600 block mb-2">
              Select Address
            </label>
            <div className="relative inline-block w-full text-sm border">
              <button
                className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>
                  {selectedAddress
                    ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                    : "Select Address"}
                </span>
                <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                  {userAddresses.map((address, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                      onClick={() => handleAddressSelect(address)}
                    >
                      {address.fullName}, {address.area}, {address.city}, {address.state}
                    </li>
                  ))}
                  <li
                    onClick={() => router.push("/add-address")}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                  >
                    + Add New Address
                  </li>
                </ul>
              )}
            </div>
          </div>

          <hr className="border-gray-500/30 my-5" />

          <div className="flex flex-col items-center">
            <div className="flex justify-between text-lg md:text-xl font-medium pb-3">
              <p>Scan to Pay</p>
            </div>
            <QRCode value={upiLink} size={200} />
            <div className="mt-4 p-2 border border-gray-400 rounded">
              <a className="text-sm text-gray-600" href={upiRedirect}>UPI ID: {upiId}</a>
            </div>

          </div>

          <hr className="border-gray-500/30 my-5" />

          {/*<div>
            <label className="text-base font-medium uppercase text-gray-600 block mb-2">
              Transaction ID
            </label>
            <div className="flex flex-col items-start gap-3">
              <input
                type="text"
                placeholder="Enter the Transaction ID for Reference"
                className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
              />
            </div>
          </div>*/}

        </div>

      </div>

      <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;