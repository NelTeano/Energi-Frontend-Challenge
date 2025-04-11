import React from 'react'
import MetaMaskLogo from '@/public/metamask-icon.png'
import Image from 'next/image'

export default function Loader() {
  return (
    <div>
        <div className="flex mt-[200px] bg-transparent">
            <Image
            src={MetaMaskLogo}
            alt="MetaMask Logo"
            width={100}
            height={100}
            className="animate-pulse"
            />
        </div>
    </div>
  )
}
