"use client"

import { useEffect, useState } from "react"

interface Product {
  id: number
  name: string
  price: string
  image: string | null
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/`
        )
        const data: Product[] = await res.json()
        setProducts(data.slice(0, 8))
      } catch (error) {
        console.error("API Error:", error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-zinc-800 bg-[#0b1120]">
        <span className="text-2xl font-bold tracking-tight">
          MAN<span className="text-purple-500">VERSE</span>
        </span>

        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="#shop" className="hover:text-white transition">Shop</a>
          <a href="#collections" className="hover:text-white transition">Collections</a>
          <a href="/admin" className="hover:text-white transition">Admin</a>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/products/`} className="hover:text-white transition">API</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-36 bg-gradient-to-br from-[#0b1120] via-black to-black">
        <h1 className="text-6xl font-extrabold max-w-3xl leading-tight">
          Redefine Your <span className="text-purple-500">Performance</span>
        </h1>

        <p className="text-zinc-400 mt-6 max-w-xl text-lg">
          Premium footwear and sportswear crafted for elite performance.
        </p>

        <a
          href="#shop"
          className="mt-8 bg-zinc-700 hover:bg-red-600 transition px-10 py-4 rounded-full font-semibold"
        >
          Shop Now
        </a>
      </section>

      {/* CATEGORY */}
      <section className="py-20 px-10 border-t border-zinc-800 bg-black">
        <h2 className="text-3xl font-bold text-center mb-12">
          Shop by Category
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {["Shoes", "Track Pants", "Outdoor Gear"].map((cat) => (
            <div
              key={cat}
              className="bg-zinc-900 p-10 rounded-xl hover:bg-zinc-800 transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold">{cat}</h3>
              <p className="text-zinc-500 mt-2 text-sm">
                Explore premium {cat}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="shop" className="py-20 px-10 border-t border-zinc-800 bg-black">
        <h2 className="text-3xl font-bold text-center mb-12">
          Featured Products
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-zinc-900 rounded-xl p-6 hover:bg-zinc-800 transition"
            >
              <div className="h-40 bg-zinc-800 rounded-md mb-4 flex items-center justify-center text-zinc-500 text-sm">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full object-cover"
                  />
                ) : (
                  "No Image"
                )}
              </div>

              <h3 className="text-sm font-semibold">
                {product.name}
              </h3>

              <p className="text-purple-400 mt-2 font-bold">
                ${product.price}
              </p>

              <button className="mt-4 w-full bg-zinc-700 hover:bg-red-600 transition py-2 rounded-md text-sm">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTION */}
      <section id="collections" className="py-24 bg-[#0b1120] border-t border-zinc-800 text-center px-6">
        <h2 className="text-4xl font-bold mb-6">
          2026 <span className="text-purple-500">Elite Collection</span>
        </h2>

        <p className="text-zinc-400 max-w-xl mx-auto">
          Engineered for athletes. Designed for modern style.
        </p>

        <a
          href="#shop"
          className="inline-block mt-8 border border-zinc-700 hover:border-white px-10 py-3 rounded-full transition"
        >
          Explore Collection
        </a>
      </section>

      {/* ADMIN & API */}
      <section className="py-20 bg-black border-t border-zinc-800 text-center">
        <h2 className="text-3xl font-bold mb-6">Developer Access</h2>

        <div className="flex justify-center gap-6">
          <a
            href="/admin"
            className="bg-zinc-700 hover:bg-red-600 transition px-8 py-3 rounded-full"
          >
            Admin Panel
          </a>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/products/`}
            className="border border-zinc-700 hover:border-white transition px-8 py-3 rounded-full"
          >
            View API
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b1120] py-16 border-t border-zinc-800">
        <div className="grid md:grid-cols-3 gap-8 px-10 text-sm text-zinc-400">

          <div>
            <h3 className="text-white font-semibold mb-4">MANVERSE</h3>
            <p>Performance fashion for bold individuals.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#shop" className="hover:text-white">Shop</a></li>
              <li><a href="/admin" className="hover:text-white">Admin</a></li>
              <li><a href={`${process.env.NEXT_PUBLIC_API_URL}/api/products/`} className="hover:text-white">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p>Email: support@manverse.com</p>
          </div>

        </div>

        <div className="text-center text-zinc-600 mt-10 text-xs">
          © 2026 Manverse. All rights reserved.
        </div>
      </footer>

    </div>
  )
}