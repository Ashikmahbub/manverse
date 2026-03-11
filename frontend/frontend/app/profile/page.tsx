"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface OrderItem {
  product: string;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        return r.json();
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([profileData, ordersData]) => {
        if (!profileData) return;
        setProfile(profileData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [mounted]);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("userChanged"));
    router.push("/");
  };

  const statusColor = (status: string) => {
    if (status === "DELIVERED") return "bg-green-100 text-green-700";
    if (status === "CONFIRMED") return "bg-blue-100 text-blue-700";
    return "bg-amber-100 text-amber-700";
  };

  if (!mounted || loading) return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <div className="max-w-[800px] mx-auto px-6 py-16">

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl">👤</div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">{profile?.username}</h1>
            <p className="text-gray-400 text-sm">{profile?.email || "No email set"}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-50 text-red-500 px-4 py-2 rounded-full text-sm hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-2 rounded-full text-sm font=medium transition ${
              activeTab === "profile"
                ? "bg-amber-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              activeTab === "orders"
                ? "bg-amber-600 text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            Order History ({orders.length})
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Account Details</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: "Username", value: profile?.username },
                { label: "Email", value: profile?.email || "—" },
                { label: "First Name", value: profile?.first_name || "—" },
                { label: "Last Name", value: profile?.last_name || "—" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between py-3 border-b border-gray-100"
                >
                  <span className="text-gray-500 text-sm">{item.label}</span>
                  <span className="text-gray-900 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <p className="text-4xl mb-4">📦</p>
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-400">{order.created_at}</p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product} x{item.quantity}
                        </span>
                        <span className="text-gray-900 font-medium">
                          ৳ {(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="font-semibold text-amber-600">
                      ৳ {order.total_amount}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}