import Image from 'next/image'
import React from 'react'
import LogoComponent from './LogoComponent'

const Navbar = () => {
  return (
    <nav className='bg-background font-semibold h-20 flex items-center justify-between p-5 font-dm-sans'>
        <div className=''>
            <LogoComponent />
        </div>
        <div className=''>
            <ul className='text-[14px] font-normal flex justify-between space-x-5 text-muted-taupe'>
                <li>How it works</li>
                <li>Occasions</li>
                <li>Pricing</li>
                
            </ul>
        </div>
    </nav>
  )
}

export default Navbar