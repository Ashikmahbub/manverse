export default function Newsletter() {
  return (
    <section className="py-20 text-center">
      <div className="bg-amber-600 rounded-3xl px-8 py-16 text-white">
        <h3 className="text-3xl font-bold mb-4">Stay in Style</h3>
        <p className="text-amber-100 mb-8">Subscribe to get exclusive deals and new arrivals first.</p>
        <div className="flex max-w-md mx-auto gap-3">
          <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-3 rounded-full text-gray-900 outline-none text-sm" />
          <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap">Subscribe</button>
        </div>
      </div>
    </section>
  );
}