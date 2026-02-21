"use client"
import { useEffect, useState } from "react"

const slides = [
  {
    title: "Bold. Minimal. Timeless.",
    subtitle: "Premium menswear for the modern man.",
  },
  {
    title: "Made for Bangladesh.",
    subtitle: "Crafted with pride and precision.",
  },
  {
    title: "Redefine Your Style.",
    subtitle: "Confidence in every thread.",
  },
]

export default function Home() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#003b1f] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-green-900">
        <span className="text-2xl font-bold tracking-tight">
          MAN<span className="text-red-600">VERSE</span>
        </span>
        <div className="flex gap-6 text-sm text-green-200">
          <a href="/shop" className="hover:text-red-500 transition">Shop</a>
          <a href="#" className="hover:text-red-500 transition">About</a>
          <a href="#" className="hover:text-red-500 transition">Contact</a>
        </div>
      </nav>

      {/* Hero Carousel */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-[#003b1f] to-black z-0" />
        <div className="relative z-10 transition-all duration-700">
          <h1 className="text-6xl font-extrabold tracking-tight max-w-2xl">
            {slides[index].title}
          </h1>
          <p className="text-green-200 text-lg mt-6">
            {slides[index].subtitle}
          </p>
          <div className="flex gap-4 mt-8 justify-center">
            <a
              href="/shop"
              className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full text-sm font-semibold transition"
            >
              Shop Now
            </a>
            <a
              href="#featured"
              className="border border-green-400 hover:border-red-500 px-8 py-3 rounded-full text-sm font-semibold text-green-200 transition"
            >
              Explore
            </a>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="px-10 py-20 bg-[#002915]">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Featured Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-[#003b1f] border border-green-900 rounded-xl p-6 hover:border-red-600 transition"
            >
              <div className="h-56 bg-green-800 rounded-lg mb-6 flex items-center justify-center text-green-200">
                Product Image
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Jacket</h3>
              <p className="text-green-300 text-sm mb-4">
                Modern fit. Elite comfort.
              </p>
              <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full text-sm transition">
                View Product
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-10 py-20 bg-[#003b1f] border-t border-green-900">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Shop By Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {["Sneakers", "Pants", "Boots", "Accessories"].map((cat) => (
            <div
              key={cat}
              className="bg-[#002915] p-10 rounded-xl hover:bg-red-600 transition cursor-pointer"
            >
              <span className="font-semibold">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-px border-t border-green-900 bg-green-900">
        {[
          { title: "Premium Quality", desc: "Handpicked fabrics & craftsmanship." },
          { title: "Fast Delivery", desc: "Nationwide shipping across Bangladesh." },
          { title: "Easy Returns", desc: "7-day hassle-free return policy." },
        ].map((f) => (
          <div key={f.title} className="bg-[#003b1f] px-10 py-12">
            <h3 className="text-white font-semibold text-lg">{f.title}</h3>
            <p className="text-green-300 text-sm mt-3">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-[#002915] text-green-300 px-10 py-12 border-t border-green-900">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">

          <div>
            <h4 className="text-white font-bold mb-4">MANVERSE</h4>
            <p className="text-sm">
              Bangladesh inspired fashion for bold modern men.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/shop" className="hover:text-red-500">Shop</a></li>
              <li><a href="#" className="hover:text-red-500">About</a></li>
              <li><a href="#" className="hover:text-red-500">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>Shipping Policy</li>
              <li>Returns</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <p className="text-sm">Facebook • Instagram • TikTok</p>
          </div>

        </div>

        <div className="text-center mt-10 text-xs text-green-500">
          © 2026 Manverse — Proudly Made in Bangladesh 🇧🇩
        </div>
      </footer>

    </div>
  )
}