import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CART_INCLUDE, getCartForRequest, getCartForUserId } from "@/lib/cart";
import { getPricingMetadataSummary } from "@/lib/pricing";
import {
  buildDuplicatePurchaseMessage,
  findExistingActivePurchaseForProduct,
} from "@/lib/purchase-guards";

// GET /api/cart?userId=xxx
export async function GET() {
  const { cart } = await getCartForRequest({ createIfMissing: true });

  if (!cart) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  return NextResponse.json(cart);
}

// POST /api/cart — add item to cart
export async function POST(request) {
  const {
    productId,
    variantId,
    quantity = 1,
    metadata,
    cartItemId,
  } = await request.json();

  const normalizedQuantity = Number.parseInt(String(quantity), 10);
  const safeQuantity = Number.isFinite(normalizedQuantity) ? normalizedQuantity : 1;

  const { user } = await getCartForRequest();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const cart = await getCartForUserId(user.id, { createIfMissing: true });

  if (!cart) {
    return NextResponse.json(
      { error: "Unable to resolve cart" },
      { status: 500 },
    );
  }

  if (cartItemId) {
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (safeQuantity < 1) {
      await prisma.cartItem.delete({ where: { id: existingCartItem.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: safeQuantity },
      });
    }
  } else if (!productId) {
    return NextResponse.json(
      { error: "productId or cartItemId required" },
      { status: 400 },
    );
  } else {
    const duplicatePurchase = await findExistingActivePurchaseForProduct({
      userId: user.id,
      productId,
    });

    if (duplicatePurchase) {
      return NextResponse.json(
        {
          error: buildDuplicatePurchaseMessage(duplicatePurchase.itemName),
          duplicateProduct: true,
          existingOrderId: duplicatePurchase.id,
        },
        { status: 409 },
      );
    }

    const existingCandidates = await prisma.cartItem.findMany({
      where: { cartId: cart.id, productId, variantId: variantId || null },
      select: {
        id: true,
        quantity: true,
        metadata: true,
      },
    });
    const incomingPricingKey = getPricingMetadataSummary(metadata)?.pricingKey || null;
    const existing = existingCandidates.find(
      (item) =>
        (getPricingMetadataSummary(item.metadata)?.pricingKey || null) ===
        incomingPricingKey,
    );

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Math.max(1, safeQuantity) },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          quantity: Math.max(1, safeQuantity),
          metadata,
        },
      });
    }
  }

  const updated = await prisma.cart.findUnique({ where: { id: cart.id }, include: CART_INCLUDE });
  return NextResponse.json(updated);
}

// DELETE /api/cart — remove item
export async function DELETE(request) {
  const searchParams = new URL(request.url).searchParams;
  let itemId = searchParams.get("itemId");

  if (!itemId) {
    try {
      const body = await request.json();
      itemId = body?.itemId || null;
    } catch {
      itemId = null;
    }
  }

  if (!itemId)
    return NextResponse.json({ error: "itemId required" }, { status: 400 });

  const { cart } = await getCartForRequest();
  if (!cart) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const existingCartItem = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  if (!existingCartItem) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id: existingCartItem.id } });

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: CART_INCLUDE,
  });

  return NextResponse.json(updated);
}
