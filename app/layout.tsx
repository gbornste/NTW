import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { FavoritesProvider } from "@/contexts/favorites-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NTW - Next Trade Web",
  description: "Revolutionary E-commerce Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-1">
                    {children}
                  </main>
                </div>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
