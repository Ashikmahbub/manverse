"use client";

import { useEffect, useState } from "react";
import Hero from "./components/home/Hero";
import Marquee from "./components/home/Marquee";
import Categories from "./components/home/Categories";
import Featured from "./components/home/Featured";
import Banner from "./components/home/Banner";
import Trending from "./components/home/Trending";
import USPStrip from "./components/home/USPStrip";
import NewArrivals from "./components/home/NewArrivals";
import Newsletter from "./components/home/Newsletter";

interface Product {
  id: number;
  name: string;
  price: string;
  image_url: string | null;
  slug: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`);
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const featured = products.slice(0, 4);
  const trending = products.slice(4, 8);
  const newArrival = products.slice(8, 12);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-gray-900 font-sans">
      <Hero />
      <Marquee />
      <Categories />
      <div className="max-w-[1280px] mx-auto px-6">
        <Featured products={featured} />
        <Banner />
        <Trending products={trending} />
        <USPStrip />
        <NewArrivals products={newArrival} />
        <Newsletter />
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}