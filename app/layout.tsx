import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { CartProvider } from "@/contexts/cart-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NoTrumpNWay - Create Cards, Games & Shop",
  description: "Create witty political greeting cards, play games, and shop for merchandise",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <div className="min-h-screen">
                  <Navbar />
                  <main className="pt-16">
                    {children}
                  </main>
                </div>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
