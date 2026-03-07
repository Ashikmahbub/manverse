export default function Banner() {
  return (
    <section className="my-16 rounded-3xl overflow-hidden relative h-80">
      <img
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200"
        className="w-full h-full object-cover object-top"
        alt="Banner"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center text-white">
        <div>
          <p className="text-amber-400 tracking-widest text-sm uppercase mb-3">Limited Edition</p>
          <h3 className="text-4xl font-bold mb-6">Summer Collection</h3>
          <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-amber-600 hover:text-white transition">Shop Now</button>
        </div>
      </div>
    </section>
  );
}