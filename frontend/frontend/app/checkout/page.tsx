"use client";

import { useState } from "react";
import { useCart } from "../store/cartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, clearCart, totalPrice } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
  });
  const [error, setError] = useState("");

  const shipping = totalPrice >= 5000 ? 0 : 120;
  const grandTotal = totalPrice + shipping;

  const handleSubmit = async () => {
    if (!form.full_name || !form.phone || !form.address || !form.city) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          total_amount: grandTotal,
          items: cart.map((item) => ({
            product: item.name,
            size: item.size,
            color: item.color,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Failed to place order. Please try again.");
        return;
      }
      clearCart();
      router.push(`/order-success?id=${data.order_id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛍️</p>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
          <Link href="/" className="bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-10">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-10">

          {/* LEFT - Form */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
              )}

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 transition"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 transition"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Address</label>
                  <textarea
                    placeholder="Enter your full address"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 transition resize-none"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 transition"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  >
                    <option value="">Select city</option>
                    {["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh"].map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="flex items-center gap-3 border-2 border-amber-400 rounded-xl px-4 py-3 bg-amber-50">
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-400">Pay when your order arrives</p>
                </div>
                <span className="ml-auto text-amber-600">✓</span>
              </div>
            </div>
          </div>

          {/* RIGHT - Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f0ebe3] flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">👔</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">৳ {(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">{shipping === 0 ? "Free" : `৳ ${shipping}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 text-base border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span>৳ {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-6 w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-4 rounded-full font-semibold transition"
              >
                {loading ? "Placing Order..." : "Place Order 🎉"}
              </button>

              <Link href="/cart" className="mt-3 w-full border border-gray-200 text-gray-600 py-3 rounded-full font-medium transition text-center block hover:border-amber-400 hover:text-amber-600">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}