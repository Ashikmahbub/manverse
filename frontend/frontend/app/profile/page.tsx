"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    router.push("/");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* NAVBAR */}
      {/* <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-widest text-gray-900">
            MAN<span className="text-amber-600">VERSE</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/cart" className="text-gray-600 hover:text-amber-600 transition text-xl">🛍️</Link>
            <button onClick={logout} className="bg-amber-600 text-white text-sm px-5 py-2 rounded-full hover:bg-amber-700 transition">
              Logout
            </button>
          </div>
        </div>
      </nav> */}

      <div className="max-w-[600px] mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-3xl mb-4">
              👤
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">{profile?.username}</h1>
            <p className="text-gray-400 text-sm mt-1">{profile?.email}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
          )}

          {/* Profile Info */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Username</span>
              <span className="text-gray-900 font-medium">{profile?.username}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Email</span>
              <span className="text-gray-900 font-medium">{profile?.email || "—"}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">First Name</span>
              <span className="text-gray-900 font-medium">{profile?.first_name || "—"}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Last Name</span>
              <span className="text-gray-900 font-medium">{profile?.last_name || "—"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-8">
            <Link href="/cart" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-full font-semibold transition text-center">
              View Cart 🛍️
            </Link>
            <button onClick={logout} className="w-full border border-gray-200 text-gray-600 py-3 rounded-full font-medium hover:border-red-400 hover:text-red-500 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}