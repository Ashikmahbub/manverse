"use client";
import { useCart } from "@/store/cart";

export default function Checkout() {
  const { items, clear } = useCart();

  const placeOrder = async () => {
    await fetch("http://localhost:8000/api/orders/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: "Customer",
        phone: "01XXXXXXXXX",
        address: "Dhaka",
        city: "Dhaka",
        total_amount: 2000,
        items
      })
    });
    clear();
    alert("Order placed!");
  };

  return <button onClick={placeOrder}>Place Order (COD)</button>;
}
