export default function Hero() {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600"
        className="w-full h-full object-cover object-top"
        alt="Hero"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <p className="text-amber-400 text-sm tracking-[0.3em] uppercase mb-4 font-medium">New Season 2026</p>
          <h1 className="text-5xl md:text-7xl font-light text-white leading-tight max-w-xl">
            Wear <br /><span className="font-bold italic text-amber-400">Confidence</span>
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-md leading-relaxed">
            Premium menswear crafted for the modern man. Bold. Minimal. Timeless.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#featured" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full font-medium transition">Shop Now</a>
            <a href="#trending" className="border border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-medium transition">Explore</a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <span>↓</span>
      </div>
    </section>
  );
}