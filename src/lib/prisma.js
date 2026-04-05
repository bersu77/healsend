import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient();
}

function isStaleDevClient(client) {
  if (!client) return true;

  // In dev, hot reload can keep an older generated Prisma client instance
  // alive in global state after schema changes. When that happens, newly added
  // model delegates such as mdiCaseSnapshot are undefined until the server is
  // restarted. Detect that and recreate the client automatically.
  return typeof client.mdiCaseSnapshot === "undefined";
}

const cachedClient = globalForPrisma.prisma;

export const prisma =
  process.env.NODE_ENV !== "production" && isStaleDevClient(cachedClient)
    ? createPrismaClient()
    : cachedClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
