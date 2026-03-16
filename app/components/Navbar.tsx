import Image from 'next/image'
import React from 'react'
import LogoComponent from './LogoComponent'
import { Separator } from '@/components/ui/separator'

const Navbar = () => {
    const navItems = ['How it works', 'Occasions', 'Pricing'];
  return (
    <nav className='bg-background font-dm-sans'>
      <div className='flex items-center justify-between h-20 px-5'>
        <LogoComponent />
        <ul className='flex gap-5 text-sm font-normal text-muted-taupe'>
         {navItems.map((item) => (
            <li key={item} className='text-muted-taupe hover:text-terracotta transition-colors  cursor-pointer'>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
    </nav>
  )
}

export default Navbar