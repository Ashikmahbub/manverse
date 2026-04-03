"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeForm from "./StripeForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY || "");

type PaymentMethodType = "sslcommerz" | "stripe" | "cod";

interface Props {
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (m: PaymentMethodType) => void;
  onSSLCommerz: () => void;
  onCOD: () => void;
  loading: boolean;
  cartEmpty: boolean;
  form: any;
  items: any[];
  totalInUSD: string;
}

const methods = [
  {
    id: "sslcommerz" as PaymentMethodType,
    name: "SSLCommerz",
    sub: "bKash · Nagad · Cards",
    flag: "🇧🇩",
    activeColor: "border-amber-500 bg-amber-500/10",
    dot: "bg-amber-500",
    icons: (
      <div className="flex gap-1.5 flex-wrap justify-end">
        <span className="bg-[#e2136e] text-white text-[9px] font-bold px-2 py-1 rounded">bKash</span>
        <span className="bg-[#f55f13] text-white text-[9px] font-bold px-2 py-1 rounded">Nagad</span>
        <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded">Card</span>
      </div>
    ),
  },
  {
    id: "stripe" as PaymentMethodType,
    name: "Stripe",
    sub: "Global · Secure",
    flag: "💳",
    activeColor: "border-[#635bff] bg-[#635bff]/10",
    dot: "bg-[#635bff]",
    icons: (
      <div className="flex gap-1.5 flex-wrap justify-end">
        <span className="bg-white text-[#1a1f71] text-[9px] font-extrabold px-2 py-1 rounded italic">VISA</span>
        <span className="bg-[#252525] text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-0.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#eb001b]"/>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f79e1b] -ml-1.5"/>
        </span>
        <span className="bg-[#007bc1] text-white text-[9px] font-bold px-2 py-1 rounded">AMEX</span>
      </div>
    ),
  },
  {
    id: "cod" as PaymentMethodType,
    name: "Cash on Delivery",
    sub: "Pay when you receive",
    flag: "💵",
    activeColor: "border-green-500 bg-green-500/10",
    dot: "bg-green-500",
    icons: (
      <div className="flex gap-1.5 flex-wrap justify-end">
        <span className="bg-green-700 text-white text-[9px] font-bold px-2 py-1 rounded">COD</span>
        <span className="bg-white/10 text-gray-300 text-[9px] font-bold px-2 py-1 rounded">CASH</span>
      </div>
    ),
  },
];

export default function PaymentMethod({
  paymentMethod, setPaymentMethod,
  onSSLCommerz, onCOD, loading, cartEmpty,
  form, items, totalInUSD,
}: Props) {
  return (
    <div>
      <h2 className="text-white font-semibold text-lg mt-6 mb-4">Payment Method</h2>

      <div className="flex flex-col gap-3 mb-6">
        {methods.map((m) => {
          const active = paymentMethod === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setPaymentMethod(m.id)}
              className={`relative flex items-center justify-between
                          w-full py-4 px-5 rounded-xl border-2 transition-all text-left
                          ${active ? m.activeColor : "border-white/10 bg-white/5 hover:border-white/25"}`}
            >
              {active && (
                <span className={`absolute top-3 right-3 w-2 h-2 rounded-full ${m.dot}`}/>
              )}

              {/* Left: flag + name + sub */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.flag}</span>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{m.name}</p>
                  <p className="text-gray-400 text-[11px] font-mono mt-0.5">{m.sub}</p>
                </div>
              </div>

              {/* Right: card icons */}
              <div className="ml-4 shrink-0">
                {m.icons}
              </div>
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
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

      {paymentMethod === "stripe" && (
        <Elements stripe={stripePromise}>
          <StripeForm form={form} items={items} total={totalInUSD}/>
        </Elements>
      )}

      {paymentMethod === "cod" && (
        <button
          onClick={onCOD}
          disabled={loading || cartEmpty}
          className="w-full bg-green-600 hover:bg-green-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-bold text-sm font-mono
                     py-4 rounded-xl transition-all
                     hover:shadow-lg hover:shadow-green-500/30
                     flex items-center justify-center gap-2"
        >
          <span className="text-lg">💵</span>
          {loading ? "Placing Order..." : "Place Order — Cash on Delivery →"}
        </button>
      )}
    </div>
  );
}