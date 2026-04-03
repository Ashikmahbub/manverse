"use client";
import { useState } from "react";
import { useCart } from "@/app/store/cartStore";
import { useRouter } from "next/navigation";
import DeliveryForm from "./components/DeliveryForm";
import PaymentMethod from "./components/PaymentMethod";
import OrderSummary from "./components/OrderSummary";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"sslcommerz" | "stripe">("sslcommerz");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const [form, setForm] = useState({
    full_name: "", phone: "", address: "", city: "", postcode: "",
  });

  const total      = cart.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const totalInUSD = (total / 110).toFixed(2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSSLCommerz = async () => {
    if (!form.full_name || !form.phone || !form.address || !form.city || !form.postcode) {
      setError("Please fill in all fields."); return;
    }
    if (cart.length === 0) { setError("Your cart is empty."); return; }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login?redirect=/checkout"); return; }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/payment/initiate/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          items: cart.map(i => ({
            product:  i.name,
            size:     i.size  || "",
            color:    i.color || "",
            price:    i.price,
            quantity: i.quantity,
          })),
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) { setError(data.error || "Payment failed."); setLoading(false); return; }
    clearCart();
    window.location.href = data.payment_url;
  };

  return (
    <div className="min-h-screen bg-[#0f2744] pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
        <p className="text-gray-400 text-sm mb-8 font-mono">Secure payment · SSL encrypted</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT - Form + Payment */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <DeliveryForm form={form} onChange={handleChange}/>

            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onSSLCommerz={handleSSLCommerz}
              loading={loading}
              cartEmpty={cart.length === 0}
              form={form}
              items={cart}
              totalInUSD={totalInUSD}
            />

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-4 flex-wrap">
              <span className="text-xs text-gray-500 font-mono">🔒 SSL Encrypted</span>
              <span className="text-xs text-gray-500 font-mono">⚡ Instant Confirm</span>
              <span className="text-xs text-gray-500 font-mono">🔄 Easy Returns</span>
            </div>
          </div>

          {/* RIGHT - Order Summary */}
          <div>
            <OrderSummary
              cart={cart}
              total={total}
              totalInUSD={totalInUSD}
              paymentMethod={paymentMethod}
            />
          </div>

        </div>
      </div>
    </div>
  );
}