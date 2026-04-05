import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "crypto";

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(salt + password)
    .digest("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@healsend.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const name = process.env.ADMIN_NAME || "Admin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    if (existing.role !== "ADMIN") {
      await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" },
      });
      console.log("  → Updated role to ADMIN");
    }
    return;
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name,
      role: "ADMIN",
    },
  });

  console.log(`Admin user created:`);
  console.log(`  Email: ${email}`);
  console.log(`  ID: ${user.id}`);
  console.log(`\nYou can now log in at /login`);
}

main()
  .catch((e) => {
    console.error("Failed to seed admin:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
