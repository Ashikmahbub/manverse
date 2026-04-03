"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface OrderItem {
  product: string;
  size: string;
  color: string;
  quantity: number;
  subtotal: string;
}

interface Order {
  tran_id: string;
  status: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  total_amount: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tran_id      = searchParams.get("tran_id");

  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!tran_id) { router.push("/"); return; }

    const token = localStorage.getItem("access_token");
    if (!token)  { router.push("/login"); return; }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/detail/${tran_id}/`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setOrder(data))
      .catch(() => setError("Could not load order details."))
      .finally(() => setLoading(false));
  }, [tran_id]);

  if (loading) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/" className="bg-amber-600 text-white px-6 py-3 rounded-full text-sm font-semibold">
          Back to Home
        </Link>
      </div>
    </div>
  );

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#faf7f2] py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
          <p className="text-gray-400 text-sm mt-1">
            A confirmation email has been sent to your inbox.
          </p>
        </div>

        {/* Order code card */}
        <div className="bg-black text-white rounded-2xl p-5 mb-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Order Code</p>
            <p className="font-mono font-bold text-lg">{order.tran_id}</p>
          </div>
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {order.status}
          </span>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Items Ordered
          </h2>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, i) => (
              <div key={i} className="py-3 flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.product}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`, `Qty: ${item.quantity}`]
                      .filter(Boolean).join(" · ")}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">${item.subtotal}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
            <span className="font-bold text-gray-900 text-sm">Total</span>
            <span className="font-bold text-amber-600">${order.total_amount}</span>
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Delivery Details
          </h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="text-gray-400 w-24 inline-block">Name</span>{order.full_name}</p>
            <p><span className="text-gray-400 w-24 inline-block">Phone</span>{order.phone}</p>
            <p><span className="text-gray-400 w-24 inline-block">Address</span>{order.address}, {order.city}</p>
            <p><span className="text-gray-400 w-24 inline-block">Payment</span>{order.payment_method}</p>
            <p><span className="text-gray-400 w-24 inline-block">Date</span>{order.created_at}</p>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-gray-400 text-xs mb-6">
          Our team will contact you on your phone number to confirm delivery.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="bg-amber-600 text-white text-center py-3 rounded-full font-semibold hover:bg-amber-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/profile"
            className="border border-gray-200 text-gray-600 text-center py-3 rounded-full hover:border-amber-400 hover:text-amber-600 transition"
          >
            View Profile
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}