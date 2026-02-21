"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Product {
  id: number
  name: string
  price: string
  image_url: string | null
  slug: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/`
      )
      const data = await res.json()
      setProducts(data)
    }
    fetchProducts()
  }, [])

  const featured = products.slice(0, 4)
  const trending = products.slice(4, 8)
  const newArrival = products.slice(8, 12)

  return (
    <div className="min-h-screen bg-[#f6efe6] text-black">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex justify-between">
          <div className="text-2xl font-bold tracking-wide">
            MAN<span className="text-gray-600">VERSE</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="w-full h-[75vh] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
          className="w-full h-full object-cover"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center">
          <div className="max-w-[1280px] mx-auto px-6 text-white">
            <h1 className="text-4xl md:text-6xl font-light">
              Wear <span className="font-semibold">Confidence</span>
            </h1>
            <Link
              href="#featured"
              className="inline-block mt-6 bg-white text-black px-8 py-3 rounded-full"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT WRAPPER */}
      <div className="max-w-[1280px] mx-auto px-6">

        {/* FEATURED */}
        <section id="featured" className="py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {featured.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                  <div className="h-56 bg-[#f3ece2] flex items-center justify-center rounded-md">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full object-contain"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 font-medium">{product.name}</h3>
                  <p className="mt-2 font-semibold">৳ {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* TRENDING */}
        <section className="py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Trending Now
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {trending.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="group">
                  <div className="overflow-hidden rounded-xl">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 font-medium">{product.name}</h3>
                  <p className="text-gray-600">৳ {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* NEW ARRIVAL */}
        <section className="py-20">
          <h2 className="text-3xl font-semibold text-center mb-12">
            New Arrivals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {newArrival.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
                  <div className="h-56 bg-[#f3ece2] flex items-center justify-center rounded-md">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full object-contain"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 font-medium">{product.name}</h3>
                  <p className="mt-2 font-semibold">৳ {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16 mt-20">
        <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-semibold mb-4">MANVERSE</h3>
            <p className="text-gray-400">
              Crafted for timeless elegance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#">Shop</a></li>
              <li><a href="#">Collections</a></li>
              <li><a href="/admin">Admin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">support@manverse.com</p>
          </div>
        </div>
      </footer>

      {/* AI CHAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-black text-white px-5 py-3 rounded-full shadow-lg"
        >
          💬 Chat
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

    </div>
  )
}