/**
 * import-live-snapshot.mjs
 *
 * Safely imports data from prod-envs/live-db-snapshot.json into the local dev DB.
 * Uses upsert everywhere — safe to run multiple times, never deletes existing rows.
 *
 * Usage:
 *   node scripts/import-live-snapshot.mjs
 *   node scripts/import-live-snapshot.mjs --dry-run   (prints counts only)
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SNAPSHOT_PATH = resolve(__dirname, "../prod-envs/live-db-snapshot.json");
const DRY_RUN = process.argv.includes("--dry-run");

const prisma = new PrismaClient({ log: ["warn", "error"] });

// ── Helpers ────────────────────────────────────────────────────────────────────

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function toFloat(value) {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

function toInt(value) {
  const n = parseInt(value, 10);
  return isNaN(n) ? 0 : n;
}

function log(msg) {
  process.stdout.write(msg + "\n");
}

function section(title) {
  log(`\n${"─".repeat(58)}`);
  log(`  ${title}`);
  log("─".repeat(58));
}

// ── Import functions ───────────────────────────────────────────────────────────

async function importUsers(rows) {
  section(`Users (${rows.length})`);
  let created = 0,
    updated = 0,
    skipped = 0;

  for (const row of rows) {
    try {
      const result = await prisma.user.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          email: row.email,
          passwordHash: null, // Never import passwords
          name: row.name || null,
          phone: row.phone || null,
          role: row.role || "CUSTOMER",
          stripeCustomerId: row.stripeCustomerId || null,
          authProvider: row.authProvider || null,
          mdiPatientStatus: row.mdiPatientStatus || null,
          mdiLastSyncedAt: toDate(row.mdiLastSyncedAt),
          createdAt: toDate(row.createdAt) || new Date(),
        },
        update: {
          name: row.name || undefined,
          phone: row.phone || undefined,
          stripeCustomerId: row.stripeCustomerId || undefined,
          mdiPatientStatus: row.mdiPatientStatus || undefined,
          mdiLastSyncedAt: toDate(row.mdiLastSyncedAt) || undefined,
        },
      });
      if (
        result.createdAt?.getTime() ===
        (toDate(row.createdAt) || new Date()).getTime()
      ) {
        created++;
      } else {
        updated++;
      }
    } catch (e) {
      // Skip duplicate email conflicts (same email, different id)
      if (e.code === "P2002") {
        skipped++;
      } else {
        log(`  WARN user ${row.email}: ${e.message}`);
        skipped++;
      }
    }
  }

  log(`  created=${created} updated=${updated} skipped=${skipped}`);
}

async function importAddresses(rows) {
  section(`Addresses (${rows.length})`);
  let ok = 0,
    skip = 0;

  for (const row of rows) {
    // Only import if the referenced user exists locally
    const userExists = await prisma.user.findUnique({
      where: { id: row.userId },
      select: { id: true },
    });
    if (!userExists) {
      skip++;
      continue;
    }
    try {
      await prisma.address.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          userId: row.userId,
          line1: row.line1 || "",
          line2: row.line2 || null,
          city: row.city || "",
          state: row.state || "",
          zip: row.zip || "",
          country: row.country || "US",
          isDefault: row.isDefault ?? false,
        },
        update: {
          line1: row.line1 || undefined,
          city: row.city || undefined,
          state: row.state || undefined,
          zip: row.zip || undefined,
          isDefault: row.isDefault ?? undefined,
        },
      });
      ok++;
    } catch (e) {
      log(`  WARN address ${row.id}: ${e.message}`);
      skip++;
    }
  }
  log(`  ok=${ok} skipped=${skip}`);
}

async function importProducts(rows) {
  section(`Products (${rows.length})`);
  let ok = 0,
    skip = 0;

  for (const row of rows) {
    try {
      await prisma.product.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          sku: row.sku || null,
          name: row.name,
          slug: row.slug,
          type: row.type || "SIMPLE",
          published: row.published ?? true,
          featured: row.featured ?? false,
          shortDescription: row.shortDescription || null,
          description: null,
          regularPrice: toFloat(row.regularPrice),
          salePrice: row.salePrice != null ? toFloat(row.salePrice) : null,
          inStock: row.inStock ?? true,
          images: [],
          stripeProductId: row.stripeProductId || null,
          tags: row.tags || [],
          subscriptionTiers: row.subscriptionTiers || null,
          priority: toInt(row.priority),
        },
        update: {
          name: row.name,
          published: row.published ?? undefined,
          regularPrice: toFloat(row.regularPrice),
          salePrice: row.salePrice != null ? toFloat(row.salePrice) : undefined,
          subscriptionTiers: row.subscriptionTiers || undefined,
          stripeProductId: row.stripeProductId || undefined,
          tags: row.tags || undefined,
          priority: toInt(row.priority),
        },
      });
      ok++;
    } catch (e) {
      // Slug conflict: different id, same slug
      if (e.code === "P2002") {
        skip++;
      } else {
        log(`  WARN product ${row.name}: ${e.message}`);
        skip++;
      }
    }
  }
  log(`  ok=${ok} skipped=${skip}`);
}

async function importProductVariants(rows) {
  section(`Product Variants (${rows.length})`);
  let ok = 0,
    skip = 0;

  for (const row of rows) {
    const productExists = await prisma.product.findUnique({
      where: { id: row.productId },
      select: { id: true },
    });
    if (!productExists) {
      skip++;
      continue;
    }
    try {
      await prisma.productVariant.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          productId: row.productId,
          name: row.name,
          sku: row.sku || null,
          price: toFloat(row.price),
          salePrice: row.salePrice != null ? toFloat(row.salePrice) : null,
          stripePriceId: row.stripePriceId || null,
          attributes: row.attributes || null,
          inStock: row.inStock ?? true,
          stock: row.stock != null ? toInt(row.stock) : null,
        },
        update: {
          name: row.name,
          price: toFloat(row.price),
          salePrice: row.salePrice != null ? toFloat(row.salePrice) : undefined,
          stripePriceId: row.stripePriceId || undefined,
          inStock: row.inStock ?? undefined,
        },
      });
      ok++;
    } catch (e) {
      log(`  WARN variant ${row.id}: ${e.message}`);
      skip++;
    }
  }
  log(`  ok=${ok} skipped=${skip}`);
}

async function importOrders(rows) {
  section(`Orders (${rows.length})`);
  let ok = 0,
    skip = 0;

  for (const row of rows) {
    const userExists = await prisma.user.findUnique({
      where: { id: row.userId },
      select: { id: true },
    });
    if (!userExists) {
      skip++;
      continue;
    }

    try {
      await prisma.order.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          orderNumber: row.orderNumber || row.id,
          userId: row.userId,
          status: row.status || "PENDING",
          subtotal: toFloat(row.subtotal),
          tax: toFloat(row.tax),
          shipping: toFloat(row.shipping),
          discount: toFloat(row.discount),
          total: toFloat(row.total),
          mdiOrderId: row.mdiOrderId || null,
          mdiCaseId: row.mdiCaseId || null,
          mdiWorkflowPhase: row.mdiWorkflowPhase || null,
          mdiOrderStatus: row.mdiOrderStatus || null,
          consultationStatus: row.consultationStatus || null,
          stripePaymentStatus: row.stripePaymentStatus || null,
          fulfillmentBlockedReason: row.fulfillmentBlockedReason || null,
          notes: row.notes || null,
          createdAt: toDate(row.createdAt) || new Date(),
        },
        update: {
          status: row.status || undefined,
          mdiOrderId: row.mdiOrderId || undefined,
          mdiCaseId: row.mdiCaseId || undefined,
          mdiWorkflowPhase: row.mdiWorkflowPhase || undefined,
          consultationStatus: row.consultationStatus || undefined,
          stripePaymentStatus: row.stripePaymentStatus || undefined,
        },
      });
      ok++;
    } catch (e) {
      if (e.code === "P2002") {
        skip++;
      } else {
        log(`  WARN order ${row.id}: ${e.message}`);
        skip++;
      }
    }
  }
  log(`  ok=${ok} skipped=${skip}`);
}

async function importOrderItems(rows) {
  section(`Order Items (${rows.length})`);
  let ok = 0,
    skip = 0;

  for (const row of rows) {
    const orderExists = await prisma.order.findUnique({
      where: { id: row.orderId },
      select: { id: true },
    });
    if (!orderExists) {
      skip++;
      continue;
    }

    // Check if product/variant exist (optional FK)
    const productId = row.productId
      ? (
          await prisma.product.findUnique({
            where: { id: row.productId },
            select: { id: true },
          })
        )?.id || null
      : null;
    const variantId = row.variantId
      ? (
          await prisma.productVariant.findUnique({
            where: { id: row.variantId },
            select: { id: true },
          })
        )?.id || null
      : null;

    try {
      await prisma.orderItem.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          orderId: row.orderId,
          productId: productId,
          variantId: variantId,
          name: row.name || "Product",
          price: toFloat(row.price),
          quantity: toInt(row.quantity) || 1,
          metadata: null,
        },
        update: {
          name: row.name || undefined,
          price: toFloat(row.price),
        },
      });
      ok++;
    } catch (e) {
      log(`  WARN orderItem ${row.id}: ${e.message}`);
      skip++;
    }
  }
  log(`  ok=${ok} skipped=${skip}`);
}

async function importPaymentMethods(rows) {
  section(`Payment Methods (${rows.length})`);
  let ok = 0,
    skip = 0;

  for (const row of rows) {
    const userExists = await prisma.user.findUnique({
      where: { id: row.userId },
      select: { id: true },
    });
    if (!userExists) {
      skip++;
      continue;
    }

    try {
      await prisma.paymentMethod.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          userId: row.userId,
          stripePaymentMethodId:
            row.stripePaymentMethodId || `pm_import_${row.id}`,
          brand: row.brand || null,
          last4: row.last4 || null,
          expMonth: row.expMonth != null ? toInt(row.expMonth) : null,
          expYear: row.expYear != null ? toInt(row.expYear) : null,
          isDefault: row.isDefault ?? false,
          createdAt: toDate(row.createdAt) || new Date(),
        },
        update: {
          brand: row.brand || undefined,
          last4: row.last4 || undefined,
          isDefault: row.isDefault ?? undefined,
        },
      });
      ok++;
    } catch (e) {
      log(`  WARN paymentMethod ${row.id}: ${e.message}`);
      skip++;
    }
  }
  log(`  ok=${ok} skipped=${skip}`);
}

async function importSubscriptions(rows) {
  section(`Subscriptions (${rows.length})`);
  let ok = 0,
    skip = 0;

  const validStatuses = [
    "ACTIVE",
    "TRIALING",
    "PAST_DUE",
    "CANCELED",
    "EXPIRED",
  ];

  for (const row of rows) {
    const userExists = await prisma.user.findUnique({
      where: { id: row.userId },
      select: { id: true },
    });
    if (!userExists) {
      skip++;
      continue;
    }

    const status = validStatuses.includes(row.status) ? row.status : "ACTIVE";

    try {
      await prisma.subscription.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          userId: row.userId,
          stripeSubscriptionId: row.stripeSubscriptionId || null,
          planName: row.planName || "Plan",
          status,
          amount: toFloat(row.amount),
          currency: row.currency || "USD",
          interval: row.interval || "month",
          intervalCount: toInt(row.intervalCount) || 1,
          startDate: toDate(row.startDate) || new Date(),
          nextBillingDate: toDate(row.nextBillingDate),
          endDate: toDate(row.endDate),
          cancelAtPeriodEnd: row.cancelAtPeriodEnd ?? false,
          createdAt: toDate(row.createdAt) || new Date(),
        },
        update: {
          status,
          amount: toFloat(row.amount),
          nextBillingDate: toDate(row.nextBillingDate) || undefined,
          cancelAtPeriodEnd: row.cancelAtPeriodEnd ?? undefined,
        },
      });
      ok++;
    } catch (e) {
      if (e.code === "P2002") {
        skip++;
      } else {
        log(`  WARN subscription ${row.id}: ${e.message}`);
        skip++;
      }
    }
  }
  log(`  ok=${ok} skipped=${skip}`);
}

async function importOnboardingTemplates(rows) {
  section(`Onboarding Templates (${rows.length})`);
  let ok = 0,
    skip = 0;

  for (const row of rows) {
    try {
      await prisma.onboardingTemplate.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description || null,
          active: row.active ?? true,
          createdAt: toDate(row.createdAt) || new Date(),
        },
        update: {
          name: row.name,
          description: row.description || undefined,
          active: row.active ?? undefined,
        },
      });
      ok++;
    } catch (e) {
      if (e.code === "P2002") {
        skip++;
      } else {
        log(`  WARN template ${row.name}: ${e.message}`);
        skip++;
      }
    }
  }
  log(`  ok=${ok} skipped=${skip}`);
}

async function importMarketingPages(rows) {
  section(`Marketing Pages (${rows.length})`);
  let ok = 0,
    skip = 0;

  const validPageTypes = ["HOME", "CATEGORY", "PRODUCT", "CUSTOM"];

  for (const row of rows) {
    const pageType = validPageTypes.includes(row.pageType)
      ? row.pageType
      : "CUSTOM";
    try {
      await prisma.marketingPage.upsert({
        where: { id: row.id },
        create: {
          id: row.id,
          slug: row.slug,
          title: row.title,
          pageType,
          source: row.source || "wordpress",
          excerpt: row.excerpt || null,
          seoTitle: row.seoTitle || null,
          seoDescription: row.seoDescription || null,
          createdAt: toDate(row.createdAt) || new Date(),
        },
        update: {
          title: row.title,
          seoTitle: row.seoTitle || undefined,
          seoDescription: row.seoDescription || undefined,
        },
      });
      ok++;
    } catch (e) {
      if (e.code === "P2002") {
        skip++;
      } else {
        log(`  WARN marketingPage ${row.slug}: ${e.message}`);
        skip++;
      }
    }
  }
  log(`  ok=${ok} skipped=${skip}`);
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  log("\n╔══════════════════════════════════════════════════════╗");
  log("║   HealSend Live Snapshot Importer                    ║");
  log("╚══════════════════════════════════════════════════════╝");
  log(`Mode: ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE IMPORT"}`);
  log(`Source: ${SNAPSHOT_PATH}`);

  const snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, "utf-8"));
  const meta = snapshot._meta;
  log(`\nSnapshot exported: ${meta?.exported_at}`);
  log(`Source: ${meta?.source}`);

  if (DRY_RUN) {
    log("\nDRY RUN — counts only:");
    for (const key of meta?.tables_included || []) {
      const rows = snapshot[key];
      log(`  ${key}: ${Array.isArray(rows) ? rows.length : 0} rows`);
    }
    log("\n(no database changes made)\n");
    return;
  }

  // Run imports in dependency order (users before orders, products before variants, etc.)
  await importUsers(snapshot.users || []);
  await importAddresses(snapshot.addresses || []);
  await importProducts(snapshot.products || []);
  await importProductVariants(snapshot.product_variants || []);
  await importOrders(snapshot.orders || []);
  await importOrderItems(snapshot.order_items || []);
  await importPaymentMethods(snapshot.payment_methods || []);
  await importSubscriptions(snapshot.subscriptions || []);
  await importOnboardingTemplates(snapshot.onboarding_templates || []);
  await importMarketingPages(snapshot.marketing_pages || []);

  log("\n✅  Import complete.\n");
  log("Notes:");
  log("  • Passwords were not imported — users must reset via email or OAuth.");
  log(
    "  • Affiliate events/sessions (aggregate only in snapshot) were not imported.",
  );
  log(
    "  • StripeWebhookEvents were not imported (webhook logs only, not user-facing).",
  );
  log("  • Run 'npx prisma studio' to verify the imported data.\n");
}

main()
  .catch((e) => {
    console.error("\n❌  Import failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
