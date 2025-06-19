"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import { useCart } from "@/contexts/cart-context"
import { useFavorites } from "@/contexts/favorites-context"
import { useAuth } from "@/contexts/auth-context"
import {
  Menu,
  ShoppingCart,
  LogIn,
  UserPlus,
  Newspaper,
  Store,
  PenTool,
  Gamepad2,
  Info,
  Mail,
  Sun,
  Moon,
  Heart,
  User,
  LogOut,
  Settings,
} from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const { itemCount } = useCart()
  const { itemCount: favoritesCount } = useFavorites()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
      closeMenu()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navItems = [
    { name: "News", path: "/news", icon: <Newspaper className="h-4 w-4 mr-2" /> },
    { name: "Store", path: "/store", icon: <Store className="h-4 w-4 mr-2" /> },
    { name: "Create Card", path: "/create-card", icon: <PenTool className="h-4 w-4 mr-2" /> },
    { name: "Games", path: "/games", icon: <Gamepad2 className="h-4 w-4 mr-2" /> },
    { name: "About", path: "/about", icon: <Info className="h-4 w-4 mr-2" /> },
    { name: "Contact", path: "/contact", icon: <Mail className="h-4 w-4 mr-2" /> },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-4 py-4">
                  <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    onClick={closeMenu}
                  >
                    <Image src="/images/logo.png" alt="NoTrumpNWay Logo" width={40} height={40} />
                    <span className="font-bold">NoTrumpNWay</span>
                  </Link>
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={closeMenu}
                        className={`flex items-center px-2 py-1.5 text-sm rounded-md transition-colors ${
                          isActive(item.path)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto flex flex-col gap-2">
                    {!isAuthenticated ? (
                      <>
                        <Link href="/login" onClick={closeMenu}>
                          <Button variant="outline" className="w-full justify-start">
                            <LogIn className="h-4 w-4 mr-2" />
                            Login
                          </Button>
                        </Link>
                        <Link href="/signup" onClick={closeMenu}>
                          <Button className="w-full justify-start">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/profile" onClick={closeMenu}>
                          <Button variant="outline" className="w-full justify-start">
                            <User className="h-4 w-4 mr-2" />
                            My Profile
                          </Button>
                        </Link>
                        <Button onClick={handleLogout} variant="destructive" className="w-full justify-start">
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity mr-6 md:mr-8">
            <Image
              src="/images/logo.png"
              alt="NoTrumpNWay Logo"
              width={40}
              height={40}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=40&width=40&text=Logo"
              }}
            />
            <span className="font-bold text-lg whitespace-nowrap">NoTrumpNWay</span>
          </Link>
        </div>

        {!isMobile && (
          <nav className="hidden md:flex items-center gap-2 ml-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/store/favorites">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className={`h-5 w-5 ${favoritesCount > 0 ? "text-red-500 fill-current" : ""}`} />
              {mounted && favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
              <span className="sr-only">Favorites</span>
            </Button>
          </Link>

          <Link href="/store/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>
          </Link>

          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  {isAuthenticated && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-2 w-2 flex items-center justify-center"></span>
                  )}
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                      {user?.name || user?.email || "User"}
                      {user?.isDemo && " (Demo)"}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/store/orders" className="flex items-center cursor-pointer">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="flex items-center cursor-pointer">
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" className="flex items-center cursor-pointer">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
