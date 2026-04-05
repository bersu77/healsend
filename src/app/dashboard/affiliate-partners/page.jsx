"use client";

import { useEffect, useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

// ─── Shared helpers ──────────────────────────────────────────────────────────

function fmt(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function usd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function Badge({ label, color }) {
  const colors = {
    amber: "bg-amber-100 text-amber-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[color] ?? colors.gray}`}>
      {label}
    </span>
  );
}

const APP_STATUS_COLOR = { PENDING: "amber", APPROVED: "green", REJECTED: "red" };
const REWARD_STATUS_COLOR = { PENDING: "amber", APPROVED: "blue", PAID: "green", REJECTED: "red" };

function FilterBar({ options, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            active === o
              ? "bg-[#5b3cdd] text-white shadow-sm"
              : "border border-[#d7d1e4] bg-white text-[#484555] hover:bg-[#f6f2ff]"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Btn({ onClick, disabled, children, v = "primary" }) {
  const s = {
    primary: "bg-[#5b3cdd] text-white hover:bg-[#4b30c4] disabled:opacity-50",
    green: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50",
    blue: "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50",
    ghost: "border border-[#d7d1e4] text-[#484555] hover:bg-[#f6f2ff] disabled:opacity-50",
    danger: "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50",
  };
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${s[v]}`}
    >
      {children}
    </button>
  );
}

function Err({ msg }) {
  if (!msg) return null;
  return <p className="mb-4 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-700">{msg}</p>;
}

// ─── Applications Tab ────────────────────────────────────────────────────────

function ApplicationsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState({});
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("PENDING");

  async function load(status) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/affiliate-applications?status=${status}`, { credentials: "same-origin" });
      const data = await res.json().catch(() => ({}));
      setItems(Array.isArray(data.applications) ? data.applications : []);
    } catch { setError("Failed to load applications."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(filter); }, [filter]); // eslint-disable-line

  async function act(id, action, reason) {
    setBusy((p) => ({ ...p, [id]: true }));
    setError("");
    try {
      const res = await fetch("/api/admin/affiliate-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id, action, reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Action failed");
      load(filter);
    } catch (err) { setError(err.message); }
    finally { setBusy((p) => ({ ...p, [id]: false })); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1c1a24]">Applications</h2>
          <p className="text-sm text-[#484555]">Review and approve partner applications.</p>
        </div>
        <FilterBar options={["PENDING", "APPROVED", "REJECTED"]} active={filter} onChange={setFilter} />
      </div>
      <Err msg={error} />
      {loading ? (
        <p className="py-6 text-sm text-[#484555]">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-[#faf9fe] px-5 py-8 text-center text-sm text-[#797587]">
          No {filter.toLowerCase()} applications.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((app) => (
            <div key={app.id} className="rounded-2xl border border-[#ece8f6] bg-white p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#1c1a24]">{app.firstName} {app.lastName}</span>
                    <Badge label={app.status} color={APP_STATUS_COLOR[app.status]} />
                  </div>
                  <p className="text-xs text-[#797587]">{app.user?.email}</p>
                  {app.referralCode && (
                    <p className="font-mono text-xs text-[#5b3cdd]">ref: {app.referralCode}</p>
                  )}
                  {app.motivation && (
                    <p className="text-sm text-[#484555]"><span className="font-semibold">Motivation: </span>{app.motivation}</p>
                  )}
                  {app.website && (
                    <p className="text-xs text-[#797587]"><span className="font-semibold">Website: </span>{app.website}</p>
                  )}
                  <p className="text-xs text-[#b0acba]">Applied {fmt(app.createdAt)}</p>
                  {app.rejectionReason && (
                    <p className="text-xs text-rose-600">Rejected: {app.rejectionReason}</p>
                  )}
                  {app.affiliateLinks?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {app.affiliateLinks.map((lnk) => (
                        <span key={lnk.id} className="rounded-full bg-[#f1ecf9] px-2 py-0.5 text-[11px] text-[#5b3cdd]">
                          /{lnk.code} · {lnk._count?.referrals ?? 0} refs · {lnk.clickCount} clicks
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {app.status === "APPROVED" && (
                    <div className="text-right text-xs text-[#484555]">
                      <p>Earned <span className="font-bold text-[#1c1a24]">{usd(app.totalEarnings)}</span></p>
                      <p>Pending <span className="font-bold text-amber-700">{usd(app.pendingPayout)}</span></p>
                    </div>
                  )}
                  {app.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Btn v="green" disabled={busy[app.id]} onClick={() => act(app.id, "approve")}>
                        {busy[app.id] ? "…" : "Approve"}
                      </Btn>
                      <Btn v="danger" disabled={busy[app.id]}
                        onClick={() => { const r = window.prompt("Rejection reason (optional):"); act(app.id, "reject", r || ""); }}>
                        {busy[app.id] ? "…" : "Reject"}
                      </Btn>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Links Tab ───────────────────────────────────────────────────────────────

const EMPTY_LINK = { code: "", name: "", destinationPath: "/", payoutType: "FIXED", payoutAmount: 50, campaignName: "", isActive: true };

function LinksTab() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState({});
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_LINK);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/affiliate-links", { credentials: "same-origin" });
      const data = await res.json().catch(() => ({}));
      setLinks(Array.isArray(data.affiliates) ? data.affiliates : []);
    } catch { setError("Failed to load links."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/affiliate-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to create");
      setShowForm(false); setForm(EMPTY_LINK); load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function toggleActive(lnk) {
    setBusy((p) => ({ ...p, [lnk.id]: true }));
    try {
      await fetch("/api/admin/affiliate-links", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id: lnk.id, isActive: !lnk.isActive }),
      });
      load();
    } finally { setBusy((p) => ({ ...p, [lnk.id]: false })); }
  }

  async function deleteLink(id) {
    if (!window.confirm("Delete this link? This cannot be undone.")) return;
    setBusy((p) => ({ ...p, [id]: true }));
    try {
      await fetch("/api/admin/affiliate-links", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id }),
      });
      load();
    } finally { setBusy((p) => ({ ...p, [id]: false })); }
  }

  function copyUrl(id, url) {
    navigator.clipboard?.writeText(url).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000); });
  }

  const fld = (key) => ({
    value: form[key],
    onChange: (e) => setForm((p) => ({ ...p, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value })),
  });

  const inputCls = "w-full rounded-xl border border-[#d7d1e4] px-3 py-2 text-sm focus:border-[#5b3cdd] focus:outline-none";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1c1a24]">Affiliate Links</h2>
          <p className="text-sm text-[#484555]">Create and manage referral share links.</p>
        </div>
        <Btn onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "+ New link"}</Btn>
      </div>
      <Err msg={error} />
      {showForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-[#d7d1e4] bg-[#faf9fe] p-5">
          <p className="mb-4 font-semibold text-[#1c1a24]">New affiliate link</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#484555]">Code (URL slug) *</label>
              <input required {...fld("code")} placeholder="e.g. alice2026" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#484555]">Display name *</label>
              <input required {...fld("name")} placeholder="e.g. Alice – Homepage" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#484555]">Destination path</label>
              <input {...fld("destinationPath")} placeholder="/" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#484555]">Campaign name</label>
              <input {...fld("campaignName")} placeholder="e.g. Newsletter Q2 2026" className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#484555]">Payout type</label>
              <select {...fld("payoutType")} className={inputCls}>
                <option value="FIXED">Fixed ($)</option>
                <option value="PERCENTAGE">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#484555]">Payout amount</label>
              <input type="number" min="0" step="0.01" {...fld("payoutAmount")} className={inputCls} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input type="checkbox" id="newLinkActive" checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
              className="h-4 w-4 rounded border-[#d7d1e4] accent-[#5b3cdd]" />
            <label htmlFor="newLinkActive" className="text-sm text-[#484555]">Active</label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Btn v="ghost" onClick={() => { setShowForm(false); setForm(EMPTY_LINK); }}>Cancel</Btn>
            <Btn disabled={saving}>{saving ? "Creating…" : "Create link"}</Btn>
          </div>
        </form>
      )}
      {loading ? (
        <p className="py-6 text-sm text-[#484555]">Loading…</p>
      ) : links.length === 0 ? (
        <div className="rounded-2xl bg-[#faf9fe] px-5 py-8 text-center text-sm text-[#797587]">No affiliate links yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#ece8f6]">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[#ece8f6] bg-[#faf9fe] text-xs font-semibold uppercase tracking-wide text-[#797587]">
                <th className="px-4 py-3 text-left">Name / Code</th>
                <th className="px-4 py-3 text-left">Destination</th>
                <th className="px-4 py-3 text-left">Payout</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f0f9]">
              {links.map((lnk) => (
                <tr key={lnk.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1c1a24]">{lnk.name}</p>
                    <p className="font-mono text-xs text-[#5b3cdd]">{lnk.code}</p>
                    {lnk.campaignName && <p className="text-[11px] text-[#b0acba]">{lnk.campaignName}</p>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#484555]">{lnk.destinationPath || "/"}</td>
                  <td className="px-4 py-3 text-xs text-[#484555]">
                    {lnk.payoutType === "PERCENTAGE" ? `${lnk.payoutAmount}%` : usd(lnk.payoutAmount)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#1c1a24]">{lnk.clickCount}</td>
                  <td className="px-4 py-3">
                    <Badge label={lnk.isActive ? "Active" : "Inactive"} color={lnk.isActive ? "green" : "gray"} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {lnk.link && (
                        <Btn v="ghost" onClick={() => copyUrl(lnk.id, lnk.link)}>
                          {copied === lnk.id ? "Copied!" : "Copy URL"}
                        </Btn>
                      )}
                      <Btn v="ghost" disabled={busy[lnk.id]} onClick={() => toggleActive(lnk)}>
                        {lnk.isActive ? "Disable" : "Enable"}
                      </Btn>
                      <Btn v="danger" disabled={busy[lnk.id]} onClick={() => deleteLink(lnk.id)}>Delete</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Rewards Tab ─────────────────────────────────────────────────────────────

function RewardsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState({});
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("PENDING");

  async function load(status) {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/admin/affiliate-rewards?status=${status}`, { credentials: "same-origin" });
      const data = await res.json().catch(() => ({}));
      setItems(Array.isArray(data.rewards) ? data.rewards : []);
    } catch { setError("Failed to load rewards."); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(filter); }, [filter]); // eslint-disable-line

  async function act(id, action) {
    setBusy((p) => ({ ...p, [id]: true })); setError("");
    try {
      const res = await fetch("/api/admin/affiliate-rewards", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Action failed");
      load(filter);
    } catch (err) { setError(err.message); }
    finally { setBusy((p) => ({ ...p, [id]: false })); }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1c1a24]">Reward Ledger</h2>
          <p className="text-sm text-[#484555]">Approve and pay affiliate commissions.</p>
        </div>
        <FilterBar options={["PENDING", "APPROVED", "PAID", "REJECTED"]} active={filter} onChange={setFilter} />
      </div>
      <Err msg={error} />
      {loading ? (
        <p className="py-6 text-sm text-[#484555]">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-[#faf9fe] px-5 py-8 text-center text-sm text-[#797587]">
          No {filter.toLowerCase()} rewards.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#ece8f6]">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[#ece8f6] bg-[#faf9fe] text-xs font-semibold uppercase tracking-wide text-[#797587]">
                <th className="px-4 py-3 text-left">Affiliate</th>
                <th className="px-4 py-3 text-left">Referred</th>
                <th className="px-4 py-3 text-left">Link</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f0f9]">
              {items.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-[#1c1a24]">{r.user?.name || r.user?.email || "—"}</td>
                  <td className="px-4 py-3 text-xs text-[#484555]">{r.referral?.referredUser?.email || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#5b3cdd]">{r.referral?.link?.code || "—"}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#1c1a24]">{usd(r.rewardAmount)}</td>
                  <td className="px-4 py-3"><Badge label={r.status} color={REWARD_STATUS_COLOR[r.status]} /></td>
                  <td className="px-4 py-3 text-xs text-[#797587]">{fmt(r.paidAt || r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {r.status === "PENDING" && (
                        <Btn v="blue" disabled={busy[r.id]} onClick={() => act(r.id, "approve")}>
                          {busy[r.id] ? "…" : "Approve"}
                        </Btn>
                      )}
                      {r.status === "APPROVED" && (
                        <Btn v="green" disabled={busy[r.id]} onClick={() => act(r.id, "pay")}>
                          {busy[r.id] ? "…" : "Mark paid"}
                        </Btn>
                      )}
                      {(r.status === "PENDING" || r.status === "APPROVED") && (
                        <Btn v="danger" disabled={busy[r.id]} onClick={() => act(r.id, "reject")}>Reject</Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "applications", label: "Applications", icon: "inbox" },
  { id: "links", label: "Links", icon: "link" },
  { id: "rewards", label: "Rewards", icon: "payments" },
];

export default function AffiliatePartnersPage() {
  const [tab, setTab] = useState("applications");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f1ecf9]">
          <AppIcon name="group_add" className="h-5 w-5 text-[#5b3cdd]" />
        </div>
        <div>
          <h1 className="font-headline text-2xl font-bold text-[#1c1a24]">Affiliate Partners</h1>
          <p className="text-sm text-[#484555]">Manage applications, links, and reward payouts.</p>
        </div>
      </div>

      <div className="border-b border-[#ece8f6]">
        <nav className="flex gap-1">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.id ? "border-[#5b3cdd] text-[#5b3cdd]" : "border-transparent text-[#797587] hover:text-[#484555]"
              }`}
            >
              <AppIcon name={t.icon} className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-[1.75rem] border border-[#c9c4d8]/20 bg-white p-6 shadow-sm">
        {tab === "applications" && <ApplicationsTab />}
        {tab === "links" && <LinksTab />}
        {tab === "rewards" && <RewardsTab />}
      </div>
    </div>
  );
}
