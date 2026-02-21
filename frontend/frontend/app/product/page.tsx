import Image from "next/image";

async function getProduct(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}/`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

interface PageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = params;
  const product = await getProduct(slug);

  return (
    <div style={{ padding: 40 }}>
      <h1>{product.name}</h1>

      {product.image_url && (
        <Image
          src={product.image_url}
          alt={product.name}
          width={400}
          height={400}
        />
      )}

      <p>{product.description}</p>
      <p>৳ {product.price}</p>
    </div>
  );
}