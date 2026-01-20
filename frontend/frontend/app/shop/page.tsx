import Link from "next/link";

async function getProducts() {
  const res = await fetch("http://127.0.0.1:8000/api/products/", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div style={{ padding: 20 }}>
      <h1>Shop</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {products.map((product: any) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ border: "1px solid #ddd", padding: 10 }}>
              {product.image && (
                <img
                  src={`http://127.0.0.1:8000${product.image}`}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    marginBottom: 10,
                  }}
                />
              )}

              <h3>{product.name}</h3>
              <p>৳ {product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
