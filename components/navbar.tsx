'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, ShoppingCart, Sun, Moon, Home, Store, Heart, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCart } from '@/contexts/cart-context'

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { itemCount } = useCart()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Store', href: '/store', icon: Store },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-14 items-center'>
        <div className='mr-4 hidden md:flex'>
          <Link href='/' className='mr-6 flex items-center space-x-2'>
            <span className='hidden font-bold sm:inline-block'>NTW</span>
          </Link>
          <nav className='flex items-center space-x-6 text-sm font-medium'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='transition-colors hover:text-foreground/80 text-foreground/60'
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
            >
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='pr-0'>
            <Link
              href='/'
              className='flex items-center'
              onClick={() => setIsOpen(false)}
            >
              <span className='font-bold'>NTW</span>
            </Link>
            <div className='my-4 h-[calc(100vh-8rem)] pb-10 pl-6'>
              <div className='flex flex-col space-y-3'>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className='flex items-center space-x-2 text-sm font-medium'
                  >
                    <item.icon className='h-4 w-4' />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'>
            <Link href='/' className='md:hidden'>
              <span className='font-bold'>NTW</span>
            </Link>
          </div>
          <nav className='flex items-center space-x-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='h-8 w-8 px-0'
            >
              <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
              <span className='sr-only'>Toggle theme</span>
            </Button>
            <Link href='/cart'>
              <Button variant='ghost' size='sm' className='relative h-8 w-8 px-0'>
                <ShoppingCart className='h-4 w-4' />
                {itemCount > 0 && (
                  <span className='absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center'>
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
