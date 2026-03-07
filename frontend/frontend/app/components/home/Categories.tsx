export default function Categories() {
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "T-Shirts", emoji: "👕", bg: "bg-stone-100" },
          { label: "Shirts", emoji: "👔", bg: "bg-amber-50" },
          { label: "Pants", emoji: "👖", bg: "bg-stone-100" },
          { label: "Accessories", emoji: "⌚", bg: "bg-amber-50" },
        ].map((cat) => (
          <div key={cat.label} className={`${cat.bg} rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition group`}>
            <span className="text-4xl group-hover:scale-110 transition">{cat.emoji}</span>
            <span className="font-semibold text-gray-800">{cat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}