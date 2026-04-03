// frontend/frontend/app/checkout/page.tsx
"use client";
import { useState } from "react";
import { useCart } from "@/app/store/cartStore";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Load Stripe outside component
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY || ""
);

// ── STRIPE FORM ────────────────────────────────────────────────
function StripeForm({ form, items, total }: any) {
  const stripe   = useStripe();
  const elements = useElements();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleStripePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    // Step 1: Create payment intent on backend
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/stripe/create-payment/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          total_usd: total,
          items: items.map((i: any) => ({
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
    if (!res.ok) {
      setError(data.error || "Failed to create payment");
      setLoading(false);
      return;
    }

    // Step 2: Confirm payment with Stripe
    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { name: form.full_name },
        },
      });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setLoading(false);
      return;
    }

    // Step 3: Confirm on backend
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/stripe/confirm/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_intent_id: paymentIntent?.id,
          tran_id:           data.tran_id,
        }),
      }
    );

    localStorage.setItem("last_tran_id", data.tran_id);
    router.push(`/order-success?tran_id=${data.tran_id}`);
  };

  return (
    <div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <CardElement options={{
          style: {
            base: {
              color:           "#ffffff",
              fontSize:        "16px",
              "::placeholder": { color: "#6b7280" },
            },
          },
        }}/>
      </div>
      {error && (
        <p className="text-red-400 text-sm mb-3">{error}</p>
      )}
      <button
        onClick={handleStripePayment}
        disabled={loading || !stripe}
        className="w-full bg-[#635bff] hover:bg-[#5147e5]
                   text-white font-bold text-sm font-mono
                   py-4 rounded-xl transition-all
                   disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with Stripe →"}
      </button>
    </div>
  );
}


// ── MAIN CHECKOUT ──────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"sslcommerz"|"stripe">("sslcommerz");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [form, setForm] = useState({
    full_name: "", phone: "", address: "", city: "",
  });

  const total     = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const totalInUSD = (total / 110).toFixed(2); // BDT to USD approx

  const handleChange = (e: any) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSSLCommerz = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res   = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/payment/initiate/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({
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
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    clearCart();
    window.location.href = data.payment_url;
  };

  return (
    <div className="min-h-screen bg-[#0f2744] pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FORM */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Delivery Info</h2>
            {["full_name","phone","address","city"].map(field => (
              <div key={field} className="mb-4">
                <label className="text-xs font-mono text-gray-400 uppercase block mb-1">
                  {field.replace("_"," ")}
                </label>
                <input
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/15
                             rounded-lg px-4 py-3 text-white text-sm
                             focus:outline-none focus:border-amber-500"
                />
              </div>
            ))}

            {/* Payment Method Toggle */}
            <h2 className="text-white font-semibold mt-6 mb-4">Payment Method</h2>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod("sslcommerz")}
                className={`flex-1 py-3 rounded-xl text-sm font-mono border transition-all
                  ${paymentMethod === "sslcommerz"
                    ? "bg-amber-500 text-navy border-amber-500"
                    : "border-white/15 text-gray-400"}`}
              >
                SSLCommerz 🇧🇩
              </button>
              <button
                onClick={() => setPaymentMethod("stripe")}
                className={`flex-1 py-3 rounded-xl text-sm font-mono border transition-all
                  ${paymentMethod === "stripe"
                    ? "bg-[#635bff] text-white border-[#635bff]"
                    : "border-white/15 text-gray-400"}`}
              >
                Stripe 💳
              </button>
            </div>

            {/* SSLCommerz Button */}
            {paymentMethod === "sslcommerz" && (
              <button
                onClick={handleSSLCommerz}
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400
                           text-[#0f2744] font-bold text-sm font-mono
                           py-4 rounded-xl transition-all disabled:opacity-50"
              >
                {loading ? "Redirecting..." : "Pay with SSLCommerz →"}
              </button>
            )}

            {/* Stripe Form */}
            {paymentMethod === "stripe" && (
              <Elements stripe={stripePromise}>
                <StripeForm form={form} items={items} total={totalInUSD}/>
              </Elements>
            )}

            {error && (
              <p className="text-red-400 text-sm mt-3">{error}</p>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Order Summary</h2>
            {items.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-white/6">
                <div>
                  <p className="text-white text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-amber-400 font-mono">
                  ৳{(parseFloat(item.price) * item.quantity).toFixed(0)}
                </p>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total (BDT)</span>
                <span className="text-amber-400 font-mono font-bold">৳{total.toFixed(0)}</span>
              </div>
              {paymentMethod === "stripe" && (
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">≈ USD</span>
                  <span className="text-white font-mono">${totalInUSD}</span>
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="text-xs text-gray-500 font-mono">🔒 SSL Secured</span>
              <span className="text-xs text-gray-500 font-mono">💳 bKash · Nagad · Cards</span>
              <span className="text-xs text-gray-500 font-mono">🌍 Visa · Mastercard</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}