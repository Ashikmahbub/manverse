export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 mt-8">
      <div className="max-w-[1280px] mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-xl font-bold tracking-widest mb-4">MAN<span className="text-amber-500">VERSE</span></h3>
          <p className="text-gray-400 text-sm leading-relaxed">Crafted for the modern man. Premium menswear for every occasion.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-amber-500">Shop</h4>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li><a href="/#featured" className="hover:text-white transition">Featured</a></li>
            <li><a href="/#trending" className="hover:text-white transition">Trending</a></li>
            <li><a href="/#arrivals" className="hover:text-white transition">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white transition">Collections</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-amber-500">Support</h4>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Returns</a></li>
            <li><a href="/admin" className="hover:text-white transition">Admin</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-amber-500">Contact</h4>
          <p className="text-gray-400 text-sm">support@manverse.com</p>
          <p className="text-gray-400 text-sm mt-2">+880 1234 567890</p>
          <div className="flex gap-4 mt-4 text-xl">
            <a href="#" className="hover:text-amber-500 transition">📘</a>
            <a href="#" className="hover:text-amber-500 transition">📸</a>
            <a href="#" className="hover:text-amber-500 transition">🐦</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        © 2026 Manverse. All rights reserved.
      </div>
    </footer>
  );
}