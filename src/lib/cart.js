import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const LOCAL_CART_EMAIL = "local-cart@healsend.com";

export const CART_INCLUDE = {
  items: {
    include: {
      product: true,
      variant: true,
    },
  },
};

export function isGuestCartEnabled() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.MD_LOCAL_DEV_FALLBACK === "true"
  );
}

export async function getLocalCartUser() {
  return prisma.user.upsert({
    where: { email: LOCAL_CART_EMAIL },
    update: { name: "Local Cart User" },
    create: {
      email: LOCAL_CART_EMAIL,
      name: "Local Cart User",
      role: "CUSTOMER",
    },
  });
}

export function isLocalCartUser(user) {
  return user?.email === LOCAL_CART_EMAIL;
}

export async function resolveCartUser({ currentUser } = {}) {
  const user = currentUser === undefined ? await getCurrentUser() : currentUser;
  if (user) {
    return user;
  }

  if (!isGuestCartEnabled()) {
    return null;
  }

  return getLocalCartUser();
}

export async function getCartForUserId(userId, { createIfMissing = false } = {}) {
  if (!userId) {
    return null;
  }

  if (createIfMissing) {
    return prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: CART_INCLUDE,
    });
  }

  return prisma.cart.findUnique({
    where: { userId },
    include: CART_INCLUDE,
  });
}

export async function getCartForRequest(options = {}) {
  const user = await resolveCartUser(options);
  if (!user) {
    return { user: null, cart: null };
  }

  const cart = await getCartForUserId(user.id, {
    createIfMissing: options.createIfMissing ?? false,
  });

  return { user, cart };
}
