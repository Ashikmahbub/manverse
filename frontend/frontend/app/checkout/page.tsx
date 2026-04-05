"use client";
import { useState } from "react";
import { useCart } from "@/app/store/cartStore";
import { useRouter } from "next/navigation";
import DeliveryForm from "./components/DeliveryForm";
import PaymentMethod from "./components/PaymentMethod";
import OrderSummary from "./components/OrderSummary";

type PaymentMethodType = "sslcommerz" | "stripe" | "cod";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("sslcommerz");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [form, setForm] = useState({
    full_name: "", phone: "", address: "", city: "", postcode: "",
  });

  // Delivery charge based on city
  const deliveryCharge = form.city.toLowerCase().trim() === "dhaka" ? 60 : 120;
  const subtotal       = cart.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const grandTotal     = subtotal + deliveryCharge;
  const totalInUSD     = (grandTotal / 110).toFixed(2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.full_name || !form.phone || !form.address || !form.city || !form.postcode) {
      setError("Please fill in all fields."); return false;
    }
    if (cart.length === 0) { setError("Your cart is empty."); return false; }
    return true;
  };

  const getToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.push("/login?redirect=/checkout"); return null; }
    return token;
  };

  const orderPayload = (paymentType: string) => ({
    ...form,
    delivery_charge: deliveryCharge,
    payment_method: paymentType,
    items: cart.map(i => ({
      product: i.name, size: i.size || "", color: i.color || "",
      price: i.price, quantity: i.quantity,
    })),
  });

  const handleSSLCommerz = async () => {
    if (!validate()) return;
    setLoading(true); setError("");
    const token = getToken(); if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/payment/initiate/`,
      { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderPayload("sslcommerz")) }
    );
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Payment failed."); setLoading(false); return; }
    clearCart();
    window.location.href = data.payment_url;
  };

  const handleCOD = async () => {
    if (!validate()) return;
    setLoading(true); setError("");
    const token = getToken(); if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create/`,
      { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderPayload("cod")) }
    );
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Order failed."); setLoading(false); return; }
    clearCart();
    router.push(`/order-success?tran_id=${data.order_code}`);
  };

  return (
    <div className="min-h-screen bg-[#0f2744] pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
        <p className="text-gray-400 text-sm mb-8 font-mono">Secure payment · SSL encrypted</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <DeliveryForm form={form} onChange={handleChange} deliveryCharge={deliveryCharge}/>

            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onSSLCommerz={handleSSLCommerz}
              onCOD={handleCOD}
              loading={loading}
              cartEmpty={cart.length === 0}
              form={form}
              items={cart}
              totalInUSD={totalInUSD}
              clearCart={clearCart}
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

          <div>
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              totalInUSD={totalInUSD}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}