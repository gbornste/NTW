export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-4xl font-bold text-blue-600"> NTW Platform</h1>
              <span className="ml-4 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-semibold">LIVE</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</a>
              <a href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">Profile</a>
              <a href="/settings" className="text-gray-700 hover:text-blue-600 font-medium">Settings</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Your Complete Digital Hub</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Access news, create custom cards, shop premium products, manage finances, play games, and much more - all in one powerful platform.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started Free
            </a>
            <a href="/about" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Platform Features</h3>
          
          {/* News & Information Section */}
          <div className="mb-16">
            <h4 className="text-2xl font-bold mb-8 text-blue-600"> News & Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="/news" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
                <h5 className="font-bold text-lg mb-2">Latest News</h5>
                <p className="text-gray-600">Breaking news and current events</p>
              </a>
              <a href="/todays-headlines" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
                <h5 className="font-bold text-lg mb-2">Today's Headlines</h5>
                <p className="text-gray-600">Top stories of the day</p>
              </a>
              <a href="/todays-news" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
                <h5 className="font-bold text-lg mb-2">Today's News</h5>
                <p className="text-gray-600">Comprehensive daily coverage</p>
              </a>
              <a href="/anti-trump-news" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-red-500">
                <h5 className="font-bold text-lg mb-2">Political News</h5>
                <p className="text-gray-600">Political analysis and updates</p>
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className="mb-16">
            <h4 className="text-2xl font-bold mb-8 text-purple-600"> Services & Tools</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a href="/create-card" className="bg-gradient-to-r from-green-400 to-green-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="text-4xl mb-4"></div>
                <h5 className="font-bold text-xl mb-2">Custom Cards</h5>
                <p>Design and send personalized greeting cards</p>
              </a>
              <a href="/store" className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="text-4xl mb-4"></div>
                <h5 className="font-bold text-xl mb-2">Premium Store</h5>
                <p>Shop curated products and exclusive deals</p>
              </a>
              <a href="/printify-storefront" className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                <div className="text-4xl mb-4"></div>
                <h5 className="font-bold text-xl mb-2">Print Services</h5>
                <p>Custom printing and merchandise</p>
              </a>
            </div>
          </div>

          {/* Finance & Stocks */}
          <div className="mb-16">
            <h4 className="text-2xl font-bold mb-8 text-green-600"> Finance & Markets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="/stocks" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-green-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4"></div>
                  <div>
                    <h5 className="font-bold text-xl">Stock Market</h5>
                    <p className="text-gray-600">Real-time market data and analysis</p>
                  </div>
                </div>
              </a>
              <a href="/checkout" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4"></div>
                  <div>
                    <h5 className="font-bold text-xl">Secure Checkout</h5>
                    <p className="text-gray-600">Safe and fast payment processing</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Entertainment */}
          <div className="mb-16">
            <h4 className="text-2xl font-bold mb-8 text-orange-600"> Entertainment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a href="/games" className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="text-3xl mb-3"></div>
                <h5 className="font-bold text-lg mb-2">Games</h5>
                <p>Fun and engaging games for all ages</p>
              </a>
              <a href="/rss-news" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500">
                <div className="text-3xl mb-3"></div>
                <h5 className="font-bold text-lg mb-2">RSS Feeds</h5>
                <p>Curated content from around the web</p>
              </a>
              <a href="/direct-news" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-yellow-500">
                <div className="text-3xl mb-3"></div>
                <h5 className="font-bold text-lg mb-2">Direct News</h5>
                <p>Unfiltered news from primary sources</p>
              </a>
            </div>
          </div>

          {/* Account & Legal */}
          <div className="mb-16">
            <h4 className="text-2xl font-bold mb-8 text-gray-700"> Account & Legal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a href="/auth/login" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
                <div className="text-2xl mb-2"></div>
                <h6 className="font-semibold">Login</h6>
              </a>
              <a href="/signup" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
                <div className="text-2xl mb-2"></div>
                <h6 className="font-semibold">Sign Up</h6>
              </a>
              <a href="/privacy" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors">
                <div className="text-2xl mb-2"></div>
                <h6 className="font-semibold">Privacy</h6>
              </a>
              <a href="/terms" className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors">
                <div className="text-2xl mb-2"></div>
                <h6 className="font-semibold">Terms</h6>
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-8 text-gray-800"> Quick Actions</h4>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Contact Us
              </a>
              <a href="/password-reset" className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Reset Password
              </a>
              <a href="/verify" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Verify Account
              </a>
              <a href="/sitemap" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                Site Map
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Platform Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Features & Services</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">Fast</div>
              <div className="text-gray-600">Performance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold text-lg mb-4">NTW Platform</h5>
              <p className="text-gray-400">Your comprehensive digital experience hub since 2025.</p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">News</h6>
              <div className="space-y-2 text-gray-400">
                <a href="/news" className="block hover:text-white">Latest News</a>
                <a href="/todays-headlines" className="block hover:text-white">Headlines</a>
                <a href="/rss-news" className="block hover:text-white">RSS Feeds</a>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Services</h6>
              <div className="space-y-2 text-gray-400">
                <a href="/create-card" className="block hover:text-white">Custom Cards</a>
                <a href="/store" className="block hover:text-white">Store</a>
                <a href="/stocks" className="block hover:text-white">Stocks</a>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Account</h6>
              <div className="space-y-2 text-gray-400">
                <a href="/auth/login" className="block hover:text-white">Login</a>
                <a href="/signup" className="block hover:text-white">Sign Up</a>
                <a href="/profile" className="block hover:text-white">Profile</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 NTW Platform. All rights reserved. | 
              <a href="/privacy" className="hover:text-white ml-2">Privacy Policy</a> | 
              <a href="/terms" className="hover:text-white ml-2">Terms of Service</a>
            </p>
            <p className="mt-2"> Server Status: <span className="text-green-400">ONLINE</span> | Port: 3001</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
