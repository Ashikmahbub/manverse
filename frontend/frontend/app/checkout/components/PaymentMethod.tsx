"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "./StripeForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");

interface Props {
  paymentMethod: "sslcommerz" | "stripe";
  setPaymentMethod: (m: "sslcommerz" | "stripe") => void;
  onSSLCommerz: () => void;
  loading: boolean;
  cartEmpty: boolean;
  form: any;
  items: any[];
  totalInUSD: string;
}

export default function PaymentMethod({
  paymentMethod, setPaymentMethod,
  onSSLCommerz, loading, cartEmpty,
  form, items, totalInUSD,
}: Props) {
  return (
    <div>
      <h2 className="text-white font-semibold text-lg mt-6 mb-4">Payment Method</h2>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* SSLCommerz */}
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

        {/* Stripe */}
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
            <span className="bg-white text-[#1a1f71] text-[9px] font-extrabold px-1.5 py-0.5 rounded italic">VISA</span>
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
          onClick={onSSLCommerz}
          disabled={loading || cartEmpty}
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
          <StripeForm form={form} items={items} total={totalInUSD}/>
        </Elements>
      )}
    </div>
  );
}