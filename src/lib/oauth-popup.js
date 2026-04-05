"use client";

export function parseOAuthPopupPayload(data) {
  if (!data) {
    return null;
  }

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  if (typeof data === "object") {
    return data;
  }

  return null;
}
