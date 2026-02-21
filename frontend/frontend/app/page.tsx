export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-zinc-800">
        <span className="text-2xl font-bold tracking-tight text-white">
          MAN<span className="text-purple-500">VERSE</span>
        </span>
        <div className="flex gap-6 text-sm text-zinc-400">
          <a href="#" className="hover:text-white transition">Shop</a>
          <a href="#" className="hover:text-white transition">About</a>
          <a href="/admin" className="hover:text-white transition">Admin</a>
          <a href="/api/products/" className="hover:text-white transition">API</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black z-0" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <span className="text-xs uppercase tracking-widest text-purple-400 border border-purple-800 px-4 py-1 rounded-full">
            New Collection 2026
          </span>
          <h1 className="text-6xl font-extrabold tracking-tight leading-tight max-w-2xl">
            Redefine Your <span className="text-purple-500">Style</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
            Premium menswear crafted for the modern man. Bold. Minimal. Timeless.
          </p>
          <div className="flex gap-4 mt-4">
            
              href="#"
              className="bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-full text-sm font-semibold"
            >
              Shop Now
            </a>
            
              href="#"
              className="border border-zinc-700 hover:border-zinc-400 transition px-8 py-3 rounded-full text-sm font-semibold text-zinc-300"
            >
              Explore
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-px border-t border-zinc-800 bg-zinc-800">
        {[
          { title: "Premium Quality", desc: "Handpicked fabrics from top suppliers worldwide." },
          { title: "Fast Delivery", desc: "Free shipping on all orders above $100." },
          { title: "Easy Returns", desc: "30-day hassle-free return policy." },
        ].map((f) => (
          <div key={f.title} className="bg-black px-10 py-12 flex flex-col gap-3">
            <h3 className="text-white font-semibold text-lg">{f.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CI/CD Test Banner */}
      <section className="flex items-center justify-center py-8 bg-purple-900/20 border-t border-purple-800/30">
        <p className="text-purple-400 text-sm tracking-wide">
          🚀 Deployed via CI/CD — GitHub Actions → Docker → Live

          self hosted runner
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-zinc-600 text-sm border-t border-zinc-800">
        © 2026 Manverse. All rights reserved.
      </