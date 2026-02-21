"use client"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1C2D] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-6 border-b border-gray-800">
        <span className="text-2xl font-bold tracking-wide">
          MANVERSE
        </span>

        <div className="flex gap-8 text-sm text-gray-300">
          <Link href="/shop" className="hover:text-white transition">Shop</Link>
          <Link href="#" className="hover:text-white transition">About</Link>
          <Link href="#" className="hover:text-white transition">Contact</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center px-6">

        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1C2D] via-[#0f2a45] to-black opacity-90"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-6xl font-extrabold tracking-tight leading-tight">
            Elevate Your <span className="text-gray-400">Presence</span>
          </h1>

          <p className="mt-6 text-gray-300 text-lg">
            Contemporary fashion for the bold modern man.
            Minimal. Powerful. Refined.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              href="/shop"
              className="bg-gray-200 text-black px-8 py-3 rounded-full font-semibold hover:bg-red-600 hover:text-white transition"
            >
              Shop Collection
            </Link>

            <Link
              href="#featured"
              className="border border-gray-500 px-8 py-3 rounded-full font-semibold text-gray-300 hover:border-red-600 hover:text-red-500 transition"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="px-12 py-24 bg-[#0E2238]">
        <h2 className="text-3xl font-bold mb-14 text-center">
          Featured Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[1,2,3].map((item) => (
            <div
              key={item}
              className="bg-[#142E4A] rounded-xl overflow-hidden hover:scale-[1.02] transition"
            >
              <div className="h-72 bg-gray-700"></div>

              <div className="p-6">
                <h3 className="font-semibold text-lg">
                  Premium Jacket
                </h3>
                <p className="text-gray-400 mt-2">$149</p>

                <button className="mt-4 bg-gray-200 text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-red-600 hover:text-white transition">
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Message */}
      <section className="px-12 py-24 bg-[#0B1C2D] text-center border-t border-gray-800">
        <h2 className="text-4xl font-bold max-w-2xl mx-auto">
          Designed for Confidence.
        </h2>

        <p className="mt-6 text-gray-400 max-w-xl mx-auto">
          Each piece is crafted with precision,
          blending comfort and sophistication.
          Made to stand out — effortlessly.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-black px-12 py-16 border-t border-gray-800 text-gray-400">

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10">

          <div>
            <h4 className="text-white font-semibold mb-4">MANVERSE</h4>
            <p className="text-sm">
              Modern fashion. Elevated identity.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>Sneakers</li>
              <li>Outerwear</li>
              <li>Accessories</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>Shipping</li>
              <li>Returns</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow</h4>
            <p className="text-sm">Instagram • Facebook • TikTok</p>
          </div>

        </div>

        <div className="mt-12 text-center text-xs text-gray-600">
          © 2026 Manverse. All rights reserved.
        </div>
      </footer>

    </div>
  )
}