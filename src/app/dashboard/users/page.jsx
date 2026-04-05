"use client";

import React, { useState, useEffect } from "react";
import AppIcon from "@/components/ui/AppIcon";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    params.set("page", page.toString());
    params.set("limit", "20");

    const res = await fetch(`/api/admin/users?${params.toString()}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold text-[#1c1a24]">
          Users ({total})
        </h2>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-[#5b3cdd] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a2fc7] transition-colors flex items-center gap-2"
        >
          <AppIcon name="person_add" className="h-[18px] w-[18px]" />
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="flex-1 max-w-sm px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            fetchUsers();
          }}
        />
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#c9c4d8]/20 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#c9c4d8]/10 bg-gray-50">
              <th className="text-left px-6 py-3 font-semibold text-[#484555]">
                User
              </th>
              <th className="text-left px-6 py-3 font-semibold text-[#484555]">
                Role
              </th>
              <th className="text-left px-6 py-3 font-semibold text-[#484555]">
                Orders
              </th>
              <th className="text-left px-6 py-3 font-semibold text-[#484555]">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-[#484555]"
                >
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-[#484555]"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[#c9c4d8]/10 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[#1c1a24]">
                        {u.name || "—"}
                      </p>
                      <p className="text-xs text-[#484555]">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        u.role === "ADMIN"
                          ? "bg-[#e5deff] text-[#5b3cdd]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#484555]">
                    {u._count?.orders || 0}
                  </td>
                  <td className="px-6 py-4 text-[#484555]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-sm text-[#484555]">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 border border-gray-200 rounded text-sm disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create user");
        setSaving(false);
        return;
      }
      onCreated();
    } catch {
      setError("Something went wrong");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="font-headline text-lg font-bold text-[#1c1a24] mb-4">
          Create User
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#484555] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#484555] mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#484555] mb-1">
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#484555] mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b3cdd]"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#5b3cdd] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a2fc7] disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create User"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
