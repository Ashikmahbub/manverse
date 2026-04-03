"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

interface Props {
  form: any;
  items: any[];
  total: string;
}

const elementStyle = {
  style: {
    base: {
      color:           "#ffffff",
      fontSize:        "15px",
      fontFamily:      "monospace",
      "::placeholder": { color: "#6b7280" },
    },
    invalid: { color: "#f87171" },
  },
};

export default function StripeForm({ form, items, total }: Props) {
  const stripe   = useStripe();
  const elements = useElements();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleStripePayment = async () => {
    if (!stripe || !elements) return;

    if (!items || items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }

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

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError("Card element not found.");
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } =
      await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card:             cardElement,
          billing_details:  { name: form.full_name },
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
    <div className="space-y-4 mt-2">

      {/* Accepted Cards */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono">Accepted:</span>
        <div className="flex gap-2 items-center">
          <div className="bg-white rounded px-2 py-0.5">
            <span className="text-[#1a1f71] font-extrabold text-xs italic">VISA</span>
          </div>
          <div className="bg-white rounded px-1.5 py-1 flex items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-[#eb001b]"/>
            <div className="w-3.5 h-3.5 rounded-full bg-[#f79e1b] -ml-1.5 opacity-90"/>
          </div>
          <div className="bg-[#007bc1] rounded px-2 py-0.5">
            <span className="text-white text-[10px] font-bold">AMEX</span>
          </div>
        </div>
      </div>

      {/* Card Number */}
      <div>
        <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-1.5">
          Card Number
        </label>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
          {/* Visa icon */}
          <div className="bg-white rounded px-1.5 py-0.5 shrink-0">
            <span className="text-[#1a1f71] font-extrabold text-[10px] italic">VISA</span>
          </div>
          <div className="flex-1">
            <CardNumberElement options={elementStyle}/>
          </div>
        </div>
      </div>

      {/* Expiry + CVC */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-1.5">
            Expiry Date
          </label>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <CardExpiryElement options={elementStyle}/>
          </div>
        </div>
        <div>
          <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-1.5">
            CVC
          </label>
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <CardCvcElement options={elementStyle}/>
          </div>
        </div>
      </div>

      {/* ZIP / Postcode */}
      <div>
        <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-1.5">
          ZIP / Postcode
        </label>
        <input
          name="zip"
          placeholder="e.g. 1000"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                     text-white text-sm font-mono placeholder-gray-600
                     focus:outline-none focus:border-[#635bff] transition-colors"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Pay Button */}
      <button
        onClick={handleStripePayment}
        disabled={loading || !stripe}
        className="w-full bg-[#635bff] hover:bg-[#5147e5]
                   text-white font-bold text-sm font-mono
                   py-4 rounded-xl transition-all
                   disabled:opacity-50 flex items-center justify-center gap-2
                   shadow-lg shadow-[#635bff]/25"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect width="14" height="14" rx="2" fill="white" fillOpacity="0.3"/>
          <path d="M3 5h8M3 7h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        {loading ? "Processing..." : "Pay with Stripe →"}
      </button>

    </div>
  );
}