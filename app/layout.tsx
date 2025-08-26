import { Inter } from "next/font/google"
import "./globals.css"
import SimpleNavbar from "@/components/simple-navbar"
import { CartProvider } from "@/contexts/simple-cart-context"
import { FavoritesProvider } from "@/contexts/simple-favorites-context"
import { ThemeProvider } from "@/contexts/simple-theme-context"

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
          <CartProvider>
            <FavoritesProvider>
              <div className="min-h-screen">
                <SimpleNavbar />
                <main>
                  {children}
                </main>
              </div>
            </FavoritesProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
