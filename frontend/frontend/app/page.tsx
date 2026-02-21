 "use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: string
  image_url: string | null
  slug: string
  category: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [current, setCurrent] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/`
        )
        const data: Product[] = await res.json()
        setProducts(data)

        // Pick 1 product per category
        const categoryMap = new Map<number, Product>()
        data.forEach((item) => {
          if (!categoryMap.has(item.category)) {
            categoryMap.set(item.category, item)
          }
        })

        const uniqueProducts = Array.from(categoryMap.values())

        // fallback if empty
        setFeatured(uniqueProducts.length ? uniqueProducts : data.slice(0, 1))

      } catch (error) {
        console.error("API Error:", error)
      }
    }

    fetchProducts()
  }, [])

  // Auto slide
  useEffect(() => {
    if (featured.length === 0) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [featured])

  return (
    <div className="min-h-screen bg-[#fafafa] text-black font-sans">

      {/* TOP BAR */}
      <div className="bg-black text-white text-center text-sm py-2 tracking-wide">
        Free Shipping on Orders Over $100
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          <div className="text-2xl font-bold tracking-wider">
            MAN<span className="text-gray-500">VERSE</span>
          </div>
        </div>
      </nav>

      {/* HERO CAROUSEL */}
      <section className="pt-32 bg-gradient-to-r from-gray-50 to-white">
        {featured.length > 0 && (
          <div className="grid md:grid-cols-2 items-center px-6 md:px-10 py-16 gap-10">

            <div>
              <h1 className="text-4xl md:text-6xl font-light leading-tight">
                Featured <span className="font-semibold">Collection</span>
              </h1>

              <p className="mt-6 text-gray-600 text-base md:text-lg max-w-md">
                {featured[current].name}
              </p>

              <Link
                href={`/products/${featured[current].slug}`}
                className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
              >
                View Product
              </Link>
            </div>

            <div className="flex justify-center">
              {featured[current].image_url && (
                <img
                  src={featured[current].image_url}
                  alt={featured[current].name}
                  className="w-[280px] md:w-[450px] object-contain rounded-lg shadow-lg"
                />
              )}
            </div>

          </div>
        )}
      </section>

      {/* PRODUCTS GRID */}
      <section className="py-16 md:py-20 px-6 md:px-10 bg-white">
        <h2 className="text-2xl md:text-3xl font-semibold mb-12 text-center">
          All Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="border rounded-xl p-4 hover:shadow-xl hover:-translate-y-1 transition block bg-white"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center mb-4 overflow-hidden rounded-md">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              <h3 className="text-sm font-medium">
                {product.name}
              </h3>

              <p className="mt-2 font-semibold text-gray-800">
                ${product.price}
              </p>
            </Link>
          ))}

        </div>
      </section>

      {/* AI CHAT DROPDOWN */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-black text-white px-5 py-3 rounded-full shadow-lg hover:bg-gray-800 transition"
        >
          💬 Chat AI
        </button>

        {chatOpen && (
          <div className="mt-3 w-72 bg-white border rounded-xl shadow-xl p-4">
            <p className="text-sm text-gray-600 mb-2">
              Ask about products, sizes, availability...
            </p>
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white py-14 mt-20 text-center text-sm">
        © 2026 MANVERSE. All rights reserved.
      </footer>

    </div>
  )
}