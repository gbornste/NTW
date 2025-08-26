'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, ShoppingCart, Sun, Moon, Heart, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCart } from '@/contexts/cart-context'

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { itemCount } = useCart()

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/95 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/95 shadow-sm'>
      <div className='container flex h-16 items-center justify-between px-4'>
        {/* Logo Section */}
        <div className='flex items-center space-x-4'>
          <Link href='/' className='flex items-center space-x-3 hover:opacity-90 transition-opacity'>
            <Image
              src='/images/logo.png'
              alt='NoTrumpNWay Logo'
              width={40}
              height={40}
              className='rounded-lg'
            />
            <div className='hidden sm:block'>
              <span className='text-xl font-bold text-gray-900 dark:text-white'>
                NoTrumpNWay
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className='flex items-center space-x-3 md:hidden'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='h-9 w-9 p-0'
          >
            <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
          </Button>
          
          <Link href='/store/favorites'>
            <Button variant='ghost' size='sm' className='h-9 w-9 p-0'>
              <Heart className='h-4 w-4' />
              <span className='sr-only'>Favorites</span>
            </Button>
          </Link>
          
          <Link href='/store/cart'>
            <Button variant='ghost' size='sm' className='relative h-9 w-9 p-0'>
              <ShoppingCart className='h-4 w-4' />
              {itemCount > 0 && (
                <span className='absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium'>
                  {itemCount}
                </span>
              )}
              <span className='sr-only'>Shopping cart</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-9 w-9 p-0'>
                <User className='h-4 w-4' />
                <span className='sr-only'>User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem asChild>
                <Link href='/profile'>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/orders'>Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/settings'>Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Right Side */}
        <div className='hidden md:flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className='h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800'
            title='Toggle theme'
          >
            <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
          </Button>
          
          <Link href='/store/favorites'>
            <Button 
              variant='ghost' 
              size='sm' 
              className='h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800'
              title='Favorites'
            >
              <Heart className='h-4 w-4' />
              <span className='sr-only'>Favorites</span>
            </Button>
          </Link>
          
          <Link href='/store/cart'>
            <Button 
              variant='ghost' 
              size='sm' 
              className='relative h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800'
              title='Shopping cart'
            >
              <ShoppingCart className='h-4 w-4' />
              {itemCount > 0 && (
                <span className='absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium'>
                  {itemCount}
                </span>
              )}
              <span className='sr-only'>Shopping cart</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant='ghost' 
                size='sm' 
                className='h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800'
                title='User menu'
              >
                <User className='h-4 w-4' />
                <span className='sr-only'>User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem asChild>
                <Link href='/profile'>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/orders'>Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/settings'>Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
