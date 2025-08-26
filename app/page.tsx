import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* TRUMP WATCH Red Banner */}
      <div className="bg-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">TRUMP WATCH: Latest Headlines</h2>
              <p className="text-sm opacity-90">Last updated: Just now</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-sm font-medium transition-colors">
                 Refresh
              </button>
              <Link href="/news" className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-sm font-medium transition-colors">
                View All Headlines
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to TRUMP WATCH</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Your premier destination for luxury timepieces and political merchandise.
            </p>
            <Link href="/store" className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold rounded transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Three Feature Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold mb-2">Luxury Watches</h3>
              <p className="text-gray-600 mb-6">
                Discover our exclusive collection of premium timepieces.
              </p>
              <Link href="/store/watches" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition-colors">
                View Watches
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold mb-2">Merchandise</h3>
              <p className="text-gray-600 mb-6">
                Shop our collection of t-shirts, mugs, and accessories.
              </p>
              <Link href="/store/merchandise" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium transition-colors">
                Shop Merch
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="text-xl font-bold mb-2">Exclusive Items</h3>
              <p className="text-gray-600 mb-6">
                Limited edition and collector items for true enthusiasts.
              </p>
              <Link href="/store/exclusive" className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-medium transition-colors">
                View Exclusives
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sign up for our newsletter to get updates on new products and special offers.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
