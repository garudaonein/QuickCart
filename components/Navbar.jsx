"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {

  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk()

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-12 md:w-12"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/grocery" className="hover:text-gray-900 transition">
          Grocery
        </Link>
        <Link href="/entertainment" className="hover:text-gray-900 transition">
          Entertainment
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {/*isSeller && <button onClick={() => router.push('/admin')} className="text-xs border px-4 py-1.5 rounded-full">Admin Dashboard</button>*/}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        {/*<Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />*/}
        {
          user
            ? <>
              <UserButton>
                {isSeller && (
                  <UserButton.MenuItems>
                    <UserButton.Action label="Admin Dashboard" labelIcon={<HomeIcon />} onClick={() => router.push('/admin')} />
                  </UserButton.MenuItems>
                )}
                <UserButton.MenuItems>
                  <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
                </UserButton.MenuItems>
              </UserButton>
            </>
            : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>
        }
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {/*isSeller && <button onClick={() => router.push('/admin')} className="text-xs border px-4 py-1.5 rounded-full">Admin Dashboard</button>*/}
        {
          user
            ? <>
              <UserButton>
              {isSeller && (
                  <UserButton.MenuItems>
                    <UserButton.Action label="Admin Dashboard" labelIcon={<HomeIcon />} onClick={() => router.push('/admin')} />
                  </UserButton.MenuItems>
                )}
              <UserButton.MenuItems>
                  <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={() => router.push('/')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Grocery" labelIcon={<BoxIcon />} onClick={() => router.push('/grocery')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Entertainment" labelIcon={<BoxIcon />} onClick={() => router.push('/entertainment')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
                </UserButton.MenuItems>
              </UserButton>
            </>
            : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image src={assets.user_icon} alt="user icon" />
              Account
            </button>
        }
      </div>
    </nav>
  );
};

export default Navbar;