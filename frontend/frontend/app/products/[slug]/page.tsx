// import Image from "next/image";
// import Link from "next/link";

// interface Variant {
//   id: number;
//   size: string;
//   color: string;
//   stock: number;
// }

// interface Product {
//   id: number;
//   name: string;
//   slug: string;
//   price: string;
//   description: string;
//   image_url: string | null;
//   is_active: boolean;
//   category: number;
//   variants: Variant[];
// }

// async function getProduct(slug: string): Promise<Product> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}/`,
//     { cache: "no-store" }
//   );
//   if (!res.ok) throw new Error("Product not found");
//   return res.json();
// }

// async function getRelated(): Promise<Product[]> {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/products/`,
//     { cache: "no-store" }
//   );
//   return res.json();
// }

// export default async function ProductPage({ params }: { params: { slug: string } }) {
//   const [product, allProducts] = await Promise.all([
//     getProduct(params.slug),
//     getRelated(),
//   ]);

//   const related = allProducts.filter(p => p.slug !== params.slug).slice(0, 4);
//   const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
//   const sizes = product.variants.map(v => v.size).filter(s => s !== "Default");
//   const colors = product.variants.map(v => v.color).filter(c => c !== "Default");

//   return (
//     <div className="min-h-screen bg-[#faf7f2]">

//       {/* NAVBAR */}
//       <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
//         <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
//           <Link href="/" className="text-2xl font-bold tracking-widest">
//             MAN<span className="text-amber-600">VERSE</span>
//           </Link>
//           <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
//             <Link href="/#featured" className="hover:text-amber-600 transition">Featured</Link>
//             <Link href="/#trending" className="hover:text-amber-600 transition">Trending</Link>
//             <Link href="/#arrivals" className="hover:text-amber-600 transition">New Arrivals</Link>
//           </div>
//           <div className="flex gap-4 items-center">
//             <button className="text-gray-600 hover:text-amber-600 text-xl">🛍️</button>
//           </div>
//         </div>
//       </nav>

//       {/* BREADCRUMB */}
//       <div className="max-w-[1280px] mx-auto px-6 py-4 text-sm text-gray-400">
//         <Link href="/" className="hover:text-amber-600 transition">Home</Link>
//         <span className="mx-2">›</span>
//         <Link href="/#featured" className="hover:text-amber-600 transition">Products</Link>
//         <span className="mx-2">›</span>
//         <span className="text-gray-700">{product.name}</span>
//       </div>

//       {/* PRODUCT DETAIL */}
//       <div className="max-w-[1280px] mx-auto px-6 py-10">
//         <div className="grid md:grid-cols-2 gap-16">

//           {/* LEFT - Image */}
//           <div className="flex flex-col gap-4">
//             <div className="bg-[#f0ebe3] rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
//               {product.image_url ? (
//                 <img
//                   src={product.image_url}
//                   alt={product.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <span className="text-8xl">👔</span>
//               )}
//             </div>
//           </div>

//           {/* RIGHT - Info */}
//           <div className="flex flex-col gap-6">
//             <h1 className="text-4xl font-semibold text-gray-900">{product.name}</h1>

//             <div className="flex items-center gap-4">
//               <span className="text-3xl font-bold text-gray-900">৳ {product.price}</span>
//               {totalStock > 0 ? (
//                 <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
//                   In Stock ({totalStock})
//                 </span>
//               ) : (
//                 <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
//                   Out of Stock
//                 </span>
//               )}
//             </div>

//             {/* Rating */}
//             <div className="flex items-center gap-2">
//               <div className="flex text-amber-400 text-sm">★★★★★</div>
//               <span className="text-sm text-gray-400">(24 reviews)</span>
//             </div>

//             <p className="text-gray-600 leading-relaxed">{product.description}</p>

