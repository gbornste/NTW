import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Home, Mail, ShoppingBag, Gamepad2, Gift, FileText, User, Shield, Map } from "lucide-react"

export default function SitemapPage() {
  // Define all site pages organized by category
  const siteStructure = [
    {
      category: "Main Pages",
      icon: <Home className="h-5 w-5" />,
      pages: [
        { title: "Home", url: "/" },
        { title: "About Us", url: "/about" },
        { title: "Contact Us", url: "/contact" },
      ],
    },
    {
      category: "Greeting Cards",
      icon: <Gift className="h-5 w-5" />,
      pages: [
        { title: "Create Card", url: "/create-card" },
        { title: "Card Templates", url: "/create-card" },
        { title: "Send a Card", url: "/create-card" },
      ],
    },
    {
      category: "Games",
      icon: <Gamepad2 className="h-5 w-5" />,
      pages: [
        { title: "Games Home", url: "/games" },
        { title: "Word Scramble", url: "/games/word-scramble" },
        { title: "Political Quiz", url: "/games/quiz" },
        { title: "Political Trivia", url: "/games/trivia" },
        { title: "Memory Match", url: "/games/memory" },
      ],
    },
    {
      category: "Store",
      icon: <ShoppingBag className="h-5 w-5" />,
      pages: [
        { title: "Store Home", url: "/store" },
        { title: "Clothing", url: "/store?category=clothing" },
        { title: "Accessories", url: "/store?category=accessories" },
      ],
    },
    {
      category: "News",
      icon: <FileText className="h-5 w-5" />,
      pages: [
        { title: "Headlines", url: "/news" },
        { title: "Individual Articles", url: "/news/[id]", note: "(Dynamic pages for each article)" },
      ],
    },
    {
      category: "User Account",
      icon: <User className="h-5 w-5" />,
      pages: [
        { title: "Login", url: "/login" },
        { title: "Sign Up", url: "/signup" },
        { title: "Profile", url: "/profile" },
        { title: "Orders", url: "/orders" },
        { title: "Wishlist", url: "/wishlist" },
        { title: "Settings", url: "/settings" },
      ],
    },
    {
      category: "Legal Pages",
      icon: <Shield className="h-5 w-5" />,
      pages: [
        { title: "Terms of Service", url: "/terms" },
        { title: "Privacy Policy", url: "/privacy" },
      ],
    },
    {
      category: "Utility Pages",
      icon: <Map className="h-5 w-5" />,
      pages: [{ title: "Sitemap", url: "/sitemap" }],
    },
  ]

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Sitemap</h1>
        <p className="text-muted-foreground max-w-[700px]">A complete map of all pages on NoTrumpNWay.com</p>
      </div>

      {/* Visual Sitemap */}
      <div className="grid gap-8 mb-12">
        {siteStructure.map((section, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-2">
              {section.icon}
              <div>
                <CardTitle>{section.category}</CardTitle>
                <CardDescription>
                  {section.pages.length} page{section.pages.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {section.pages.map((page, pageIndex) => (
                  <li key={pageIndex}>
                    <Link
                      href={page.url !== "/news/[id]" ? page.url : "#"}
                      className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{page.title}</span>
                      {page.note && <span className="text-xs text-muted-foreground ml-2">({page.note})</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Text-based Sitemap (for SEO and accessibility) */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-bold mb-6">Text Sitemap</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteStructure.map((section, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{section.category}</h3>
              <ul className="space-y-1 text-sm">
                {section.pages.map((page, pageIndex) => (
                  <li key={pageIndex}>
                    {page.url !== "/news/[id]" ? (
                      <Link href={page.url} className="text-primary hover:underline">
                        {page.title}
                      </Link>
                    ) : (
                      <span>
                        {page.title} {page.note && <span className="text-xs text-muted-foreground">({page.note})</span>}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* XML Sitemap Information */}
      <div className="mt-16 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">XML Sitemap for Search Engines</h2>
        <p className="text-muted-foreground mb-4">
          For search engine optimization purposes, an XML version of this sitemap is available at:
        </p>
        <Card className="max-w-md">
          <CardContent className="p-4">
            <code className="text-sm">https://notrumpnway.com/sitemap.xml</code>
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground mt-4">
          The XML sitemap is automatically submitted to search engines to help them discover and index all pages on your
          website.
        </p>
      </div>

      {/* Contact Information */}
      <div className="mt-16 border-t pt-8 text-center">
        <h2 className="text-xl font-bold mb-4">Need Help Finding Something?</h2>
        <p className="text-muted-foreground mb-6">
          If you can't find what you're looking for, please don't hesitate to contact us.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact Us
        </Link>
      </div>
    </div>
  )
}
