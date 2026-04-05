"use client";

import { useEffect, useMemo, useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

const DEFAULT_PAYOUT = 35;

function buildInitialForm() {
  return {
    name: "",
    code: "",
    destinationPath: "/",
    payoutAmount: DEFAULT_PAYOUT,
    notes: "",
  };
}

export default function AffiliateProgramManager() {
  const [affiliates, setAffiliates] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsersByAffiliate, setSelectedUsersByAffiliate] = useState({});
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(buildInitialForm());

  const usersById = useMemo(() => {
    const map = new Map();
    users.forEach((entry) => map.set(entry.id, entry));
    return map;
  }, [users]);

  const matchedUsersForName = useMemo(() => {
    const query = String(form.name || "")
      .trim()
      .toLowerCase();

    if (!query) {
      return [];
    }

    const byName = users.filter((user) =>
      String(user?.name || "")
        .toLowerCase()
        .includes(query),
    );
    const fallbackByEmail = users.filter((user) => {
      const email = String(user?.email || "").toLowerCase();
      return email.includes(query);
    });

    const combined = [...byName, ...fallbackByEmail];
    const deduped = [];
    const seen = new Set();

    combined.forEach((user) => {
      if (!user?.id || seen.has(user.id)) {
        return;
      }

      seen.add(user.id);
      deduped.push(user);
    });

    return deduped.slice(0, 12);
  }, [form.name, users]);

  async function loadProgram() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/affiliate-links", {
        credentials: "same-origin",
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || "Could not load affiliate program");
      }

      setAffiliates(
        Array.isArray(payload.affiliates) ? payload.affiliates : [],
      );
      setUsers(Array.isArray(payload.users) ? payload.users : []);
    } catch (loadError) {
      setError(loadError?.message || "Failed to load affiliate program");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProgram();
  }, []);

  async function createNewAffiliate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/affiliate-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Failed to create affiliate");
      }

      setAffiliates((prev) => [payload.affiliate, ...prev]);
      setForm(buildInitialForm());
    } catch (saveError) {
      setError(saveError?.message || "Failed to create affiliate");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(affiliate) {
    const nextActive = !affiliate.isActive;

    const response = await fetch("/api/admin/affiliate-links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        id: affiliate.id,
        patch: { isActive: nextActive },
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || "Failed to update affiliate");
    }

    setAffiliates((prev) =>
      prev.map((item) => (item.id === affiliate.id ? payload.affiliate : item)),
    );
  }

  async function assignUser(affiliateId, userId) {
    const affiliate = affiliates.find((entry) => entry.id === affiliateId);
    if (!affiliate) return;

    const nextUserIds = Array.from(
      new Set([...(affiliate.userIds || []), userId]),
    );

    const response = await fetch("/api/admin/affiliate-links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        id: affiliateId,
        patch: { userIds: nextUserIds },
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || "Failed to assign user");
    }

    setAffiliates((prev) =>
      prev.map((item) => (item.id === affiliateId ? payload.affiliate : item)),
    );
  }

  async function removeUser(affiliateId, userId) {
    const affiliate = affiliates.find((entry) => entry.id === affiliateId);
    if (!affiliate) return;

    const nextUserIds = (affiliate.userIds || []).filter(
      (entry) => entry !== userId,
    );

    const response = await fetch("/api/admin/affiliate-links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        id: affiliateId,
        patch: { userIds: nextUserIds },
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || "Failed to remove user");
    }

    setAffiliates((prev) =>
      prev.map((item) => (item.id === affiliateId ? payload.affiliate : item)),
    );
  }

  async function removeAffiliate(affiliateId) {
    const response = await fetch("/api/admin/affiliate-links", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ id: affiliateId }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || "Failed to delete affiliate");
    }

    setAffiliates((prev) => prev.filter((item) => item.id !== affiliateId));
  }

  return (
    <section className="rounded-[1.75rem] border border-[#c9c4d8]/20 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-headline text-xl font-bold text-[#1c1a24]">
            Affiliate links and user management
          </h2>
          <p className="text-sm text-[#484555]">
            Create and manage affiliate links, map users, and set default payout
            at $35.
          </p>
        </div>
        <button
          type="button"
          onClick={loadProgram}
          className="inline-flex items-center gap-2 rounded-full border border-[#d7d1e4] bg-[#fbf9ff] px-4 py-2 text-sm font-semibold text-[#1c1a24]"
        >
          <AppIcon name="refresh" className="h-4 w-4 text-[#5b3cdd]" />
          Refresh
        </button>
      </div>

      <form
        onSubmit={createNewAffiliate}
        className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-5"
      >
        <div className="relative">
          <input
            required
            value={form.name}
            onFocus={() => setShowNameSuggestions(true)}
            onBlur={() => {
              setTimeout(() => {
                setShowNameSuggestions(false);
              }, 120);
            }}
            onChange={(event) => {
              const nextValue = event.target.value;
              setForm((prev) => ({ ...prev, name: nextValue }));
              setShowNameSuggestions(Boolean(nextValue.trim()));
            }}
            placeholder="Affiliate name"
            className="w-full rounded-xl border border-[#d7d1e4] px-3 py-2 text-sm"
          />

          {showNameSuggestions && matchedUsersForName.length > 0 ? (
            <div className="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#d7d1e4] bg-white p-1 shadow-lg">
              {matchedUsersForName.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      name: String(user.name || user.email || "").trim(),
                    }));
                    setShowNameSuggestions(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f6f2ff]"
                >
                  <span className="font-medium text-[#1c1a24]">
                    {user.name || "Unnamed user"}
                  </span>
                  <span className="ml-3 truncate text-xs text-[#797587]">
                    {user.email}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <input
          required
          value={form.code}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, code: event.target.value }))
          }
          placeholder="affiliate-code"
          className="rounded-xl border border-[#d7d1e4] px-3 py-2 text-sm"
        />
        <input
          value={form.destinationPath}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              destinationPath: event.target.value,
            }))
          }
          placeholder="/funnels/glp-1-eligibility"
          className="rounded-xl border border-[#d7d1e4] px-3 py-2 text-sm"
        />
        <input
          type="number"
          min={1}
          value={form.payoutAmount}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              payoutAmount: Number(event.target.value) || 0,
            }))
          }
          className="rounded-xl border border-[#d7d1e4] px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl hs-gradient-btn px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create affiliate"}
        </button>
      </form>

      <textarea
        value={form.notes}
        onChange={(event) =>
          setForm((prev) => ({ ...prev, notes: event.target.value }))
        }
        placeholder="Notes"
        className="mt-3 min-h-[74px] w-full rounded-xl border border-[#d7d1e4] px-3 py-2 text-sm"
      />

      {error ? (
        <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-5 text-sm text-[#484555]">
          Loading affiliate program...
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {affiliates.length === 0 ? (
            <p className="rounded-xl bg-[#fbfbfd] px-4 py-4 text-sm text-[#484555]">
              No affiliate links created yet.
            </p>
          ) : (
            affiliates.map((affiliate) => {
              const availableUsers = users.filter(
                (entry) => !(affiliate.userIds || []).includes(entry.id),
              );

              return (
                <article
                  key={affiliate.id}
                  className="rounded-[1.1rem] border border-[#ece8f6] bg-[#fbfbfd] p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#1c1a24]">
                        {affiliate.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#797587]">
                        code: {affiliate.code}
                      </p>
                      <a
                        href={affiliate.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block break-all text-xs text-[#5b3cdd] underline"
                      >
                        {affiliate.link}
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await toggleActive(affiliate);
                          } catch (toggleError) {
                            setError(
                              toggleError?.message ||
                                "Failed to update affiliate",
                            );
                          }
                        }}
                        className="rounded-full border border-[#d7d1e4] bg-white px-3 py-1.5 text-xs font-semibold"
                      >
                        {affiliate.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await removeAffiliate(affiliate.id);
                          } catch (removeError) {
                            setError(
                              removeError?.message ||
                                "Failed to delete affiliate",
                            );
                          }
                        }}
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-[#484555] md:grid-cols-3">
                    <p>
                      Payout:{" "}
                      <span className="font-semibold text-[#1c1a24]">
                        ${affiliate.payoutAmount}
                      </span>
                    </p>
                    <p>
                      Destination:{" "}
                      <span className="font-semibold text-[#1c1a24]">
                        {affiliate.destinationPath}
                      </span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-semibold text-[#1c1a24]">
                        {affiliate.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>

                  {(affiliate.notes || "").trim() ? (
                    <p className="mt-2 text-xs text-[#484555]">
                      {affiliate.notes}
                    </p>
                  ) : null}

                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#797587]">
                      Assigned users
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(affiliate.userIds || []).length > 0 ? (
                        affiliate.userIds.map((userId) => {
                          const user = usersById.get(userId);
                          return (
                            <span
                              key={userId}
                              className="inline-flex items-center gap-2 rounded-full border border-[#d7d1e4] bg-white px-3 py-1 text-xs"
                            >
                              {user?.email || userId}
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await removeUser(affiliate.id, userId);
                                  } catch (removeUserError) {
                                    setError(
                                      removeUserError?.message ||
                                        "Failed to remove user",
                                    );
                                  }
                                }}
                                className="text-rose-600"
                              >
                                remove
                              </button>
                            </span>
                          );
                        })
                      ) : (
                        <p className="text-xs text-[#797587]">
                          No users assigned yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableUsers.slice(0, 12).map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={async () => {
                          try {
                            await assignUser(affiliate.id, user.id);
                          } catch (assignError) {
                            setError(
                              assignError?.message || "Failed to assign user",
                            );
                          }
                        }}
                        className="rounded-full border border-[#d7d1e4] bg-white px-3 py-1 text-xs"
                      >
                        + {user.email}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
                    <select
                      value={selectedUsersByAffiliate[affiliate.id] || ""}
                      onChange={(event) =>
                        setSelectedUsersByAffiliate((prev) => ({
                          ...prev,
                          [affiliate.id]: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#d7d1e4] bg-white px-3 py-2 text-sm md:max-w-sm"
                    >
                      <option value="">Select user to assign</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!selectedUsersByAffiliate[affiliate.id]}
                      onClick={async () => {
                        const selectedUserId =
                          selectedUsersByAffiliate[affiliate.id];
                        if (!selectedUserId) {
                          return;
                        }

                        try {
                          await assignUser(affiliate.id, selectedUserId);
                          setSelectedUsersByAffiliate((prev) => ({
                            ...prev,
                            [affiliate.id]: "",
                          }));
                        } catch (assignError) {
                          setError(
                            assignError?.message || "Failed to assign user",
                          );
                        }
                      }}
                      className="rounded-xl border border-[#d7d1e4] bg-white px-4 py-2 text-sm font-semibold text-[#1c1a24] disabled:opacity-50"
                    >
                      Assign user
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
