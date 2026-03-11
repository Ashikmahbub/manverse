"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Thank you for your order.</p>
        {orderId && (
          <p className="text-amber-600 font-semibold mb-8">Order ID: #{orderId}</p>
        )}
        <p className="text-gray-400 text-sm mb-8">
          Our team will contact you on your phone number to confirm delivery.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 transition font-semibold">
            Continue Shopping
          </Link>
          <Link href="/profile" className="border border-gray-200 text-gray-600 px-8 py-3 rounded-full hover:border-amber-400 hover:text-amber-600 transition">
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


// trigger ci cd 