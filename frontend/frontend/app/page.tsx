"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// interface Product {
//   id: number;
//   name: string;
//   price: string;
//   image_url: string | null;
//   slug: string;
// }
interface Product {
  id: number;
  name: string;
  price: string;
  image_url: string | null;
  slug: string;
  description: string;
  is_active: boolean;
  category: number;
  variants: {
    id: number;
    size: string;
    color: string;
    stock: number;
  }[];
}

interface Message {
  role: "user" | "ai";
  text: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/`);
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const featured = products.slice(0, 4);
  const trending = products.slice(4, 8);
  const newArrival = products.slice(8, 12);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newHistory = [...history, { role: "user", content: input }];
    setHistory(newHistory);
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      setHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/products/${product.slug}`}>
      <div className="group cursor-pointer">
        <div className="overflow-hidden rounded-2xl bg-[#f0ebe3] aspect-[3/4] flex items-center justify-center relative">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
            />
          ) : (
            <div className="text-[#c8b89a] text-4xl">👔</div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />
          <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap font-medium shadow">
            Quick View
          </button>
        </div>
        <div className="mt-4 px-1">
          <h3 className="font-medium text-gray-900 group-hover:text-amber-700 transition">{product.name}</h3>
          <p className="mt-1 text-gray-500 font-semibold">৳ {product.price}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] text-gray-900 font-sans">

      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-widest">
            MAN<span className="text-amber-600">VERSE</span>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#featured" className="hover:text-amber-600 transition">Featured</a>
            <a href="#trending" className="hover:text-amber-600 transition">Trending</a>
            <a href="#arrivals" className="hover:text-amber-600 transition">New Arrivals</a>
            <a href="#" className="hover:text-amber-600 transition">Collections</a>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <button className="text-gray-600 hover:text-amber-600 transition text-xl">🔍</button>
            <button className="text-gray-600 hover:text-amber-600 transition text-xl">🛍️</button>
            <Link href="/admin" className="bg-amber-600 text-white text-sm px-5 py-2 rounded-full hover:bg-amber-700 transition">
              Account
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t px-6 py-4 flex flex-col gap-4 text-sm font-medium text-gray-600">
            <a href="#featured" onClick={() => setMenuOpen(false)}>Featured</a>
            <a href="#trending" onClick={() => setMenuOpen(false)}>Trending</a>
            <a href="#arrivals" onClick={() => setMenuOpen(false)}>New Arrivals</a>
            <a href="#" onClick={() => setMenuOpen(false)}>Collections</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative w-full h-[90vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600"
          className="w-full h-full object-cover object-top"
          alt="Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center">
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <p className="text-amber-400 text-sm tracking-[0.3em] uppercase mb-4 font-medium">New Season 2026</p>
            <h1 className="text-5xl md:text-7xl font-light text-white leading-tight max-w-xl">
              Wear <br /><span className="font-bold italic text-amber-400">Confidence</span>
            </h1>
            <p className="mt-6 text-gray-300 text-lg max-w-md leading-relaxed">
              Premium menswear crafted for the modern man. Bold. Minimal. Timeless.
            </p>
            <div className="mt-8 flex gap-4">
              <a href="#featured" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-medium transition">
                Shop Now
              </a>
              <a href="#trending" className="border border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-medium transition">
                Explore
              </a>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm flex flex-col items-center gap-2 animate-bounce">
          <span>↓</span>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="bg-amber-600 text-white py-3 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          {Array(6).fill("FREE SHIPPING ON ORDERS ABOVE ৳5000  •  NEW COLLECTION 2026  •  PREMIUM QUALITY  •  EASY RETURNS  •  ").map((text, i) => (
            <span key={i} className="text-sm tracking-widest mx-8">{text}</span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "T-Shirts", emoji: "👕", bg: "bg-stone-100" },
            { label: "Shirts", emoji: "👔", bg: "bg-amber-50" },
            { label: "Pants", emoji: "👖", bg: "bg-stone-100" },
            { label: "Accessories", emoji: "⌚", bg: "bg-amber-50" },
          ].map((cat) => (
            <div key={cat.label} className={`${cat.bg} rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition group`}>
              <span className="text-4xl group-hover:scale-110 transition">{cat.emoji}</span>
              <span className="font-semibold text-gray-800">{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-6">

        {/* FEATURED */}
        <section id="featured" className="py-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-amber-600 text-sm tracking-widest uppercase mb-2">Handpicked</p>
              <h2 className="text-4xl font-semibold">Featured Products</h2>
            </div>
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-amber-600 transition border-b border-gray-300 pb-1">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        {/* BANNER */}
        <section className="my-16 rounded-3xl overflow-hidden relative h-80">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200"
            className="w-full h-full object-cover object-top"
            alt="Banner"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center text-white">
            <div>
              <p className="text-amber-400 tracking-widest text-sm uppercase mb-3">Limited Edition</p>
              <h3 className="text-4xl font-bold mb-6">Summer Collection</h3>
              <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-amber-600 hover:text-white transition">
                Shop Now
              </button>
            </div>
          </div>
        </section>

        {/* TRENDING */}
        <section id="trending" className="py-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-amber-600 text-sm tracking-widest uppercase mb-2">What's Hot</p>
              <h2 className="text-4xl font-semibold">Trending Now</h2>
            </div>
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-amber-600 transition border-b border-gray-300 pb-1">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trending.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        {/* USP STRIP */}
        <section className="py-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-gray-200">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders above ৳5000" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
            { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
            { icon: "💎", title: "Premium Quality", desc: "Handpicked fabrics" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <h4 className="font-semibold text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* NEW ARRIVALS */}
        <section id="arrivals" className="py-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-amber-600 text-sm tracking-widest uppercase mb-2">Just In</p>
              <h2 className="text-4xl font-semibold">New Arrivals</h2>
            </div>
            <Link href="#" className="text-sm font-medium text-gray-500 hover:text-amber-600 transition border-b border-gray-300 pb-1">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrival.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-20 text-center">
          <div className="bg-amber-600 rounded-3xl px-8 py-16 text-white">
            <h3 className="text-3xl font-bold mb-4">Stay in Style</h3>
            <p className="text-amber-100 mb-8">Subscribe to get exclusive deals and new arrivals first.</p>
            <div className="flex max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full text-gray-900 outline-none text-sm"
              />
              <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 mt-8">
        <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-bold tracking-widest mb-4">MAN<span className="text-amber-500">VERSE</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed">Crafted for the modern man. Premium menswear for every occasion.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-amber-500">Shop</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Featured</a></li>
              <li><a href="#" className="hover:text-white transition">Trending</a></li>
              <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition">Collections</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-amber-500">Support</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Returns</a></li>
              <li><a href="/admin" className="hover:text-white transition">Admin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-amber-500">Contact</h4>
            <p className="text-gray-400 text-sm">support@manverse.com</p>
            <p className="text-gray-400 text-sm mt-2">+880 1234 567890</p>
            <div className="flex gap-4 mt-4 text-xl">
              <a href="#" className="hover:text-amber-500 transition">📘</a>
              <a href="#" className="hover:text-amber-500 transition">📸</a>
              <a href="#" className="hover:text-amber-500 transition">🐦</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2026 Manverse. All rights reserved.
        </div>
      </footer>

      {/* AI CHATBOX */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <div className="mb-4 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="bg-amber-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">💬</span>
                <div>
                  <p className="text-white font-semibold text-sm">Manverse Assistant</p>
                  <p className="text-amber-200 text-xs">Ask about products & orders</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white text-xl leading-none hover:text-amber-200 transition">×</button>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-80 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center">
                  <p className="text-gray-400 text-sm mt-4">👋 Hi! I'm your Manverse assistant.</p>
                  <div className="mt-4 flex flex-col gap-2">
                    {["What's new?", "Help with sizing", "Track my order"].map((q) => (
                      <button key={q} onClick={() => setInput(q)} className="text-xs bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-amber-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm px-4 py-2 rounded-2xl rounded-bl-sm text-sm text-gray-400">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-gray-100 p-3 flex gap-2 bg-white">
              <input
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full px-4 py-2 outline-none focus:border-amber-400 placeholder-gray-400"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-amber-600 hover:bg-amber-700 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm transition"
              >
                →
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-amber-600 hover:bg-amber-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition ml-auto"
        >
          {chatOpen ? "×" : "💬"}
        </button>
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