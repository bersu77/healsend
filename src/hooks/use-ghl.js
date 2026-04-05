"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Fetch GHL contacts list.
 * @param {{ query?: string, limit?: number }} options
 */
export function useGhlContacts({ query, limit } = {}) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();

  return useQuery({
    queryKey: ["ghl-contacts", query, limit],
    queryFn: async () => {
      const res = await fetch(`/api/ghl/contacts/list${qs ? `?${qs}` : ""}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to fetch contacts");
      }
      return res.json();
    },
  });
}

/**
 * Create a GHL contact.
 * Returns a mutation you can call with { firstName, lastName, email, phone, tags }.
 */
export function useCreateGhlContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactData) => {
      const res = await fetch("/api/ghl/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create contact");
      }
      return res.json();
    },
    onSuccess: () => {
      // Refetch contacts list after creating a new one
      queryClient.invalidateQueries({ queryKey: ["ghl-contacts"] });
    },
  });
}

/**
 * Add a tag to a GHL contact.
 * Call with { contactId, tag }.
 */
export function useAddGhlTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contactId, tag }) => {
      const res = await fetch("/api/ghl/contacts/tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId, tag }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to add tag");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ghl-contacts"] });
    },
  });
}
