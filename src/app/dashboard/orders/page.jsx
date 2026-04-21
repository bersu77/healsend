"use client";

import React, { useCallback, useEffect, useState } from "react";
import AppIcon from "@/components/ui/AppIcon";
import { formatUsd } from "@/lib/pricing";
import { useNotifications } from "@/lib/NotificationContext";

const STATUS_LABELS = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "Paid", color: "bg-green-100 text-green-800" },
  PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800" },
  SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  DELIVERED: { label: "Delivered", color: "bg-emerald-100 text-emerald-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Refunded", color: "bg-gray-100 text-gray-700" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 20,
  });
  const [params, setParams] = useState({ page: 1, status: "" });
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const { notify } = useNotifications();

  const load = useCallback(() => {
    const sp = new URLSearchParams({ page: String(params.page) });
    if (params.status) sp.set("status", params.status);
    fetch(`/api/orders?${sp}`)
      .then((r) => r.json())
      .then((d) => {
        const nextOrders = Array.isArray(d?.orders) ? d.orders : [];
        const total =
          typeof d?.total === "number" ? d.total : nextOrders.length;
        const page = typeof d?.page === "number" ? d.page : params.page;
        const limit = typeof d?.limit === "number" ? d.limit : meta.limit;
        const totalPages = Math.max(1, Math.ceil(total / (limit || 20)));
        setOrders(nextOrders);
        setMeta({ total, page, totalPages, limit });
      })
      .catch(() => {});
  }, [meta.limit, params.page, params.status]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = (order) => {
    setSelected(order);
    setNewStatus(order.status);
    setNotes(order.notes || "");
  };

  const updateOrder = async () => {
    const res = await fetch(`/api/orders/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, notes }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      notify.error("Error", data?.error || "Failed to update order.");
      return;
    }
    notify.success("Order Updated", "Order status has been updated.");
    setSelected(null);
    load();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          className="px-4 py-2 rounded-lg border border-[#c9c4d8]/30 text-sm bg-white focus:border-[#5b3cdd] outline-none"
          value={params.status}
          onChange={(e) => setParams({ page: 1, status: e.target.value })}
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-[#484555]">
          {(meta?.total ?? orders.length) || 0} orders
        </span>
      </div>

      {/* Order detail overlay */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90svh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline text-lg font-bold">
                  Order #{selected.id.slice(0, 8)}
                </h3>
                <p className="text-xs text-[#797587]">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-[#484555]"
              >
                <AppIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="border rounded-lg divide-y text-sm">
              {(selected.items || []).map((item, i) => (
                <div key={i} className="flex justify-between px-4 py-2">
                  <span>
                    {item.name} &times; {item.quantity}
                  </span>
                  <span className="font-semibold">
                    {formatUsd(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-2 bg-[#f1ecf9] font-bold">
                <span>Total</span>
                <span>{formatUsd(selected.total)}</span>
              </div>
            </div>

            {/* Update status */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 text-sm"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Notes
              </label>
              <textarea
                className="w-full px-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 text-sm h-20"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                onClick={updateOrder}
                className="hs-gradient-btn px-5 py-2 rounded-lg text-sm font-semibold"
              >
                Update Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f1ecf9] text-[#484555]">
              <th className="text-left px-6 py-3 font-semibold">Order</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Total</th>
              <th className="text-right px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c9c4d8]/10">
            {orders.map((o) => {
              const s = STATUS_LABELS[o.status] || STATUS_LABELS.PENDING;
              return (
                <tr key={o.id} className="hover:bg-[#fdf8ff]">
                  <td className="px-6 py-4 font-medium text-[#1c1a24]">
                    #{o.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-4 text-[#797587]">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.color}`}
                    >
                      {s.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold">
                    {formatUsd(o.total)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openDetail(o)}
                      className="text-[#5b3cdd] hover:opacity-70"
                    >
                      <AppIcon
                        name="visibility"
                        className="h-[18px] w-[18px]"
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-[#484555]">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setParams((s) => ({ ...s, page: p }))}
              className={`w-9 h-9 rounded-lg text-sm font-semibold ${p === meta.page ? "hs-gradient text-white" : "border hover:bg-[#f1ecf9]"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
