'use client'
import React from 'react'
import { House, Wallet} from 'lucide-react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navbar() {
  
  const pathname = usePathname()
  
  const navTabs = [
    {
      name: "Home",
      icon: <House className='text-2xl' />,
      href: "/"
    },
    {
      name: "Wallet",
      icon: <Wallet className='text-2xl' />,
      href: "/wallet"
    }
  ];

  console.log("window location : ", pathname);

  return (
    <nav className='flex items-center justify-center w-full h-[100px] light:text-gray-800 dark:text-white shadow-md'>
      <div className='flex flex-row h-full gap-10'>
        {navTabs.map((tab, index) => (
          <Link
            key={index}
            href={tab.href}
            className={`flex items-center gap-2 px-6 ${
              pathname === tab.href
                ? "cursor-not-allowed text-gray-500 border-b-2 border-green-500 font-semibold"
                : "hover:border-b-2 border-none hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold  duration-100 ease-in-out"
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
