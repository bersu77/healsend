import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(STORE_DIR, "affiliate-program.json");

function normalizeAffiliateCode(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized;
}

async function ensureStoreFile() {
  await mkdir(STORE_DIR, { recursive: true });

  try {
    await readFile(STORE_PATH, "utf8");
  } catch {
    await writeFile(
      STORE_PATH,
      JSON.stringify({ affiliates: [] }, null, 2),
      "utf8",
    );
  }
}

async function readStore() {
  await ensureStoreFile();

  const raw = await readFile(STORE_PATH, "utf8");
  const parsed = JSON.parse(raw || "{}");

  return {
    affiliates: Array.isArray(parsed?.affiliates) ? parsed.affiliates : [],
  };
}

async function writeStore(store) {
  await ensureStoreFile();
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function listAffiliates() {
  const store = await readStore();
  return store.affiliates;
}

export async function createAffiliate({
  name,
  code,
  payoutAmount = 35,
  destinationPath = "/",
  userIds = [],
  notes = "",
}) {
  const store = await readStore();
  const normalizedCode = normalizeAffiliateCode(code || name);

  if (!normalizedCode) {
    throw new Error("Affiliate code is required.");
  }

  const hasDuplicate = store.affiliates.some(
    (affiliate) => affiliate.code === normalizedCode,
  );

  if (hasDuplicate) {
    throw new Error("Affiliate code already exists.");
  }

  const now = new Date().toISOString();
  const nextAffiliate = {
    id: randomUUID(),
    name: String(name || "").trim() || normalizedCode,
    code: normalizedCode,
    payoutAmount: Number(payoutAmount) > 0 ? Number(payoutAmount) : 35,
    destinationPath: String(destinationPath || "/").trim() || "/",
    isActive: true,
    userIds: Array.isArray(userIds) ? userIds.filter(Boolean) : [],
    notes: String(notes || "").trim(),
    createdAt: now,
    updatedAt: now,
  };

  store.affiliates.unshift(nextAffiliate);
  await writeStore(store);

  return nextAffiliate;
}

export async function updateAffiliate({ id, patch }) {
  const store = await readStore();
  const index = store.affiliates.findIndex((affiliate) => affiliate.id === id);

  if (index < 0) {
    throw new Error("Affiliate not found.");
  }

  const current = store.affiliates[index];
  const nextCode =
    patch.code !== undefined
      ? normalizeAffiliateCode(patch.code)
      : current.code;

  if (!nextCode) {
    throw new Error("Affiliate code is required.");
  }

  const hasDuplicate = store.affiliates.some(
    (affiliate, affiliateIndex) =>
      affiliateIndex !== index && affiliate.code === nextCode,
  );

  if (hasDuplicate) {
    throw new Error("Affiliate code already exists.");
  }

  const next = {
    ...current,
    ...(patch.name !== undefined
      ? { name: String(patch.name || "").trim() || current.name }
      : {}),
    ...(patch.destinationPath !== undefined
      ? {
          destinationPath:
            String(patch.destinationPath || "").trim() ||
            current.destinationPath,
        }
      : {}),
    ...(patch.notes !== undefined
      ? { notes: String(patch.notes || "").trim() }
      : {}),
    ...(patch.payoutAmount !== undefined
      ? {
          payoutAmount:
            Number(patch.payoutAmount) > 0
              ? Number(patch.payoutAmount)
              : current.payoutAmount,
        }
      : {}),
    ...(patch.isActive !== undefined
      ? { isActive: Boolean(patch.isActive) }
      : {}),
    ...(patch.userIds !== undefined
      ? {
          userIds: Array.isArray(patch.userIds)
            ? patch.userIds.filter(Boolean)
            : current.userIds,
        }
      : {}),
    code: nextCode,
    updatedAt: new Date().toISOString(),
  };

  store.affiliates[index] = next;
  await writeStore(store);

  return next;
}

export async function deleteAffiliate(id) {
  const store = await readStore();
  const nextAffiliates = store.affiliates.filter(
    (affiliate) => affiliate.id !== id,
  );

  if (nextAffiliates.length === store.affiliates.length) {
    throw new Error("Affiliate not found.");
  }

  await writeStore({ affiliates: nextAffiliates });
}
