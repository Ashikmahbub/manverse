import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Fetch real products from Django
  const productsRes = await fetch(`${process.env.BACKEND_URL}/api/products/`);
  const products = await productsRes.json();

  const productContext = products.map((p: any) =>
    `- ${p.name}: ৳${p.price}`
  ).join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",  // cheapest and fastest
      messages: [
        {
          role: "system",
          content: `You are a helpful shopping assistant for Manverse, a premium menswear brand in Bangladesh.
Current products available:
${productContext}
Help customers with products, sizing, orders and style advice. Be friendly and concise.`
        },
        ...messages
      ],
    }),
  });

  const data = await response.json();

  if (data.error) {
    return NextResponse.json({ reply: "Sorry, I'm unavailable right now." }, { status: 500 });
  }

  return NextResponse.json({ reply: data.choices[0].message.content });
}