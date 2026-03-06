import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const productsRes = await fetch(`${process.env.BACKEND_URL}/api/products/`);
  const products = await productsRes.json();

  const productContext = products.map((p: any) =>
    `- ${p.name}: ৳${p.price}`
  ).join("\n");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
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
    console.error("Groq error:", JSON.stringify(data.error));
    return NextResponse.json({ reply: `Error: ${data.error.message}` });
  }

  return NextResponse.json({ reply: data.choices[0].message.content });
}