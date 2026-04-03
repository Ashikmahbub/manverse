"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface Props {
  form: any;
  items: any[];
  total: string;
}

export default function StripeForm({ form, items, total }: Props) {
  const stripe   = useStripe();
  const elements = useElements();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleStripePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access_token");

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
      {/* Accepted cards */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono">Accepted:</span>
        <div className="flex gap-2">
          <div className="bg-white rounded px-2 py-1">
            <span className="text-[#1a1f71] font-extrabold text-xs italic">VISA</span>
          </div>
          <div className="bg-white rounded px-1.5 py-1 flex items-center">
            <div className="w-4 h-4 rounded-full bg-[#eb001b]"/>
            <div className="w-4 h-4 rounded-full bg-[#f79e1b] -ml-2 opacity-90"/>
          </div>
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
        💳 {loading ? "Processing..." : "Pay with Stripe →"}
      </button>
    </div>
  );
}