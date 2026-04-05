"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import AppIcon from "@/components/ui/AppIcon";
import { useNotifications } from "@/lib/NotificationContext";

const STATUS_OPTIONS = [
  "ACTIVE",
  "TRIALING",
  "PAST_DUE",
  "CANCELED",
  "EXPIRED",
];

const STATUS_STYLES = {
  ACTIVE: "bg-green-100 text-green-700",
  TRIALING: "bg-blue-100 text-blue-700",
  PAST_DUE: "bg-amber-100 text-amber-700",
  CANCELED: "bg-red-100 text-red-700",
  EXPIRED: "bg-gray-100 text-gray-700",
};

const EMPTY_FORM = {
  userId: "",
  planName: "",
  status: "ACTIVE",
  amount: "",
  currency: "USD",
  interval: "month",
  intervalCount: 1,
  stripeSubscriptionId: "",
  startDate: "",
  nextBillingDate: "",
  endDate: "",
  cancelAtPeriodEnd: false,
  notes: "",
};

function toDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const { notify } = useNotifications();

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 20)), [total]);

  const loadUsers = useCallback(() => {
    fetch("/api/admin/users?limit=100")
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d?.users) ? d.users : []))
      .catch(() => setUsers([]));
  }, []);

  const loadSubscriptions = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (status) params.set("status", status);

    fetch(`/api/admin/subscriptions?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setSubscriptions(Array.isArray(d?.subscriptions) ? d.subscriptions : []);
        setTotal(typeof d?.total === "number" ? d.total : 0);
      })
      .finally(() => setLoading(false));
  }, [page, search, status]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const openCreate = () => {
    setEditing("new");
    setForm(EMPTY_FORM);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      userId: s.userId || "",
      planName: s.planName || "",
      status: s.status || "ACTIVE",
      amount: s.amount ?? "",
      currency: s.currency || "USD",
      interval: s.interval || "month",
      intervalCount: s.intervalCount || 1,
      stripeSubscriptionId: s.stripeSubscriptionId || "",
      startDate: toDateInput(s.startDate),
      nextBillingDate: toDateInput(s.nextBillingDate),
      endDate: toDateInput(s.endDate),
      cancelAtPeriodEnd: !!s.cancelAtPeriodEnd,
      notes: s.notes || "",
    });
  };

  const save = async () => {
    if (!form.userId || !form.planName || form.amount === "") return;

    setSaving(true);
    const isNew = editing === "new";
    const url = isNew
      ? "/api/admin/subscriptions"
      : `/api/admin/subscriptions/${editing.id}`;
    const payload = {
      ...form,
      amount: Number(form.amount),
      intervalCount: Number(form.intervalCount || 1),
      startDate: form.startDate || null,
      nextBillingDate: form.nextBillingDate || null,
      endDate: form.endDate || null,
    };

    try {
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        notify.error("Error", data.error || "Failed to save subscription");
        return;
      }
      notify.success(
        isNew ? "Subscription Created" : "Subscription Updated",
        `${payload.planName} has been ${isNew ? "created" : "updated"}.`,
      );
      setEditing(null);
      loadSubscriptions();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this subscription?")) return;
    const res = await fetch(`/api/admin/subscriptions/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      notify.success("Deleted", "Subscription has been removed.");
      loadSubscriptions();
    } else {
      notify.error("Error", "Failed to delete subscription");
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-[#c9c4d8]/30 bg-white text-sm focus:border-[#5b3cdd] focus:ring-0 outline-none";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold text-[#1c1a24]">
          Subscriptions ({total})
        </h2>
        <button
          onClick={openCreate}
          className="bg-[#5b3cdd] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a2fc7] transition-colors flex items-center gap-2"
        >
          <AppIcon name="add" className="h-[18px] w-[18px]" />
          Create Subscription
        </button>
      </div>

      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by plan, user, email, Stripe ID..."
          className="flex-1 max-w-md px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {editing !== null && (
        <div className="bg-white rounded-xl border border-[#c9c4d8]/20 p-6 space-y-4">
          <h3 className="font-headline text-lg font-bold">
            {editing === "new" ? "New Subscription" : "Edit Subscription"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                User
              </label>
              <select
                value={form.userId}
                onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
                className={inputCls}
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {(u.name || "Unnamed")} - {u.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Plan Name
              </label>
              <input
                className={inputCls}
                value={form.planName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, planName: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                className={inputCls}
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Currency
              </label>
              <input
                className={inputCls}
                value={form.currency}
                onChange={(e) =>
                  setForm((f) => ({ ...f, currency: e.target.value.toUpperCase() }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Interval
              </label>
              <input
                className={inputCls}
                value={form.interval}
                onChange={(e) =>
                  setForm((f) => ({ ...f, interval: e.target.value.toLowerCase() }))
                }
                placeholder="month"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Every N Intervals
              </label>
              <input
                type="number"
                min={1}
                className={inputCls}
                value={form.intervalCount}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    intervalCount: Math.max(1, Number(e.target.value || 1)),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className={inputCls}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Stripe Subscription ID
              </label>
              <input
                className={inputCls}
                value={form.stripeSubscriptionId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stripeSubscriptionId: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Start Date
              </label>
              <input
                type="date"
                className={inputCls}
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                Next Billing Date
              </label>
              <input
                type="date"
                className={inputCls}
                value={form.nextBillingDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nextBillingDate: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#484555] uppercase">
                End Date
              </label>
              <input
                type="date"
                className={inputCls}
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="cancelAtPeriodEnd"
              type="checkbox"
              checked={form.cancelAtPeriodEnd}
              onChange={(e) =>
                setForm((f) => ({ ...f, cancelAtPeriodEnd: e.target.checked }))
              }
            />
            <label
              htmlFor="cancelAtPeriodEnd"
              className="text-sm text-[#484555] cursor-pointer"
            >
              Cancel at period end
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#484555] uppercase">
              Notes
            </label>
            <textarea
              className={`${inputCls} h-20`}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving || !form.userId || !form.planName || form.amount === ""}
              className="hs-gradient-btn px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-5 py-2 rounded-lg border text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f1ecf9] text-[#484555]">
              <th className="text-left px-6 py-3 font-semibold">User</th>
              <th className="text-left px-4 py-3 font-semibold">Plan</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-left px-4 py-3 font-semibold">Billing</th>
              <th className="text-left px-4 py-3 font-semibold">Next Bill</th>
              <th className="text-right px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c9c4d8]/10">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#484555]">
                  Loading...
                </td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-[#484555]">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              subscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-[#fdf8ff]">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#1c1a24]">
                        {s.user?.name || "—"}
                      </p>
                      <p className="text-xs text-[#484555]">{s.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{s.planName}</p>
                    {s.stripeSubscriptionId && (
                      <p className="text-xs text-[#797587]">
                        {s.stripeSubscriptionId}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        STATUS_STYLES[s.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#484555]">
                    {Number(s.amount).toFixed(2)} {s.currency} / {s.intervalCount}{" "}
                    {s.interval}
                  </td>
                  <td className="px-4 py-4 text-[#484555]">
                    {s.nextBillingDate
                      ? new Date(s.nextBillingDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEdit(s)}
                      className="text-[#5b3cdd] hover:opacity-70 mr-2"
                    >
                      <AppIcon name="edit" className="h-[18px] w-[18px]" />
                    </button>
                    <button
                      onClick={() => remove(s.id)}
                      className="text-red-500 hover:opacity-70"
                    >
                      <AppIcon name="delete" className="h-[18px] w-[18px]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-sm text-[#484555]">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
