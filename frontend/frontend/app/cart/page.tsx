"use client";

import { useCart } from "@/store/cart";

export default function CartPage() {
  const { items, clear } = useCart();

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Cart</h1>

      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {items.map((item, index) => (
            <div key={index}>
              <p>{item.name}</p>
              <p>৳ {item.price}</p>
            </div>
          ))}

          <button onClick={clear}>Clear Cart</button>
        </>
      )}
    </div>
  );
}
