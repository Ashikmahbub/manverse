"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = Object.values(data).flat().join(", ");
        setError(errorMsg);
        return;
      }
      // Auto login after register
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const loginData = await loginRes.json();
      localStorage.setItem("access_token", loginData.access);
      localStorage.setItem("refresh_token", loginData.refresh);
      localStorage.setItem("username", form.username);
      router.push("/");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold tracking-widest text-gray-900">
            MAN<span className="text-amber-600">VERSE</span>
          </Link>
          <p className="text-gray-500 mt-2 text-sm">Create your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create Account</h2>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
          )}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full border text-gray-900 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border text-gray-900 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full border text-gray-900 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full border text-gray-900 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition"
                value={form.password2}
                onChange={(e) => setForm({ ...form, password2: e.target.value })}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-full font-semibold transition mt-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-600 font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}