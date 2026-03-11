"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: string;
  image_url: string | null;
  slug: string;
  category: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
}

interface CategoriesResponse {
  genders: Category[];
  categories: Category[];
}

const CATEGORY_EMOJIS: Record<string, string> = {
  "T-Shirts": "👕",
  "Pants": "👖",
  "Shoes": "👟",
  "Bags": "🎒",
  "Hats": "🧢",
  "Electronics": "🎧",
  "Bottles": "🍶",
  "Men": "👨",
  "Women": "👩",
  "Kids": "👦",
};

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [genders, setGenders] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  // Load categories
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/categories/`)
      .then(r => r.json())
      .then((data: CategoriesResponse) => {
        setGenders(data.genders || []);
        setCategories(data.categories || []);
      })
      .catch(() => {
        setGenders([]);
        setCategories([]);
      });
  }, []);

  // Handle URL params
  useEffect(() => {
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (gender) setSelectedGender(gender);
    if (category) setSelectedCategory(Number(category));
    if (searchParam) setSearch(searchParam);
  }, [searchParams]);

  // Fetch products when filters change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) {
      params.append('category', String(selectedCategory));
    } else if (selectedGender) {
      params.append('gender', selectedGender);
    }
    if (sort) params.append('sort', sort);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/?${params}`)
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [selectedGender, selectedCategory, sort]);

  // Search with debounce
  useEffect(() => {
    if (search === "" && !searchParams.get('search')) return;
    const timer = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', String(selectedCategory));
      else if (selectedGender) params.append('gender', selectedGender);
      if (sort) params.append('sort', sort);

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/?${params}`)
        .then(r => r.json())
        .then(data => {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setProducts([]);
          setLoading(false);
        });
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Filter subcategories by selected gender
  const filteredCategories = selectedGender
    ? categories.filter(cat => {
        const gender = genders.find(g => g.slug === selectedGender);
        return gender ? cat.parent_id === gender.id : true;
      })
    : categories;

  const handleGenderChange = (slug: string | null) => {
    setSelectedGender(slug);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <div className="max-w-[1280px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-amber-600 text-sm tracking-widest uppercase mb-2">Browse</p>
          <h1 className="text-4xl font-semibold text-gray-900">Shop</h1>
        </div>

        {/* Gender Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => handleGenderChange(null)}
            className={`px-8 py-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
              selectedGender === null
                ? "border-amber-600 text-amber-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            All
          </button>
          {genders.map((gender) => (
            <button
              key={gender.id}
              onClick={() => handleGenderChange(gender.slug)}
              className={`px-8 py-3 text-sm font-semibold transition border-b-2 -mb-[2px] ${
                selectedGender === gender.slug
                  ? "border-amber-600 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {CATEGORY_EMOJIS[gender.name] || "👤"} {gender.name}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        {filteredCategories.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition border ${
                selectedCategory === null
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-600"
              }`}
            >
              All
            </button>
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition border ${
                  selectedCategory === cat.id
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-600"
                }`}
              >
                {CATEGORY_EMOJIS[cat.name] || "📦"} {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-200 rounded-full pl-10 pr-4 py-3 text-sm text-gray-900 outline-none focus:border-amber-400 transition bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          <select
            className="border border-gray-200 rounded-full px-6 py-3 text-sm text-gray-700 outline-none focus:border-amber-400 transition bg-white"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Active filters */}
        {(selectedGender || selectedCategory || search) && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {selectedGender && (
              <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full flex items-center gap-2">
                {genders.find(g => g.slug === selectedGender)?.name}
                <button onClick={() => setSelectedGender(null)}>✕</button>
              </span>
            )}
            {selectedCategory && (
              <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full flex items-center gap-2">
                {categories.find(c => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)}>✕</button>
              </span>
            )}
            {search && (
              <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full flex items-center gap-2">
                "{search}"
                <button onClick={() => setSearch("")}>✕</button>
              </span>
            )}
            <button
              onClick={() => { setSelectedGender(null); setSelectedCategory(null); setSearch(""); }}
              className="text-xs text-gray-400 hover:text-red-500 transition underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-400 mb-6">
          {loading ? "Loading..." : `${products.length} products found`}
        </p>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-[3/4]" />
                <div className="h-4 bg-gray-200 rounded mt-4" />
                <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-400 text-sm mb-4">Try a different search or category</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedGender(null); }}
              className="text-amber-600 text-sm underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="group cursor-pointer">
                  <div className="overflow-hidden rounded-2xl bg-[#f0ebe3] aspect-[3/4] flex items-center justify-center relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                      />
                    ) : (
                      <div className="text-4xl">👔</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300" />
                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-6 py-2 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap font-medium shadow">
                      Quick View
                    </button>
                  </div>
                  <div className="mt-4 px-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-amber-700 transition text-sm line-clamp-2">{product.name}</h3>
                    <p className="mt-1 text-gray-500 font-semibold">৳ {product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}