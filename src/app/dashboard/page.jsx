"use client";

import React, { useEffect, useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

const STATS = [
  {
    label: "Total Products",
    icon: "inventory_2",
    key: "products",
    color: "bg-[#e5deff] text-[#5b3cdd]",
  },
  {
    label: "Total Orders",
    icon: "shopping_bag",
    key: "orders",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Revenue",
    icon: "payments",
    key: "revenue",
    color: "bg-amber-50 text-amber-600",
    format: "currency",
  },
  {
    label: "Categories",
    icon: "category",
    key: "categories",
    color: "bg-blue-50 text-blue-600",
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    categories: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?limit=1").then((r) => r.json()),
      fetch("/api/orders?limit=5").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/payments?limit=1").then((r) => r.json()),
    ])
      .then(([prodData, orderData, catData, paymentData]) => {
        const revenue = paymentData?.stats?.totalRevenue || 0;
        setStats({
          products: prodData.total || 0,
          orders: orderData.total || 0,
          revenue,
          categories: catData?.length || 0,
        });
        setRecentOrders(orderData.orders || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map(({ label, icon, key, color, format }) => (
          <div
            key={key}
            className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 flex items-center gap-4 shadow-sm"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
            >
              <AppIcon name={icon} className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#484555] font-semibold">
                {label}
              </p>
              <p className="text-2xl font-headline font-extrabold text-[#1c1a24]">
                {format === "currency"
                  ? `$${stats[key].toFixed(2)}`
                  : stats[key]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 shadow-sm">
        <div className="p-6 border-b border-[#c9c4d8]/20">
          <h3 className="font-headline text-lg font-bold text-[#1c1a24]">
            Recent Orders
          </h3>
        </div>
        <div className="divide-y divide-[#c9c4d8]/10">
          {recentOrders.length === 0 && (
            <div className="p-8 text-center text-[#484555]">No orders yet</div>
          )}
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm text-[#1c1a24]">
                  {order.orderNumber?.slice(0, 12)}...
                </p>
                <p className="text-xs text-[#484555]">{order.user?.email}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">
                  ${order.total?.toFixed(2)}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === "PAID"
                      ? "bg-emerald-50 text-emerald-700"
                      : order.status === "PROCESSING"
                        ? "bg-blue-50 text-blue-700"
                      : order.status === "PENDING"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
