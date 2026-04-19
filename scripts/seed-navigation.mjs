/**
 * Seed the navigation menus with the current hardcoded site links.
 * Safe to re-run: existing menus with the same location are deleted first,
 * then recreated with the latest data.
 *
 * Usage: node --env-file=.env scripts/seed-navigation.mjs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Menus ────────────────────────────────────────────────────────────────────

const HEADER_ITEMS = [
  // Top-level sections
  { label: "Weight Loss", url: "/weight-loss", order: 0, parentKey: null },
  { label: "Anti-aging", url: "/anti-aging", order: 1, parentKey: null },
  {
    label: "Strength & Recovery",
    url: "/strength-recovery",
    order: 2,
    parentKey: null,
  },
  { label: "Sexual Health", url: "/sexual-health", order: 3, parentKey: null },
  // Weight Loss sub-items
  {
    label: "Weight Loss Overview",
    url: "/weight-loss",
    order: 0,
    parentKey: "Weight Loss",
  },
  {
    label: "Semaglutide Injections",
    url: "/funnels/food-noise-appetite",
    order: 1,
    parentKey: "Weight Loss",
  },
  {
    label: "Tirzepatide Injections",
    url: "/funnels/craving-portion-control",
    order: 2,
    parentKey: "Weight Loss",
  },
  {
    label: "Tirzepatide Drops",
    url: "/funnels/craving-portion-control",
    order: 3,
    parentKey: "Weight Loss",
  },
  {
    label: "Tirzepatide Tablets",
    url: "/funnels/craving-portion-control",
    order: 4,
    parentKey: "Weight Loss",
  },
  {
    label: "GLP-1 Eligibility Quiz",
    url: "/funnels/glp-1",
    order: 5,
    parentKey: "Weight Loss",
  },
  {
    label: "MICC + B12 Shots",
    url: "/funnels/micc-b12-shots",
    order: 6,
    parentKey: "Weight Loss",
  },
  // Anti-aging sub-items
  {
    label: "NAD+ Injection",
    url: "/funnels/nad-injection-therapy",
    order: 0,
    parentKey: "Anti-aging",
  },
  {
    label: "NAD+ Nasal Spray",
    url: "/funnels/nad-nasal-spray",
    order: 1,
    parentKey: "Anti-aging",
  },
  {
    label: "NAD+ & Glutathione",
    url: "/funnels/nad-glutathione",
    order: 2,
    parentKey: "Anti-aging",
  },
  {
    label: "Glutathione Injection",
    url: "/funnels/glutathione",
    order: 3,
    parentKey: "Anti-aging",
  },
  {
    label: "Glutathione + LDN",
    url: "/funnels/glutathione-ldn",
    order: 4,
    parentKey: "Anti-aging",
  },
  {
    label: "MICC + B12 Shots",
    url: "/funnels/micc-b12-shots",
    order: 5,
    parentKey: "Anti-aging",
  },
  // Strength & Recovery sub-items
  {
    label: "Strength & Recovery Overview",
    url: "/strength-recovery",
    order: 0,
    parentKey: "Strength & Recovery",
  },
  {
    label: "Sermorelin Injection",
    url: "/funnels/sermorelin",
    order: 1,
    parentKey: "Strength & Recovery",
  },
  {
    label: "Growth Hormone Support",
    url: "/funnels/growth-hormone-support",
    order: 2,
    parentKey: "Strength & Recovery",
  },
  {
    label: "CJC-1295 + Ipamorelin",
    url: "/funnels/performance-lab",
    order: 3,
    parentKey: "Strength & Recovery",
  },
  {
    label: "Enclomiphene",
    url: "/funnels/enclomiphene",
    order: 4,
    parentKey: "Strength & Recovery",
  },
  {
    label: "HRT Lite",
    url: "/funnels/hrt-lite",
    order: 5,
    parentKey: "Strength & Recovery",
  },
  // Sexual Health sub-items
  {
    label: "Sexual Health Overview",
    url: "/sexual-health",
    order: 0,
    parentKey: "Sexual Health",
  },
  {
    label: "PT-141 Nasal Spray",
    url: "/funnels/low-intimacy-drive",
    order: 1,
    parentKey: "Sexual Health",
  },
  {
    label: "Oxytocin Nasal Spray",
    url: "/funnels/low-intimacy-drive",
    order: 2,
    parentKey: "Sexual Health",
  },
  {
    label: "PT-141 + Oxytocin",
    url: "/funnels/low-intimacy-drive",
    order: 3,
    parentKey: "Sexual Health",
  },
  {
    label: "Viagra | Sildenafil",
    url: "/funnels/performance-issues",
    order: 4,
    parentKey: "Sexual Health",
  },
  {
    label: "ED Medications",
    url: "/funnels/ed-meds",
    order: 5,
    parentKey: "Sexual Health",
  },
];

const FOOTER_ITEMS = [
  // Popular Weight Loss
  {
    label: "Popular Weight Loss",
    url: "/weight-loss",
    order: 0,
    parentKey: null,
  },
  {
    label: "GLP-1 Eligibility Quiz",
    url: "/funnels/glp-1",
    order: 0,
    parentKey: "Popular Weight Loss",
  },
  {
    label: "Tirzepatide Injection",
    url: "/funnels/craving-portion-control",
    order: 1,
    parentKey: "Popular Weight Loss",
  },
  {
    label: "Semaglutide Injection",
    url: "/funnels/food-noise-appetite",
    order: 2,
    parentKey: "Popular Weight Loss",
  },
  {
    label: "MICC + B12 Shots",
    url: "/funnels/micc-b12-shots",
    order: 3,
    parentKey: "Popular Weight Loss",
  },
  // Sexual Health
  { label: "Sexual Health", url: "/sexual-health", order: 1, parentKey: null },
  {
    label: "PT-141 Nasal Spray",
    url: "/funnels/low-intimacy-drive",
    order: 0,
    parentKey: "Sexual Health",
  },
  {
    label: "Oxytocin Nasal Spray",
    url: "/funnels/low-intimacy-drive",
    order: 1,
    parentKey: "Sexual Health",
  },
  {
    label: "ED Medications",
    url: "/funnels/performance-issues",
    order: 2,
    parentKey: "Sexual Health",
  },
  // Anti-aging
  { label: "Anti-aging", url: "/anti-aging", order: 2, parentKey: null },
  {
    label: "NAD+ Injection",
    url: "/funnels/nad-injection-therapy",
    order: 0,
    parentKey: "Anti-aging",
  },
  {
    label: "NAD+ Nasal Spray",
    url: "/funnels/nad-nasal-spray",
    order: 1,
    parentKey: "Anti-aging",
  },
  {
    label: "Glutathione",
    url: "/funnels/glutathione",
    order: 2,
    parentKey: "Anti-aging",
  },
  {
    label: "Sermorelin Injection",
    url: "/funnels/sermorelin",
    order: 3,
    parentKey: "Anti-aging",
  },
  // Legal
  { label: "Legal", url: "/terms-of-service-2", order: 3, parentKey: null },
  {
    label: "Telehealth Consent",
    url: "/consent-to-telehealth-2",
    order: 0,
    parentKey: "Legal",
  },
  {
    label: "Safety Information",
    url: "/safety-information",
    order: 1,
    parentKey: "Legal",
  },
  {
    label: "My Health My Data",
    url: "/consumer-health-data",
    order: 2,
    parentKey: "Legal",
  },
  {
    label: "Terms",
    url: "/terms-of-service-2",
    order: 3,
    parentKey: "Legal",
  },
  {
    label: "Privacy",
    url: "/privacy-policy",
    order: 4,
    parentKey: "Legal",
  },
  {
    label: "Refund Policy",
    url: "/refund-policy",
    order: 5,
    parentKey: "Legal",
  },
];

const MOBILE_ITEMS = [
  // Treatment Categories section
  { label: "Weight Loss", url: "/shop/weight-loss", order: 0, parentKey: null },
  { label: "Strength", url: "/shop/strength", order: 1, parentKey: null },
  { label: "Anti-Aging", url: "/shop/anti-aging", order: 2, parentKey: null },
  { label: "Hair Growth", url: "/shop/hair-growth", order: 3, parentKey: null },
  { label: "Mood", url: "/shop/mood", order: 4, parentKey: null },
  { label: "More", url: "/shop", order: 5, parentKey: null },
  // Discover section
  {
    label: "Eden Health Clubs",
    url: "/health-clubs",
    order: 6,
    parentKey: null,
  },
  { label: "About Us", url: "/about", order: 7, parentKey: null },
  { label: "Blog", url: "/blog", order: 8, parentKey: null },
];

// ─── Seed helper ─────────────────────────────────────────────────────────────

async function seedMenu(name, location, items) {
  // Remove existing menu for this location so the seed is idempotent
  await prisma.navigationMenu.deleteMany({ where: { location, name } });

  const menu = await prisma.navigationMenu.create({
    data: { name, location },
  });

  // Insert top-level items first
  const topLevelRows = items.filter((i) => i.parentKey === null);
  const createdParents = {};

  for (const item of topLevelRows) {
    const row = await prisma.navigationItem.create({
      data: {
        menuId: menu.id,
        label: item.label,
        url: item.url,
        order: item.order,
        target: item.target ?? null,
        parentId: null,
      },
    });
    createdParents[item.label] = row.id;
  }

  // Insert children
  const children = items.filter((i) => i.parentKey !== null);
  for (const item of children) {
    const parentId = createdParents[item.parentKey];
    if (!parentId) {
      console.warn(
        `  ⚠ Parent "${item.parentKey}" not found for item "${item.label}" — skipping`,
      );
      continue;
    }
    await prisma.navigationItem.create({
      data: {
        menuId: menu.id,
        label: item.label,
        url: item.url,
        order: item.order,
        target: item.target ?? null,
        parentId,
      },
    });
  }

  const total = topLevelRows.length + children.length;
  console.log(
    `  ✔ "${name}" (${location}) — ${total} items (${topLevelRows.length} top-level, ${children.length} sub-items)`,
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding navigation menus…\n");

  await seedMenu("Main Navigation", "header", HEADER_ITEMS);
  await seedMenu("Footer Navigation", "footer", FOOTER_ITEMS);
  await seedMenu("Mobile Menu", "mobile", MOBILE_ITEMS);

  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
