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
    <div className="space-y-4">
      {/* Card accepted logos */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-400 font-mono">Accepted:</span>
        <div className="flex gap-2">
          {/* Visa */}
          <div className="bg-white rounded px-2 py-1">
            <svg width="38" height="14" viewBox="0 0 38 14" fill="none">
              <text x="0" y="12" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#1a1f71">VISA</text>
            </svg>
          </div>
          {/* Mastercard */}
          <div className="bg-white rounded px-1.5 py-1 flex items-center gap-0.5">
            <div className="w-4 h-4 rounded-full bg-[#eb001b]"/>
            <div className="w-4 h-4 rounded-full bg-[#f79e1b] -ml-2 opacity-90"/>
          </div>
          {/* Amex */}
          <div className="bg-[#007bc1] rounded px-2 py-1">
            <span className="text-white text-[10px] font-bold">AMEX</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <CardElement options={{
          style: {
            base: {
              color:           "#ffffff",
              fontSize:        "15px",
              fontFamily:      "monospace",
              "::placeholder": { color: "#6b7280" },
            },
            invalid: { color: "#f87171" },
          },
        }}/>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleStripePayment}
        disabled={loading || !stripe}
        className="w-full bg-[#635bff] hover:bg-[#5147e5]
                   text-white font-bold text-sm font-mono
                   py-4 rounded-xl transition-all
                   disabled:opacity-50 flex items-center justify-center gap-2
                   shadow-lg shadow-[#635bff]/25"
      >
        {/* Stripe logo SVG */}
        <svg width="40" height="16" viewBox="0 0 40 16" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.45 5.154c0-.605.5-.838 1.328-.838 1.185 0 2.681.358 3.866 1.001V2.142C9.413 1.56 8.188 1.34 6.778 1.34 3.554 1.34 1.34 3.02 1.34 5.32c0 3.543 4.88 2.978 4.88 4.509 0 .716-.622.948-1.494.948-1.295 0-2.948-.534-4.256-1.255v3.22c1.45.627 2.914.896 4.256.896 3.29 0 5.55-1.628 5.55-3.96-.014-3.829-4.827-3.149-4.827-4.524zm9.654-3.584L12.3 2.096l-.013 10.21h3.217l.013-10.21-..5zm5.5 2.69l-.216-1.26h-2.77l.013 9.306h3.203V8.43c0-1.484.997-2.032 2.684-2.032.26 0 .516.027.757.067V3.38a5.267 5.267 0 00-.594-.04c-1.49 0-2.537.8-3.077 1.92zm7.19-1.26h-3.23v9.306h3.23V3zm-1.615-4.8c-1.03 0-1.87.84-1.87 1.87s.84 1.87 1.87 1.87 1.87-.84 1.87-1.87S27.2-1.8 26.18-1.8zm8.87 5.15c1.08 0 1.78.675 1.97 1.71H33.1c.203-1.057.93-1.71 1.95-1.71zm4.96 2.94c0-2.914-1.628-5.15-4.9-5.15-3.07 0-5.15 2.155-5.15 5.032 0 3.097 2.155 5.15 5.285 5.15 1.52 0 2.8-.432 3.773-1.255l-1.71-1.966c-.608.5-1.376.77-2.02.77-1.16 0-2.02-.608-2.25-1.75h6.9c.04-.284.072-.567.072-.83z"/>
        </svg>
        {loading ? "Processing..." : "Pay with Stripe →"}
      </button>
    </div>
  );
}


