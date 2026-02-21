"use client"

import { useEffect, useState } from "react"

interface Product {
  id: number
  name: string
  price: string
  image_url: string | null
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/`
        )
        const data = await res.json()
        setProducts(data.slice(0, 8))
      } catch (error) {
        console.error("API Error:", error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-white text-black font-sans">

      {/* TOP BAR */}
      <div className="bg-black text-white text-center text-sm py-2">
        Free Shipping on Orders Over $100
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-10 py-5">

          {/* Logo */}
          <div className="text-2xl font-bold tracking-wider">
            MAN<span className="text-gray-500">VERSE</span>
          </div>

          {/* Menu */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-gray-500">Home</a>
            <a href="#shop" className="hover:text-gray-500">Shop</a>
            <a href="#" className="hover:text-gray-500">Collections</a>
            <a href="/admin" className="hover:text-gray-500">Admin</a>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/api/products/`}
              className="hover:text-gray-500"
            >
              API
            </a>
          </div>

          {/* Icons */}
          <div className="flex gap-5 text-lg">
            <span>🔍</span>
            <span>👤</span>
            <span>🛒</span>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 bg-[#f5f5f5]">
        <div className="grid md:grid-cols-2 items-center px-10 py-20">

          {/* LEFT */}
          <div>
            <h1 className="text-6xl font-light leading-tight">
              Built For <span className="font-semibold">Performance</span>
            </h1>

            <p className="mt-6 text-gray-600 text-lg max-w-md">
              Premium athletic fashion designed for modern confidence and power.
            </p>

            <button className="mt-8 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
              Shop Now
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1520975916090-3105956dac38"
              alt="Fashion"
              className="w-[450px] object-cover rounded-lg"
            />
          </div>

        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="shop" className="py-20 px-10 bg-white">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          Featured Products
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl p-5 hover:shadow-lg transition"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full object-contain"
                  />
                ) : (
                  "No Image"
                )}
              </div>

              <h3 className="text-sm font-medium">
                {product.name}
              </h3>

              <p className="mt-2 font-semibold">
                ${product.price}
              </p>

              <button className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16 mt-20">
        <div className="grid md:grid-cols-3 gap-8 px-10 text-sm">

          <div>
            <h3 className="font-semibold mb-4">MANVERSE</h3>
            <p className="text-gray-400">
              Performance fashion for bold individuals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#shop" className="hover:text-white">Shop</a></li>
              <li><a href="/admin" className="hover:text-white">Admin</a></li>
              <li><a href={`${process.env.NEXT_PUBLIC_API_URL}/api/products/`} className="hover:text-white">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">
              support@manverse.com
            </p>
          </div>

        </div>

        <div className="text-center text-gray-500 mt-10 text-xs">
          © 2026 MANVERSE. All rights reserved.
        </div>
      </footer>

    </div>
  )
}