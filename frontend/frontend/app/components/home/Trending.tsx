import Link from "next/link";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: string;
  image_url: string | null;
  slug: string;
}

export default function Trending({ products }: { products: Product[] }) {
  return (
    <section id="trending" className="py-16">
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-amber-600 text-sm tracking-widest uppercase mb-2">What's Hot</p>
          <h2 className="text-4xl font-semibold">Trending Now</h2>
        </div>
        <Link href="#" className="text-sm font-medium text-gray-500 hover:text-amber-600 transition border-b border-gray-300 pb-1">View All →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}