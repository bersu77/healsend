import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// Hash password using SHA-256 with salt
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
  return `${salt}:${hash}`;
}

function isLocalSaltedHash(stored) {
  return (
    typeof stored === "string" &&
    stored.includes(":") &&
    stored.split(":").length === 2
  );
}

function verifyLocalSaltedPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const check = crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
  return check === hash;
}

function isWordPressBcryptHash(stored) {
  return typeof stored === "string" && stored.startsWith("$wp$2y$");
}

function normalizeWordPressBcryptHash(stored) {
  return stored.replace(/^\$wp\$/, "$").replace(/^\$2y\$/, "$2b$");
}

export async function verifyPassword(password, stored) {
  if (!stored) {
    return {
      valid: false,
      upgradedHash: null,
    };
  }

  if (isLocalSaltedHash(stored)) {
    return {
      valid: verifyLocalSaltedPassword(password, stored),
      upgradedHash: null,
    };
  }

  if (isWordPressBcryptHash(stored)) {
    const valid = await bcrypt.compare(
      password,
      normalizeWordPressBcryptHash(stored),
    );

    return {
      valid,
      upgradedHash: valid ? hashPassword(password) : null,
    };
  }

  return {
    valid: false,
    upgradedHash: null,
  };
}

// Generate a secure session token
export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Get current user from session cookie
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}

// Require a specific role (or just authentication)
export async function requireAuth(role = null) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }
  if (role && user.role !== role) {
    return { error: "Forbidden", status: 403 };
  }
  return { user };
}