//             {/* Sizes */}
//             {sizes.length > 0 && (
//               <div>
//                 <p className="font-medium text-gray-800 mb-3">Select Size</p>
//                 <div className="flex gap-3 flex-wrap">
//                   {sizes.map((size) => (
//                     <button key={size} className="px-4 h-12 border-2 border-gray-200 rounded-xl text-sm font-medium hover:border-amber-600 hover:text-amber-600 transition">
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Colors */}
//             {colors.length > 0 && (
//               <div>
//                 <p className="font-medium text-gray-800 mb-3">Color</p>
//                 <div className="flex gap-3 flex-wrap">
//                   {colors.map((color) => (
//                     <button key={color} className="px-4 h-10 border-2 border-gray-200 rounded-full text-sm hover:border-amber-600 hover:text-amber-600 transition">
//                       {color}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quantity */}
//             <div>
//               <p className="font-medium text-gray-800 mb-3">Quantity</p>
//               <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden w-fit">
//                 <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition text-lg">−</button>
//                 <span className="px-6 py-2 font-medium">1</span>
//                 <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition text-lg">+</button>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 mt-2">
//               <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-full font-semibold transition">
//                 Add to Cart 🛍️
//               </button>
//               <button className="flex-1 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-4 rounded-full font-semibold transition">
//                 Buy Now
//               </button>
//               <button className="w-14 h-14 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-red-400 hover:text-red-400 transition text-xl">
//                 ♡
//               </button>
//             </div>

//             {/* Delivery Info */}
//             <div className="border-t border-gray-200 pt-6 grid grid-cols-3 gap-4 text-center">
//               {[
//                 { icon: "🚚", text: "Free Delivery", sub: "Above ৳5000" },
//                 { icon: "↩️", text: "Easy Return", sub: "30 days" },
//                 { icon: "🔒", text: "Secure Pay", sub: "100% safe" },
//               ].map((item) => (
//                 <div key={item.text}>
//                   <div className="text-2xl mb-1">{item.icon}</div>
//                   <p className="text-xs font-semibold text-gray-800">{item.text}</p>
//                   <p className="text-xs text-gray-400">{item.sub}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* VARIANTS TABLE */}
//         {product.variants.length > 0 && (
//           <div className="mt-16">
//             <h3 className="text-xl font-semibold mb-6">Available Variants</h3>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-amber-50">
//                     <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Size</th>
//                     <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Color</th>
//                     <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Stock</th>
//                     <th className="text-left px-4 py-3 font-semibold text-gray-700 border border-gray-200">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {product.variants.map((v) => (
//                     <tr key={v.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-3 border border-gray-200">{v.size}</td>
//                       <td className="px-4 py-3 border border-gray-200">{v.color}</td>
//                       <td className="px-4 py-3 border border-gray-200">{v.stock}</td>
//                       <td className="px-4 py-3 border border-gray-200">
//                         {v.stock > 0 ? (
//                           <span className="text-green-600 font-medium">Available</span>
//                         ) : (
//                           <span className="text-red-500 font-medium">Sold Out</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* RELATED PRODUCTS */}
//         <div className="mt-20">
//           <h2 className="text-3xl font-semibold mb-10">You May Also Like</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//             {related.map((p) => (
//               <Link key={p.id} href={`/products/${p.slug}`}>
//                 <div className="group cursor-pointer">
//                   <div className="overflow-hidden rounded-2xl bg-[#f0ebe3] aspect-square flex items-center justify-center">
//                     {p.image_url ? (
//                       <img
//                         src={p.image_url}
//                         alt={p.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
//                       />
//                     ) : (
//                       <span className="text-4xl">👔</span>
//                     )}
//                   </div>
//                   <h3 className="mt-4 font-medium text-gray-900 group-hover:text-amber-600 transition">{p.name}</h3>
//                   <p className="mt-1 text-gray-500 font-semibold">৳ {p.price}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <footer className="bg-gray-900 text-white py-16 mt-20">
//         <div className="max-w-[1280px] mx-auto px-6 text-center text-gray-500 text-sm">
//           © 2026 Manverse. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// }
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}/`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Product fetch error:", error);
    return null;
  }
}

async function getRelated(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    return res.json();
  } catch (error) {
    console.error("Related fetch error:", error);
    return [];
  }
}

/* ---------------- PAGE ---------------- */

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  // 🔥 CRITICAL SAFETY CHECK
  if (!params?.slug) {
    return notFound();
  }

  const [product, allProducts] = await Promise.all([
    getProduct(params.slug),
    getRelated(),
  ]);

  // 🔥 If product not found → show 404 instead of crash
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