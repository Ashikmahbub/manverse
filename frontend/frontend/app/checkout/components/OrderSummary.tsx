"use client";

type PaymentMethodType = "sslcommerz" | "stripe" | "cod";

interface CartItem {
  name: string;
  size: string;
  color: string;
  price: string;
  quantity: number;
}

interface Props {
  cart: CartItem[];
  subtotal: number;          // renamed from total — just items sum
  deliveryCharge: number;
  totalInUSD: string;
  paymentMethod: PaymentMethodType;
}

export default function OrderSummary({
  cart, subtotal, deliveryCharge, totalInUSD, paymentMethod
}: Props) {
  const grandTotal = subtotal + deliveryCharge;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
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
          <span className="text-white font-mono">৳{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Delivery</span>
          <span className={`text-sm font-mono ${deliveryCharge === 60 ? "text-green-400" : "text-amber-400"}`}>
            ৳{deliveryCharge}
          </span>
        </div>
        {paymentMethod === "stripe" && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">≈ USD</span>
            <span className="text-white font-mono">${totalInUSD}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <span className="text-white font-semibold">Total</span>
          <span className="text-amber-400 font-bold text-xl font-mono">৳{grandTotal.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}