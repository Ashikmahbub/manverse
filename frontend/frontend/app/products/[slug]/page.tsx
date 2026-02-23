 "use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image_url: string | null;
  slug: string;
  category?: string;
  stock?: number;
}

async function getProduct(slug: string): Promise<Product> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}/`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

async function getRelated(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.slice(0, 4);
}

interface PageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = params;
  const [product, related] = await Promise.all([
    getProduct(slug),
    getRelated(),
  ]);

  return (
    <div className="min-h-screen bg-[#faf7f2]">

      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-widest">
            MAN<span className="text-amber-600">VERSE</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <Link href="/#featured" className="hover:text-amber-600 transition">Featured</Link>
            <Link href="/#trending" className="hover:text-amber-600 transition">Trending</Link>
            <Link href="/#arrivals" className="hover:text-amber-600 transition">New Arrivals</Link>
          </div>
          <div className="flex gap-4 items-center">
            <button className="text-gray-600 hover:text-amber-600 text-xl">🛍️</button>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="max-w-[1280px] mx-auto px-6 py-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-amber-600 transition">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/#featured" className="hover:text-amber-600 transition">Products</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      {/* PRODUCT DETAIL */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-16">

          {/* LEFT - Image */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#f0ebe3] rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">👔</span>
              )}
            </div>
            {/* Thumbnail row placeholder */}
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-20 h-20 bg-[#f0ebe3] rounded-xl flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-amber-600 transition">
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Info */}
          <div className="flex flex-col gap-6">
            {product.category && (
              <span className="text-amber-600 text-sm tracking-widest uppercase">{product.category}</span>
            )}
            <h1 className="text-4xl font-semibold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">৳ {product.price}</span>
              {product.stock && product.stock > 0 ? (
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">In Stock ({product.stock})</span>
              ) : (
                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">Out of Stock</span>
              )}
            </div>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <span className="text-sm text-gray-400">(24 reviews)</span>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Size Selector */}
            <div>
              <p className="font-medium text-gray-800 mb-3">Select Size</p>
              <div className="flex gap-3">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className="w-12 h-12 border-2 border-gray-200 rounded-xl text-sm font-medium hover:border-amber-600 hover:text-amber-600 transition"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-medium text-gray-800 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition text-lg">−</button>
                  <span className="px-6 py-2 font-medium">1</span>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition text-lg">+</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-2">
              <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-full font-semibold transition text-sm">
                Add to Cart 🛍️
              </button>
              <button className="flex-1 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-4 rounded-full font-semibold transition text-sm">
                Buy Now
              </button>
              <button className="w-14 h-14 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-red-400 hover:text-red-400 transition text-xl">
                ♡
              </button>
            </div>

            {/* Delivery Info */}
            <div className="border-t border-gray-200 pt-6 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: "🚚", text: "Free Delivery", sub: "Above ৳5000" },
                { icon: "↩️", text: "Easy Return", sub: "30 days" },
                { icon: "🔒", text: "Secure Pay", sub: "100% safe" },
              ].map((item) => (
                <div key={item.text}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xs font-semibold text-gray-800">{item.text}</p>
                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DESCRIPTION TABS */}
        <div className="mt-20 border-t border-gray-200 pt-12">
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            {["Description", "Size Guide", "Reviews"].map((tab, i) => (
              <button key={tab} className={`pb-4 text-sm font-medium transition border-b-2 ${i === 0 ? "border-amber-600 text-amber-600" : "border-transparent text-gray-400 hover:text-gray-700"}`}>
                {tab}
              </button>
            ))}
          </div>
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            {product.description || "Premium quality menswear crafted for the modern man. Made with carefully selected fabrics for maximum comfort and style."}
          </p>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.filter(p => p.slug !== slug).slice(0, 4).map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`}>
                <div className="group cursor-pointer">
                  <div className="overflow-hidden rounded-2xl bg-[#f0ebe3] aspect-square flex items-center justify-center">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                    ) : (
                      <span className="text-4xl">👔</span>
                    )}
                  </div>
                  <h3 className="mt-4 font-medium text-gray-900 group-hover:text-amber-600 transition">{p.name}</h3>
                  <p className="mt-1 text-gray-500 font-semibold">৳ {p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 Manverse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}