import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function roundMoney(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value * 100) / 100;
}

function normalizePlanDuration(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function matchVariant(product, item) {
  if (!product?.variants?.length) {
    return null;
  }

  const normalizedPlanDuration = normalizePlanDuration(item.planDuration);
  if (normalizedPlanDuration) {
    const durationFragment = normalizedPlanDuration.replace(" month", "");
    const byDuration = product.variants.find((variant) =>
      normalizePlanDuration(variant.name).includes(durationFragment),
    );

    if (byDuration) {
      return byDuration.id;
    }
  }

  const byPrice = product.variants.find((variant) => {
    const candidatePrice = variant.salePrice ?? variant.price;
    return roundMoney(candidatePrice) === roundMoney(item.unitPrice);
  });

  return byPrice?.id || null;
}

async function main() {
  const products = await prisma.product.findMany({
    where: { wcId: { not: null } },
    select: {
      id: true,
      wcId: true,
      variants: {
        select: {
          id: true,
          name: true,
          price: true,
          salePrice: true,
        },
      },
    },
  });

  const productByWcId = new Map(
    products
      .filter((product) => Number.isInteger(product.wcId))
      .map((product) => [product.wcId, product]),
  );

  const orderItems = await prisma.orderItem.findMany({
    select: {
      id: true,
      productId: true,
      variantId: true,
      quantity: true,
      price: true,
      metadata: true,
    },
  });

  let updated = 0;
  let skipped = 0;

  for (const item of orderItems) {
    const metadata =
      item.metadata && typeof item.metadata === "object" ? item.metadata : {};

    if (metadata.importedFrom !== "wordpress_woocommerce") {
      skipped += 1;
      continue;
    }

    const wcProductId = Number.parseInt(String(metadata.wcProductId || ""), 10);
    if (!Number.isInteger(wcProductId)) {
      skipped += 1;
      continue;
    }

    const product = productByWcId.get(wcProductId);
    if (!product) {
      skipped += 1;
      continue;
    }

    const unitPrice = Number(item.price || 0);
    const variantId = matchVariant(product, {
      unitPrice,
      planDuration: metadata.planDuration || null,
    });

    if (item.productId === product.id && item.variantId === variantId) {
      skipped += 1;
      continue;
    }

    await prisma.orderItem.update({
      where: { id: item.id },
      data: {
        productId: product.id,
        variantId,
      },
    });

    updated += 1;
  }

  console.log(JSON.stringify({ updated, skipped, products: products.length }));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
