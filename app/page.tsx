'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="bg-red-600 text-white text-center py-3 font-bold text-lg">
        TRUMP WATCH: Latest Headlines
      </div>

      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Welcome to Our Community
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto"
          >
            Your beautiful site with stunning design and functionality
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Create Cards
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Shop Now
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Play Games
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
