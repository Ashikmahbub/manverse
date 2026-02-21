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

  return (
    <div className="min-h-screen bg-[#f6efe6] text-black font-sans">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="flex justify-between items-center px-10 py-5">
          <div className="text-2xl font-bold tracking-wider">
            MAN<span className="text-gray-600">VERSE</span>
          </div>
        </div>
      </nav>

      {/* HERO FULL WIDTH CAROUSEL */}
      <section className="pt-24">
        <div className="w-full h-[85vh] relative overflow-hidden">

          <img
            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
            className="w-full h-full object-cover"
            alt="Hero"
          />

          <div className="absolute inset-0 bg-black/30 flex items-center">
            <div className="px-16 text-white">
              <h1 className="text-5xl md:text-7xl font-light">
                Wear <span className="font-semibold">Confidence</span>
              </h1>

              <p className="mt-6 text-lg max-w-md">
                Crafted for timeless elegance and bold presence.
              </p>

              <Link
                href="#featured"
                className="inline-block mt-8 bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition"
              >
                Shop Collection
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section id="featured" className="py-20 px-10">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          Featured Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featured.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-xl transition block"
            >
              <div className="h-56 bg-[#f3ece2] flex items-center justify-center mb-4 rounded-md">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full object-contain"
                  />
                )}
              </div>

              <h3 className="text-sm font-medium">
                {product.name}
              </h3>

              <p className="mt-2 font-semibold">
                ৳ {product.price}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING NOW */}
      <section className="py-20 px-10 bg-white">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          Trending Now
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {trending.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-xl">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                  />
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  {product.name}
                </h3>
                <p className="text-gray-600 mt-1">
                  ৳ {product.price}
                </p>
              </div>

            </Link>
          ))}

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-16 text-center">
        © 2026 MANVERSE. All rights reserved.
      </footer>

    </div>
  )
}