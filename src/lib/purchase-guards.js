import { prisma } from "@/lib/prisma";

export const BLOCKING_PURCHASE_ORDER_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
];

export function buildDuplicatePurchaseMessage(productName) {
  const trimmedName = String(productName || "").trim();
  const label = trimmedName || "this treatment";
  return `You already have ${label} in your account. Manage it from My Account instead of purchasing it again.`;
}

export async function findExistingActivePurchaseForProduct({
  userId,
  productId,
  excludeOrderId = null,
}) {
  if (!userId || !productId) {
    return null;
  }

  const order = await prisma.order.findFirst({
    where: {
      userId,
      status: { in: BLOCKING_PURCHASE_ORDER_STATUSES },
      ...(excludeOrderId ? { id: { not: excludeOrderId } } : {}),
      items: {
        some: {
          productId,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      createdAt: true,
      items: {
        where: { productId },
        select: {
          productId: true,
          name: true,
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  return {
    ...order,
    itemName: order.items[0]?.name || null,
  };
}

export async function findExistingActivePurchasesForProducts({
  userId,
  productIds,
  excludeOrderId = null,
}) {
  const normalizedProductIds = [...new Set((productIds || []).filter(Boolean))];
  if (!userId || normalizedProductIds.length === 0) {
    return new Map();
  }

  const orders = await prisma.order.findMany({
    where: {
      userId,
      status: { in: BLOCKING_PURCHASE_ORDER_STATUSES },
      ...(excludeOrderId ? { id: { not: excludeOrderId } } : {}),
      items: {
        some: {
          productId: { in: normalizedProductIds },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      createdAt: true,
      items: {
        where: { productId: { in: normalizedProductIds } },
        select: {
          productId: true,
          name: true,
        },
      },
    },
  });

  const results = new Map();

  for (const order of orders) {
    for (const item of order.items) {
      if (!item.productId || results.has(item.productId)) {
        continue;
      }

      results.set(item.productId, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        itemName: item.name || null,
      });
    }
  }

  return results;
}
