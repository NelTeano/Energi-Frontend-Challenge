import React from 'react'

export default function Navbar() {
  return (
        <nav className='flex items-center justify-center w-full px-4 py-2 bg-gray-800 text-white'>
            <div className='flex gap-4'>
                <a href="/" className='hover:text-gray-400'>Home</a>
                <a href="/Wallet" className='hover:text-gray-400'>Wallet</a>
            </div>
        </nav>
  )
}
