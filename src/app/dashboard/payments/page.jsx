"use client";

import React, { useCallback, useEffect, useState } from "react";
import AppIcon from "@/components/ui/AppIcon";
import { useNotifications } from "@/lib/NotificationContext";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: "hourglass_top",
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-blue-100 text-blue-800",
    icon: "sync",
  },
  PAID: {
    label: "Paid",
    color: "bg-green-100 text-green-800",
    icon: "check_circle",
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
    icon: "local_shipping",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-800",
    icon: "inventory",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: "cancel",
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-700",
    icon: "undo",
  },
};

export default function PaymentsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { notify } = useNotifications();

  const load = useCallback(() => {
    setLoading(true);
    const sp = new URLSearchParams({ page: String(page) });
    if (filter) sp.set("status", filter);
    fetch(`/api/payments?${sp}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        notify.error("Failed to load payment data");
        setLoading(false);
      });
  }, [page, filter, notify]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-2 border-[#5b3cdd] border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const transactions = data?.transactions || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.limit || 20));

  return (
    <div className="space-y-8">
      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue?.toFixed(2) || "0.00"}`}
          icon="payments"
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Paid Orders"
          value={stats.paidCount || 0}
          icon="check_circle"
          color="bg-green-50 text-green-600"
        />
        <StatCard
          label="Pending Payments"
          value={stats.pendingCount || 0}
          icon="hourglass_top"
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Refunded"
          value={stats.refundedCount || 0}
          icon="undo"
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* ── Monthly Revenue Breakdown ── */}
      {data?.monthlyRevenue && Object.keys(data.monthlyRevenue).length > 0 && (
        <div className="bg-white rounded-xl border border-[#c9c4d8]/20 shadow-sm p-6">
          <h3 className="font-headline text-lg font-bold text-[#1c1a24] mb-4">
            Monthly Revenue
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(data.monthlyRevenue).map(([month, amount]) => {
              const [y, m] = month.split("-");
              const label = new Date(Number(y), Number(m) - 1).toLocaleString(
                "default",
                {
                  month: "short",
                  year: "numeric",
                },
              );
              return (
                <div
                  key={month}
                  className="text-center bg-[#fdf8ff] rounded-xl p-4 border border-[#c9c4d8]/10"
                >
                  <p className="text-xs font-semibold text-[#484555] uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-xl font-headline font-extrabold text-[#5b3cdd] mt-1">
                    ${amount.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Transactions Table ── */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 shadow-sm">
        <div className="p-6 border-b border-[#c9c4d8]/20 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-headline text-lg font-bold text-[#1c1a24]">
            Payment Transactions
          </h3>
          <div className="flex items-center gap-3">
            <select
              className="px-4 py-2 rounded-lg border border-[#c9c4d8]/30 text-sm bg-white focus:border-[#5b3cdd] outline-none"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <span className="text-sm text-[#484555]">
              {data?.total || 0} total
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#fdf8ff] text-[#484555] text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-semibold">Order</th>
                <th className="text-left px-6 py-3 font-semibold">Customer</th>
                <th className="text-left px-6 py-3 font-semibold">Items</th>
                <th className="text-right px-6 py-3 font-semibold">Subtotal</th>
                <th className="text-right px-6 py-3 font-semibold">Tax</th>
                <th className="text-right px-6 py-3 font-semibold">Total</th>
                <th className="text-center px-6 py-3 font-semibold">Status</th>
                <th className="text-left px-6 py-3 font-semibold">
                  Payment ID
                </th>
                <th className="text-left px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9c4d8]/10">
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-[#484555]">
                    No transactions found
                  </td>
                </tr>
              )}
              {transactions.map((txn) => {
                const cfg = STATUS_CONFIG[txn.status] || STATUS_CONFIG.PENDING;
                return (
                  <tr
                    key={txn.id}
                    className="hover:bg-[#fdf8ff]/50 cursor-pointer transition-colors"
                    onClick={() => setSelected(txn)}
                  >
                    <td className="px-6 py-4 font-medium text-[#1c1a24]">
                      #{txn.orderNumber?.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1c1a24]">
                        {txn.user?.name || "—"}
                      </p>
                      <p className="text-xs text-[#797587]">
                        {txn.user?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[#484555]">
                      {txn.items?.length || 0} item
                      {(txn.items?.length || 0) !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      ${txn.subtotal?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-[#797587]">
                      ${txn.tax?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#1c1a24]">
                      ${txn.total?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}
                      >
                        <AppIcon name={cfg.icon} className="h-[14px] w-[14px]" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#797587] font-mono">
                      {txn.stripePaymentId
                        ? txn.stripePaymentId.slice(0, 16) + "…"
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-[#484555]">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#c9c4d8]/10">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 text-sm rounded-lg border border-[#c9c4d8]/30 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-[#484555]">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 text-sm rounded-lg border border-[#c9c4d8]/30 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ── Transaction Detail Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline text-lg font-bold text-[#1c1a24]">
                  Payment Details
                </h3>
                <p className="text-xs text-[#797587]">
                  Order #{selected.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-[#484555] hover:text-[#1c1a24]"
              >
                <AppIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            {/* Status + Date */}
            <div className="flex items-center gap-3">
              {(() => {
                const cfg =
                  STATUS_CONFIG[selected.status] || STATUS_CONFIG.PENDING;
                return (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.color}`}
                  >
                    <AppIcon name={cfg.icon} className="h-[14px] w-[14px]" />
                    {cfg.label}
                  </span>
                );
              })()}
              <span className="text-sm text-[#484555]">
                {new Date(selected.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Customer */}
            <div className="bg-[#fdf8ff] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#484555] uppercase tracking-wider mb-1">
                Customer
              </p>
              <p className="font-medium text-[#1c1a24]">
                {selected.user?.name || "—"}
              </p>
              <p className="text-sm text-[#797587]">{selected.user?.email}</p>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-[#484555] uppercase tracking-wider mb-3">
                Items
              </p>
              <div className="space-y-2">
                {(selected.items || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-[#c9c4d8]/10 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm text-[#1c1a24]">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#797587]">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-[#fdf8ff] rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-[#484555] uppercase tracking-wider mb-2">
                Financial Summary
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-[#484555]">Subtotal</span>
                <span className="font-medium">
                  ${selected.subtotal?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#484555]">Tax</span>
                <span className="font-medium">${selected.tax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#484555]">Shipping</span>
                <span className="font-medium">
                  ${selected.shipping?.toFixed(2)}
                </span>
              </div>
              {selected.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#484555]">Discount</span>
                  <span className="font-medium text-green-600">
                    -${selected.discount?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="border-t border-[#c9c4d8]/20 pt-2 mt-2 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-[#5b3cdd]">
                  ${selected.total?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Stripe Payment Info */}
            {(selected.stripePaymentId || selected.stripeSessionId) && (
              <div className="bg-[#fdf8ff] rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-[#484555] uppercase tracking-wider mb-2">
                  Stripe Details
                </p>
                {selected.stripePaymentId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#484555]">Payment Intent</span>
                    <span className="font-mono text-xs text-[#797587]">
                      {selected.stripePaymentId}
                    </span>
                  </div>
                )}
                {selected.stripeSessionId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#484555]">Session ID</span>
                    <span className="font-mono text-xs text-[#797587]">
                      {selected.stripeSessionId}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {selected.notes && (
              <div>
                <p className="text-xs font-semibold text-[#484555] uppercase tracking-wider mb-1">
                  Notes
                </p>
                <p className="text-sm text-[#484555]">{selected.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 flex items-center gap-4 shadow-sm">
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
          {value}
        </p>
      </div>
    </div>
  );
}
