"use client";

import Link from "next/link";
import { useCart } from "../store/cartStore";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-widest text-gray-900">
            MAN<span className="text-amber-600">VERSE</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-amber-600 transition">← Continue Shopping</Link>
        </div>
      </nav>

      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-10">Your Cart ({totalItems} items)</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-6">🛍️</p>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some products to get started</p>
            <Link href="/" className="bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white rounded-2xl p-5 flex gap-5 items-center shadow-sm border border-gray-100">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f0ebe3] flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👔</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.size !== "Default" && <span>Size: {item.size} </span>}
                      {item.color !== "Default" && <span>Color: {item.color}</span>}
                    </p>
                    <p className="text-amber-600 font-semibold mt-1">৳ {item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition"
                      >−</button>
                      <span className="px-3 py-1 font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.size, item.color)}
                      className="text-red-400 hover:text-red-600 transition text-lg"
                    >🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>৳ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600">{totalPrice >= 5000 ? "Free" : "৳ 120"}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900 text-base">
                    <span>Total</span>
                    <span>৳ {(totalPrice + (totalPrice >= 5000 ? 0 : 120)).toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-full font-semibold transition text-center block"
                >
                  Proceed to Checkout →
                </Link>
                <Link
                  href="/"
                  className="mt-3 w-full border border-gray-200 text-gray-600 py-3 rounded-full font-medium transition text-center block hover:border-amber-400 hover:text-amber-600"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}