import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Variant {
  id: number;
  size: string;
  color: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  category: number;
  variants: Variant[];
}

/* ---------------- SAFE FETCH FUNCTIONS ---------------- */

async function getProduct(slug: string): Promise<Product | null> {
  try {
    if (!slug) return null;

    const res = await fetch(
      `/api/products/${slug}/`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

async function getRelated(): Promise<Product[]> {
  try {
    const res = await fetch(
      `/api/products/`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

/* ---------------- PAGE ---------------- */

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params?.slug) {
    return notFound();
  }

  const [product, allProducts] = await Promise.all([
    getProduct(params.slug),
    getRelated(),
  ]);

  if (!product) {
    return notFound();
  }

  const related = allProducts
    .filter((p) => p.slug !== params.slug)
    .slice(0, 4);

  const totalStock = product.variants.reduce(
    (sum, v) => sum + v.stock,
    0
  );

  const sizes = product.variants
    .map((v) => v.size)
    .filter((s) => s !== "Default");

  const colors = product.variants
    .map((v) => v.color)
    .filter((c) => c !== "Default");

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-widest">
            MAN<span className="text-amber-600">VERSE</span>
          </Link>
        </div>
      </nav>

      {/* PRODUCT DETAIL */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-16">

          {/* LEFT - Image */}
          <div className="bg-[#f0ebe3] rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">👔</span>
            )}
          </div>

          {/* RIGHT - Info */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-semibold text-gray-900">
              {product.name}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                ৳ {product.price}
              </span>
              {totalStock > 0 ? (
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                  In Stock ({totalStock})
                </span>
              ) : (
                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-semibold mb-10">
              You May Also Like
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="overflow-hidden rounded-2xl bg-[#f0ebe3] aspect-square flex items-center justify-center">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />
                      ) : (
                        <span className="text-4xl">👔</span>
                      )}
                    </div>
                    <h3 className="mt-4 font-medium text-gray-900 group-hover:text-amber-600 transition">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-gray-500 font-semibold">
                      ৳ {p.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 mt-20">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 Manverse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}