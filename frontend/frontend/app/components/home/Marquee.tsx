export default function Marquee() {
  return (
    <div className="bg-amber-600 text-white py-3 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        {Array(6).fill("FREE SHIPPING ON ORDERS ABOVE ৳5000  •  NEW COLLECTION 2026  •  PREMIUM QUALITY  •  EASY RETURNS  •  ").map((text, i) => (
          <span key={i} className="text-sm tracking-widest mx-8">{text}</span>
        ))}
      </div>
    </div>
  );
}