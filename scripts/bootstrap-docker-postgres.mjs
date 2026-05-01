#!/usr/bin/env node
/**
 * Starts Postgres via docker-compose.yml, waits for TCP, runs `prisma db push`,
 * then seeds onboarding templates against the local Docker DB (never uses
 * remote DATABASE_URL from `.env` for the seed — see `--with-local-docker`).
 *
 * Run:  npm run db:bootstrap:docker
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LOCAL_ENV_FILE = path.join(ROOT, "env", "local-docker.database.env");

const DEFAULT_DATABASE_URL =
  "postgresql://johndoe:randompassword@localhost:5433/mydb?schema=public";

function readDatabaseUrl() {
  if (!fs.existsSync(LOCAL_ENV_FILE)) {
    console.warn(
      `⚠️  Missing ${path.relative(ROOT, LOCAL_ENV_FILE)} — using default URL matching docker-compose.yml`,
    );
    return DEFAULT_DATABASE_URL;
  }
  const text = fs.readFileSync(LOCAL_ENV_FILE, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (key !== "DATABASE_URL") continue;
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    return val;
  }
  return DEFAULT_DATABASE_URL;
}

function run(cmd, args, envPatch = {}) {
  const env = { ...process.env, ...envPatch };
  const win = process.platform === "win32";
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    cwd: ROOT,
    env,
    shell: win && cmd === "npx",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function assertDockerDaemonRunning() {
  const r = spawnSync("docker", ["info"], {
    stdio: ["ignore", "pipe", "pipe"],
    cwd: ROOT,
    shell: process.platform === "win32",
  });
  if ((r.status ?? 1) === 0) return;

  console.error("❌ Cannot talk to Docker — is Docker Desktop (or the Docker engine) running?");
  console.error("");
  console.error(
    "  Windows: start Docker Desktop and wait until “Engine running”, then rerun:",
  );
  console.error("    npm run db:bootstrap:docker");
  console.error("");
  console.error("  Without Docker you can still materialize onboarding data into the repo:");
  console.error("    npm run seed:onboarding-templates:export");
  console.error("");
  console.error(
    "  Later, apply that snapshot to a Postgres URL (Docker or other), e.g.:",
  );
  console.error(
    "    npm run seed:onboarding-templates:apply-export -- --with-local-docker",
  );
  process.exit(1);
}

assertDockerDaemonRunning();

const databaseUrl = readDatabaseUrl();

console.log("🐘 Starting Postgres (Docker Compose)…\n");
run(process.execPath, ["scripts/docker-compose.mjs", "up", "-d", "postgres"]);

console.log("\n⏳ Waiting for Postgres…\n");
run(process.execPath, ["scripts/wait-for-postgres.mjs"], {
  DATABASE_URL: databaseUrl,
});

// --skip-generate avoids Windows EPERM when another process locks the query engine DLL
console.log("\n📦 prisma db push (skip client regen) …\n");
run("npx", ["prisma", "db", "push", "--skip-generate"], {
  DATABASE_URL: databaseUrl,
});

console.log("\n📦 prisma generate (optional; ignore EPERM if engine is in use) …\n");
const gen = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  cwd: ROOT,
  env: process.env,
  shell: process.platform === "win32",
});
if ((gen.status ?? 1) !== 0) {
  console.warn(
    "\n⚠️  prisma generate reported an error (common on Windows if the engine file is locked).",
  );
  console.warn("   If `next dev` is running, restart it after a successful generate.\n");
}

console.log("\n🌱 Seeding onboarding templates …\n");
run(
  process.execPath,
  [
    path.join(ROOT, "scripts", "seed-onboarding-templates.mjs"),
    "--with-local-docker",
  ],
);

console.log(
  "\n✅ Done. Postgres container is running, schema is synced, onboarding templates seeded.",
);
