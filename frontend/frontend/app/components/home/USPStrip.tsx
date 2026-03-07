export default function USPStrip() {
  return (
    <section className="py-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-gray-200">
      {[
        { icon: "🚚", title: "Free Shipping", desc: "On orders above ৳5000" },
        { icon: "↩️", title: "Easy Returns", desc: "30-day return policy" },
        { icon: "🔒", title: "Secure Payment", desc: "100% secure checkout" },
        { icon: "💎", title: "Premium Quality", desc: "Handpicked fabrics" },
      ].map((item) => (
        <div key={item.title} className="flex flex-col items-center text-center gap-2">
          <span className="text-3xl">{item.icon}</span>
          <h4 className="font-semibold text-gray-900">{item.title}</h4>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </div>
      ))}
    </section>
  );
}