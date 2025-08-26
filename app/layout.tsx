import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TRUMP WATCH",
  description: "Stay informed with the latest updates",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          <nav className="bg-black text-white p-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-red-600">TRUMP WATCH</h1>
            </div>
          </nav>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
