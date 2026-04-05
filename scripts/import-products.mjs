/**
 * CSV Product Importer for HealSend
 *
 * Usage: node scripts/import-products.mjs
 *
 * Reads wc-product-1.csv and wc-product-2.csv from project root
 * and imports them into the Prisma PostgreSQL database.
 */

import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getNormalizedCategorySlug, normalizeImportedCatalogProduct } from "./lib/catalog-normalization.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const prisma = new PrismaClient();

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseImages(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseTags(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function tryParseJSON(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function ensureCategory(nameOrSlug) {
  if (!nameOrSlug) return null;
  const slug = slugify(nameOrSlug);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return existing.id;
  const label = String(nameOrSlug)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const created = await prisma.category.create({ data: { name: label, slug } });
  return created.id;
}

async function importCSV(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  });

  console.log(
    `  Parsed ${records.length} rows from ${path.basename(filePath)}`,
  );

  let imported = 0;
  let skipped = 0;

  for (const row of records) {
    const name = row["Name"];
    if (!name) {
      skipped++;
      continue;
    }

    const wcId = row["ID"] ? parseInt(row["ID"], 10) : null;
    const slug = slugify(name);

    // Check for existing
    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug }, ...(wcId ? [{ wcId }] : [])] },
    });
    if (existing) {
      console.log(`  Skipping duplicate: ${name}`);
      skipped++;
      continue;
    }

    const normalizedProduct = normalizeImportedCatalogProduct({
      name,
      slug,
      category: row["Categories"] || null,
      images: parseImages(row["Images"]),
      shortDescription: row["Short description"] || null,
      description: row["Description"] || null,
      tags: parseTags(row["Tags"]),
    });
    const categorySlug = normalizedProduct.categorySlug;
    const categoryId = await ensureCategory(categorySlug);

    const type =
      (row["Type"] || "simple").toLowerCase() === "variable"
        ? "VARIABLE"
        : "SIMPLE";
    const subscriptionTiers = tryParseJSON(
      row["Meta: _hld_subscription_tiers"],
    );
    const stripeProductId =
      row["Meta: stripe_product_id"] || row["stripe_product_id"] || null;

    // Build attributes from csv columns matching "Attribute N name/value"
    const attributes = {};
    for (let i = 1; i <= 5; i++) {
      const attrName = row[`Attribute ${i} name`];
      const attrVal = row[`Attribute ${i} value(s)`];
      if (attrName && attrVal) attributes[attrName] = attrVal;
    }

    const product = await prisma.product.create({
      data: {
        wcId: wcId || undefined,
        name,
        slug: normalizedProduct.slug,
        type,
        sku: row["SKU"] || null,
        published: row["Published"] === "1",
        featured: row["Is featured?"] === "1",
        shortDescription: normalizedProduct.shortDescription,
        description: normalizedProduct.description,
        regularPrice: row["Regular price"]
          ? parseFloat(row["Regular price"])
          : null,
        salePrice: row["Sale price"] ? parseFloat(row["Sale price"]) : null,
        taxStatus: row["Tax status"] || "taxable",
        inStock: row["In stock?"] !== "0",
        stock: row["Stock"] ? parseInt(row["Stock"], 10) : null,
        weight: row["Weight (kg)"] ? parseFloat(row["Weight (kg)"]) : null,
        images: normalizedProduct.images,
        tags: normalizedProduct.tags,
        stripeProductId: stripeProductId || undefined,
        categoryId,
        subscriptionTiers: subscriptionTiers || undefined,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
        priority: row["Meta: _hld_category_priority"]
          ? parseInt(row["Meta: _hld_category_priority"], 10)
          : 0,
      },
    });

    // Create variants from subscription tiers (if variable product)
    if (
      type === "VARIABLE" &&
      subscriptionTiers &&
      Array.isArray(subscriptionTiers)
    ) {
      for (const tier of subscriptionTiers) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: `${tier.duration_months} Month Plan`,
            price: tier.first_price || 0,
            salePrice: tier.then_price || null,
            stripePriceId: tier.stripe_price_id || null,
            attributes: tier,
          },
        });
      }
    }

    imported++;
    console.log(`  ✓ Imported: ${name} (${type})`);
  }

  return { imported, skipped };
}

async function main() {
  console.log("Starting HealSend product import...\n");

  const csvFiles = ["wc-product-1.csv", "wc-product-2.csv"];

  let totalImported = 0;
  let totalSkipped = 0;

  for (const file of csvFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ File not found: ${file}`);
      continue;
    }
    console.log(`Processing ${file}...`);
    const result = await importCSV(filePath);
    totalImported += result.imported;
    totalSkipped += result.skipped;
  }

  console.log(`\nDone! Imported: ${totalImported}, Skipped: ${totalSkipped}`);
}

main()
  .catch((e) => {
    console.error("Import error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
