import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const lastUserMessage = [...messages]
    .reverse()
    .find((m: any) => m.role === "user")?.content ?? "";

  let productContext = "";
  try {
    const ragRes = await fetch(
      `${process.env.BACKEND_URL}/api/rag-search/?q=${encodeURIComponent(lastUserMessage)}`
    );
    const ragData = await ragRes.json();

    if (ragData.chunks?.length > 0) {
      productContext = ragData.chunks
        .map((c: any) => `- ${c.content}`)
        .join("\n");
    } else {
      const fallbackRes = await fetch(`${process.env.BACKEND_URL}/api/products/`);
      const fallback = await fallbackRes.json();
      productContext = fallback
        .slice(0, 5)
        .map((p: any) => `- ${p.name}: ৳${p.price}`)
        .join("\n");
    }
  } catch (err) {
    console.error("RAG search failed:", err);
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are a helpful shopping assistant for Manverse, a premium menswear brand in Bangladesh.
Relevant products for this query:
${productContext || "No specific products found. Answer generally."}
Help customers with products, sizing, orders and style advice. Be friendly and concise.`,
        },
        ...messages,
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
