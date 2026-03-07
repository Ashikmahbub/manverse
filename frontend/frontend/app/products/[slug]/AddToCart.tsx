"use client";

import { useState } from "react";
import { useCart } from "../../../store/cartStore";
import { useRouter } from "next/navigation";

interface Props {
  product: {
    id: number;
    name: string;
    price: string;
    image_url: string | null;
    slug: string;
    variants: { id: number; size: string; color: string; stock: number }[];
  };
}

export default function AddToCart({ product }: Props) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Default");
  const [selectedColor, setSelectedColor] = useState("Default");
  const [added, setAdded] = useState(false);

  const sizes = product.variants.map(v => v.size).filter(s => s !== "Default");
  const colors = product.variants.map(v => v.color).filter(c => c !== "Default");

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      slug: product.slug,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <p className="font-medium text-gray-800 mb-3">Select Size</p>
          <div className="flex gap-3 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 h-12 border-2 rounded-xl text-sm font-medium transition ${
                  selectedSize === size
                    ? "border-amber-600 text-amber-600 bg-amber-50"
                    : "border-gray-200 hover:border-amber-600 hover:text-amber-600"
                }`}
              >{size}</button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <p className="font-medium text-gray-800 mb-3">Color</p>
          <div className="flex gap-3 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 h-10 border-2 rounded-full text-sm transition ${
                  selectedColor === color
                    ? "border-amber-600 text-amber-600 bg-amber-50"
                    : "border-gray-200 hover:border-amber-600 hover:text-amber-600"
                }`}
              >{color}</button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="font-medium text-gray-800 mb-3">Quantity</p>
        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-fit">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition text-lg">−</button>
          <span className="px-6 py-2 font-medium">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition text-lg">+</button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-4 rounded-full font-semibold transition ${
            added
              ? "bg-green-500 text-white"
              : "bg-amber-600 hover:bg-amber-700 text-white"
          }`}
        >
          {added ? "Added to Cart ✓" : "Add to Cart 🛍️"}
        </button>
        <button
          onClick={() => { handleAddToCart(); router.push("/checkout"); }}
          className="flex-1 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-4 rounded-full font-semibold transition"
        >
          Buy Now
        </button>
        <button className="w-14 h-14 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-red-400 hover:text-red-400 transition text-xl">♡</button>
      </div>
    </div>
  );
}