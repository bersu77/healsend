/**
 * GoHighLevel API Client
 *
 * Reusable server-side client for GHL REST API v1.
 * All calls use the API key from process.env.GHL_API_KEY.
 * NEVER import this file from client-side code.
 */

const GHL_BASE_URL = "https://rest.gohighlevel.com/v1";

function getApiKey() {
  const key = process.env.GHL_API_KEY;
  if (!key) {
    throw new Error("GHL_API_KEY environment variable is not set");
  }
  return key;
}

/**
 * Make an authenticated request to the GHL API.
 * @param {string} endpoint - API path (e.g. "/contacts")
 * @param {object} options
 * @param {"GET"|"POST"|"PUT"|"DELETE"} [options.method="GET"]
 * @param {object} [options.body] - JSON body for POST/PUT
 * @param {Record<string,string>} [options.params] - URL query params for GET
 * @returns {Promise<{ok: boolean, data?: any, error?: string, status: number}>}
 */
export async function ghlRequest(
  endpoint,
  { method = "GET", body, params } = {},
) {
  const apiKey = getApiKey();

  let url = `${GHL_BASE_URL}${endpoint}`;

  // Append query params for GET requests
  if (params && Object.keys(params).length > 0) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const fetchOptions = { method, headers };

  if (body && (method === "POST" || method === "PUT")) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error:
          data?.message || data?.msg || `GHL API error: ${response.status}`,
      };
    }

    return { ok: true, status: response.status, data };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: `GHL request failed: ${err.message}`,
    };
  }
}

// ─── Convenience helpers ─────────────────────────────────────

/** Create a contact in GHL */
export async function createGhlContact({
  firstName,
  lastName,
  email,
  phone,
  dateOfBirth,
  tags,
}) {
  return ghlRequest("/contacts/", {
    method: "POST",
    body: { firstName, lastName, email, phone, dateOfBirth, tags },
  });
}

/** Get a single contact by ID */
export async function getGhlContact(contactId) {
  return ghlRequest(`/contacts/${contactId}`);
}

/** List contacts (with optional query/limit) */
export async function listGhlContacts({ query, limit = 20 } = {}) {
  const params = { limit: String(limit) };
  if (query) params.query = query;
  return ghlRequest("/contacts/", { params });
}

/** Add a tag to a contact */
export async function addTagToGhlContact(contactId, tag) {
  return ghlRequest(`/contacts/${contactId}/tags/`, {
    method: "POST",
    body: { tags: [tag] },
  });
}

/** Delete a contact */
export async function deleteGhlContact(contactId) {
  return ghlRequest(`/contacts/${contactId}`, { method: "DELETE" });
}

/** Send a questionnaire to a contact via chat */
export async function sendGhlQuestionnaire(contactId, questionnaireId) {
  return ghlRequest(`/contacts/${contactId}/send-questionnaire`, {
    method: "POST",
    body: { questionnaire_id: questionnaireId },
  });
}

/** Update a contact */
export async function updateGhlContact(contactId, data) {
  return ghlRequest(`/contacts/${contactId}`, {
    method: "PUT",
    body: data,
  });
}
