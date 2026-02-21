import Image from "next/image"

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("Failed to fetch products")
  }

  return res.json()
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-[#006A4E] text-white px-10 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center">
        Our Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="bg-[#004d38] p-6 rounded-xl border border-green-900 hover:border-[#B30000] transition"
          >
            {/* REAL IMAGE */}
            <Image
              src={product.image_url}
              alt={product.name}
              width={500}
              height={400}
              className="rounded-lg object-cover h-60 w-full"
            />

            <h3 className="mt-4 font-semibold text-lg">
              {product.name}
            </h3>

            <p className="text-green-200 text-sm mt-2">
              ${product.price}
            </p>

            <a
              href={`/product/${product.slug}`}
              className="inline-block mt-4 bg-[#B30000] hover:bg-[#8E0000] px-6 py-2 rounded-full text-sm transition"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}