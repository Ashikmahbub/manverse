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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY || ""
);

// ── STRIPE FORM ────────────────────────────────────────────────
function StripeForm({ form, cart, total }: any) {
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

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/stripe/create-payment/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          total_usd: (total / 110).toFixed(2),
          items: cart.map((i: any) => ({
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

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/stripe/confirm/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        <CardElement
          options={{
            style: {
              base: {
                color: "#ffffff",
                fontSize: "16px",
                "::placeholder": { color: "#6b7280" },
              },
            },
          }}
        />
      </div>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
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
  const { cart, clearCart, totalPrice } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<"sslcommerz" | "stripe">("sslcommerz");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const [form, setForm] = useState({
    full_name: "",
    phone:     "",
    address:   "",
    city:      "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSSLCommerz = async () => {
    if (!form.full_name || !form.phone || !form.address || !form.city) {
      setError("Please fill in all fields.");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) { router.push("/login?redirect=/checkout"); return; }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/payment/initiate/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          items: cart.map((i) => ({
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
      setError(data.error || "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    localStorage.setItem("last_tran_id", data.tran_id);
    clearCart();
    window.location.href = data.payment_url;
  };

  return (
    <div className="min-h-screen bg-[#0f2744] pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
        <p className="text-gray-400 text-sm mb-8 font-mono">
          Secure payment via SSLCommerz or Stripe
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── FORM ── */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold text-lg mb-5">
              Delivery Information
            </h2>

            <div className="space-y-4">
              {[
                { name: "full_name", label: "Full Name",    placeholder: "Your full name" },
                { name: "phone",     label: "Phone",        placeholder: "+880 1XXX XXXXXX" },
                { name: "address",   label: "Address",      placeholder: "Street address, area" },
                { name: "city",      label: "City",         placeholder: "Dhaka, Chittagong..." },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3
                               text-white placeholder-gray-500 text-sm
                               focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Payment Method Toggle */}
            <h2 className="text-white font-semibold mt-6 mb-3">Payment Method</h2>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod("sslcommerz")}
                className={`flex-1 py-3 rounded-xl text-sm font-mono border transition-all
                  ${paymentMethod === "sslcommerz"
                    ? "bg-amber-500 text-[#0f2744] border-amber-500 font-bold"
                    : "border-white/15 text-gray-400 hover:border-white/30"}`}
              >
                SSLCommerz 🇧🇩
              </button>
              <button
                onClick={() => setPaymentMethod("stripe")}
                className={`flex-1 py-3 rounded-xl text-sm font-mono border transition-all
                  ${paymentMethod === "stripe"
                    ? "bg-[#635bff] text-white border-[#635bff] font-bold"
                    : "border-white/15 text-gray-400 hover:border-white/30"}`}
              >
                Stripe 💳
              </button>
            </div>

            {/* SSLCommerz Button */}
            {paymentMethod === "sslcommerz" && (
              <button
                onClick={handleSSLCommerz}
                disabled={loading || cart.length === 0}
                className="w-full bg-amber-500 hover:bg-amber-400
                           disabled:opacity-50 disabled:cursor-not-allowed
                           text-[#0f2744] font-bold text-sm font-mono
                           py-4 rounded-xl transition-all
                           hover:shadow-lg hover:shadow-amber-500/25"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Redirecting...
                  </span>
                ) : (
                  "Pay with SSLCommerz →"
                )}
              </button>
            )}

            {/* Stripe */}
            {paymentMethod === "stripe" && (
              <Elements stripe={stripePromise}>
                <StripeForm form={form} cart={cart} total={totalPrice} />
              </Elements>
            )}

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4">
              <h2 className="text-white font-semibold text-lg mb-4">
                Order Summary
              </h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, i) => (
                    <div key={i}
                      className="flex justify-between items-start py-2
                                 border-b border-white/6 last:border-0">
                      <div>
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5 font-mono">
                          {item.size  && `Size: ${item.size}`}
                          {item.size && item.color && "  ·  "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                        <p className="text-gray-500 text-xs font-mono">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-amber-400 text-sm font-mono font-medium">
                        ৳{(parseFloat(item.price) * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Subtotal</span>
                  <span className="text-white font-mono">৳{totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-sm">Delivery</span>
                  <span className="text-green-400 text-sm font-mono">Free</span>
                </div>
                {paymentMethod === "stripe" && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-sm">≈ USD</span>
                    <span className="text-white font-mono">
                      ${(totalPrice / 110).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-amber-400 font-bold text-xl font-mono">
                    ৳{totalPrice.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
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