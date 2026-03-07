import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  image_url: string | null;
  slug: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group cursor-pointer">
        <div className="overflow-hidden rounded-2xl bg-[#f0ebe3] aspect-[3/4] flex items-center justify-center relative">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
            />
          ) : (
            <div className="text-[#c8b89a] text-4xl">👔</div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />
          <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap font-medium shadow">
            Quick View
          </button>
        </div>
        <div className="mt-4 px-1">
          <h3 className="font-medium text-gray-900 group-hover:text-amber-700 transition">{product.name}</h3>
          <p className="mt-1 text-gray-500 font-semibold">৳ {product.price}</p>
        </div>
      </div>
    </Link>
  );
}