// ── MAIN CHECKOUT ──────────────────────────────────────────────
export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"sslcommerz"|"stripe">("sslcommerz");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [form, setForm] = useState({
    full_name: "", phone: "", address: "", city: "",
  });

  const total      = cart.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const totalInUSD = (total / 110).toFixed(2);

  const handleChange = (e: any) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSSLCommerz = async () => {
    if (!form.full_name || !form.phone || !form.address || !form.city) {
      setError("Please fill in all fields.");
      return;
    }
    if (cart.length === 0) { setError("Your cart is empty."); return; }

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

          {/* ── FORM ── */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold text-lg mb-5">Delivery Info</h2>

            {["full_name","phone","address","city"].map(field => (
              <div key={field} className="mb-4">
                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-1.5">
                  {field.replace("_"," ")}
                </label>
                <input
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/15
                             rounded-lg px-4 py-3 text-white text-sm
                             focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            ))}

            {/* ── PAYMENT METHOD ── */}
            <h2 className="text-white font-semibold text-lg mt-6 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">

              {/* SSLCommerz Button */}
              <button
                onClick={() => setPaymentMethod("sslcommerz")}
                className={`relative flex flex-col items-center justify-center gap-2
                            py-4 px-3 rounded-xl border-2 transition-all
                            ${paymentMethod === "sslcommerz"
                              ? "border-amber-500 bg-amber-500/10"
                              : "border-white/10 bg-white/5 hover:border-white/25"}`}
              >
                {paymentMethod === "sslcommerz" && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500"/>
                )}
                {/* SSLCommerz logo area */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">🇧🇩</span>
                  <div className="flex flex-col items-start">
                    <span className="text-white font-bold text-sm leading-none">SSLCommerz</span>
                    <span className="text-gray-400 text-[10px] font-mono">bKash · Nagad · Cards</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="bg-[#e2136e] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">bKash</span>
                  <span className="bg-[#f55f13] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Nagad</span>
                  <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Card</span>
                </div>
              </button>

              {/* Stripe Button */}
              <button
                onClick={() => setPaymentMethod("stripe")}
                className={`relative flex flex-col items-center justify-center gap-2
                            py-4 px-3 rounded-xl border-2 transition-all
                            ${paymentMethod === "stripe"
                              ? "border-[#635bff] bg-[#635bff]/10"
                              : "border-white/10 bg-white/5 hover:border-white/25"}`}
              >
                {paymentMethod === "stripe" && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#635bff]"/>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">💳</span>
                  <div className="flex flex-col items-start">
                    <span className="text-white font-bold text-sm leading-none">Stripe</span>
                    <span className="text-gray-400 text-[10px] font-mono">Global · Secure</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {/* Visa pill */}
                  <span className="bg-white text-[#1a1f71] text-[9px] font-extrabold px-1.5 py-0.5 rounded italic">VISA</span>
                  {/* Mastercard pill */}
                  <span className="bg-[#252525] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#eb001b]"/>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f79e1b] -ml-1.5"/>
                  </span>
                  <span className="bg-[#007bc1] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">AMEX</span>
                </div>
              </button>
            </div>

            {/* SSLCommerz Pay Button */}
            {paymentMethod === "sslcommerz" && (
              <button
                onClick={handleSSLCommerz}
                disabled={loading || cart.length === 0}
                className="w-full bg-amber-500 hover:bg-amber-400
                           disabled:opacity-50 disabled:cursor-not-allowed
                           text-[#0f2744] font-bold text-sm font-mono
                           py-4 rounded-xl transition-all
                           hover:shadow-lg hover:shadow-amber-500/30
                           flex items-center justify-center gap-2"
              >
                <span className="text-lg">🇧🇩</span>
                {loading ? "Redirecting..." : "Pay with SSLCommerz →"}
              </button>
            )}

            {/* Stripe Form */}
            {paymentMethod === "stripe" && (
              <Elements stripe={stripePromise}>
                <StripeForm form={form} items={cart} total={totalInUSD}/>
              </Elements>
            )}

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-4 flex-wrap">
              <span className="text-xs text-gray-500 font-mono flex items-center gap-1">🔒 SSL Encrypted</span>
              <span className="text-xs text-gray-500 font-mono flex items-center gap-1">⚡ Instant Confirm</span>
              <span className="text-xs text-gray-500 font-mono flex items-center gap-1">🔄 Easy Returns</span>
            </div>
          </div>

          {/* ── ORDER SUMMARY ── */}
          <div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-4">
              <h2 className="text-white font-semibold text-lg mb-4">Order Summary</h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty.</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-start py-2 border-b border-white/6 last:border-0">
                      <div>
                        <p className="text-white text-sm font-medium">{item.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5 font-mono">
                          {item.size  && `Size: ${item.size}`}
                          {item.size && item.color && "  ·  "}
                          {item.color && `Color: ${item.color}`}
                        </p>
                        <p className="text-gray-500 text-xs font-mono">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-amber-400 text-sm font-mono font-medium">
                        ৳{(parseFloat(item.price) * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Subtotal</span>
                  <span className="text-white font-mono">৳{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Delivery</span>
                  <span className="text-green-400 text-sm font-mono">Free</span>
                </div>
                {paymentMethod === "stripe" && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">≈ USD</span>
                    <span className="text-white font-mono">${totalInUSD}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-amber-400 font-bold text-xl font-mono">৳{total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}