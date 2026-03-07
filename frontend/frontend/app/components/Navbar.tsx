"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../store/cartStore";

export default function Navbar() {
  const { totalItems } = useCart();
  const [user, setUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) setUser(username);
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-widest text-gray-900">
          MAN<span className="text-amber-600">VERSE</span>
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="/#featured" className="hover:text-amber-600 transition">Featured</a>
          <a href="/#trending" className="hover:text-amber-600 transition">Trending</a>
          <a href="/#arrivals" className="hover:text-amber-600 transition">New Arrivals</a>
          <a href="/#" className="hover:text-amber-600 transition">Collections</a>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          <button className="text-gray-600 hover:text-amber-600 transition text-xl">🔍</button>
          <Link href="/cart" className="text-gray-600 hover:text-amber-600 transition text-xl relative">
            🛍️
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex gap-3 items-center">
              <span className="text-sm text-gray-600">👤 {user}</span>
              <Link href="/profile" className="text-sm text-gray-600 hover:text-amber-600 transition">Profile</Link>
              <button onClick={logout} className="bg-amber-600 text-white text-sm px-5 py-2 rounded-full hover:bg-amber-700 transition">
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-amber-600 text-white text-sm px-5 py-2 rounded-full hover:bg-amber-700 transition">
              Login
            </Link>
          )}
        </div>

        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 flex flex-col gap-4 text-sm font-medium text-gray-600">
          <a href="/#featured" onClick={() => setMenuOpen(false)}>Featured</a>
          <a href="/#trending" onClick={() => setMenuOpen(false)}>Trending</a>
          <a href="/#arrivals" onClick={() => setMenuOpen(false)}>New Arrivals</a>
          <Link href="/cart" onClick={() => setMenuOpen(false)}>Cart {totalItems > 0 && `(${totalItems})`}</Link>
          {user ? (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)}>Profile ({user})</Link>
              <button onClick={logout} className="text-left text-red-500">Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}