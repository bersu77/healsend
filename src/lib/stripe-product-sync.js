import { resolveAbsoluteUrl } from "@/lib/seo";
import { stripe } from "@/lib/stripe";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function toPositiveAmount(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function toStripeUnitAmount(value) {
  const amount = toPositiveAmount(value);
  return amount === null ? null : Math.round(amount * 100);
}

function getEffectiveStripeAmount(product) {
  return toStripeUnitAmount(
    product?.salePrice !== null && product?.salePrice !== undefined
      ? product.salePrice
      : product?.regularPrice,
  );
}

function resolveAbsoluteUrlWithBase(value, baseUrl = null) {
  if (!value) return null;

  try {
    return baseUrl
      ? new URL(value, baseUrl).toString()
      : resolveAbsoluteUrl(value);
  } catch {
    return null;
  }
}

function isPublicStripeUrl(value) {
  if (!value) return false;

  try {
    const parsed = new URL(value);
    const hostname = parsed.hostname.toLowerCase();

    return (
      ["http:", "https:"].includes(parsed.protocol) &&
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      hostname !== "::1"
    );
  } catch {
    return false;
  }
}

function getStripeImageList(product, baseUrl = null) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const seen = new Set();

  return images
    .map((image) => resolveAbsoluteUrlWithBase(image, baseUrl))
    .filter((image) => {
      if (!image || !isPublicStripeUrl(image) || seen.has(image)) {
        return false;
      }
      seen.add(image);
      return true;
    })
    .slice(0, 8);
}

function getStripeProductDescription(product) {
  const raw = String(product?.description || product?.shortDescription || "")
    .trim()
    .slice(0, 3990);

  return raw || undefined;
}

function getStripeStorefrontUrl(product, baseUrl = null) {
  const slug = String(product?.slug || "").trim();
  if (!slug) return undefined;

  const resolved = resolveAbsoluteUrlWithBase(`/shop/${slug}`, baseUrl);
  return isPublicStripeUrl(resolved) ? resolved : undefined;
}

function getStripeSyncSnapshot(attributes) {
  return asObject(asObject(attributes).stripeSync);
}

function mergeStripeSyncAttributes(attributes, updates) {
  const nextAttributes = { ...asObject(attributes) };
  const nextStripeSync = { ...getStripeSyncSnapshot(attributes) };

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      nextStripeSync[key] = value;
    }
  }

  nextAttributes.stripeSync = nextStripeSync;
  return nextAttributes;
}

function getDefaultPriceId(defaultPrice) {
  if (!defaultPrice) return null;
  if (typeof defaultPrice === "string") return defaultPrice;
  return defaultPrice.id || null;
}

function getDefaultPriceAmount(defaultPrice) {
  if (!defaultPrice || typeof defaultPrice === "string") return null;
  return typeof defaultPrice.unit_amount === "number"
    ? defaultPrice.unit_amount
    : null;
}

function getDefaultPriceCurrency(defaultPrice) {
  if (!defaultPrice || typeof defaultPrice === "string") return null;
  return defaultPrice.currency || null;
}

function isMissingStripeResource(error) {
  return (
    error?.code === "resource_missing" ||
    error?.raw?.code === "resource_missing" ||
    error?.statusCode === 404
  );
}

export function getProductStripeSyncSummary(product) {
  const snapshot = getStripeSyncSnapshot(product?.attributes);
  const productId = product?.stripeProductId || snapshot.productId || null;

  if (snapshot.status) {
    return {
      status: snapshot.status,
      productId,
      defaultPriceId: snapshot.defaultPriceId || null,
      lastSyncedAt: snapshot.lastSyncedAt || null,
      lastAttemptAt: snapshot.lastAttemptAt || null,
      lastError: snapshot.lastError || null,
    };
  }

  return {
    status: productId ? "synced" : "pending",
    productId,
    defaultPriceId: snapshot.defaultPriceId || null,
    lastSyncedAt: snapshot.lastSyncedAt || null,
    lastAttemptAt: snapshot.lastAttemptAt || null,
    lastError: snapshot.lastError || null,
  };
}

export async function syncStripeProductForProduct(product, options = {}) {
  const baseUrl = options.baseUrl || null;
  const now = new Date().toISOString();
  const existingSync = getStripeSyncSnapshot(product?.attributes);
  const metadata = {
    source: "healsend-dashboard",
    localProductId: String(product?.id || ""),
    slug: String(product?.slug || ""),
    sku: String(product?.sku || ""),
    published: product?.published === false ? "false" : "true",
    inStock: product?.inStock === false ? "false" : "true",
  };
  const images = getStripeImageList(product, baseUrl);
  const description = getStripeProductDescription(product);
  const storefrontUrl = getStripeStorefrontUrl(product, baseUrl);
  const unitAmount = getEffectiveStripeAmount(product);
  const productPayload = {
    name: product?.name || "Untitled Product",
    active: product?.published !== false,
    metadata,
    ...(description ? { description } : {}),
    ...(images.length > 0 ? { images } : {}),
    ...(storefrontUrl ? { url: storefrontUrl } : {}),
  };

  try {
    let stripeProductId =
      product?.stripeProductId || existingSync.productId || null;

    if (stripeProductId) {
      try {
        await stripe.products.update(stripeProductId, productPayload);
      } catch (error) {
        if (isMissingStripeResource(error)) {
          stripeProductId = null;
        } else {
          throw error;
        }
      }
    }

    let defaultPriceId = existingSync.defaultPriceId || null;

    if (!stripeProductId) {
      const created = await stripe.products.create({
        ...productPayload,
        ...(unitAmount !== null
          ? {
              default_price_data: {
                currency: "usd",
                unit_amount: unitAmount,
                metadata,
              },
            }
          : {}),
      });

      stripeProductId = created.id;
      defaultPriceId = getDefaultPriceId(created.default_price);
    } else {
      const stripeProduct = await stripe.products.retrieve(stripeProductId, {
        expand: ["default_price"],
      });

      defaultPriceId = getDefaultPriceId(stripeProduct.default_price);

      if (unitAmount !== null) {
        const currentAmount = getDefaultPriceAmount(stripeProduct.default_price);
        const currentCurrency = getDefaultPriceCurrency(
          stripeProduct.default_price,
        );

        if (currentAmount !== unitAmount || currentCurrency !== "usd") {
          const price = await stripe.prices.create({
            product: stripeProductId,
            currency: "usd",
            unit_amount: unitAmount,
            metadata,
          });

          defaultPriceId = price.id;
          await stripe.products.update(stripeProductId, {
            default_price: price.id,
          });
        }
      }
    }

    const attributes = mergeStripeSyncAttributes(product?.attributes, {
      status: "synced",
      productId: stripeProductId,
      defaultPriceId,
      unitAmount,
      currency: unitAmount !== null ? "usd" : existingSync.currency || null,
      lastAttemptAt: now,
      lastSyncedAt: now,
      lastError: null,
    });

    return {
      ok: true,
      stripeProductId,
      attributes,
      summary: {
        status: "synced",
        productId: stripeProductId,
        defaultPriceId,
        lastSyncedAt: now,
        lastAttemptAt: now,
        lastError: null,
      },
    };
  } catch (error) {
    const message =
      error?.message || "Stripe sync failed. Please try saving again.";
    const attributes = mergeStripeSyncAttributes(product?.attributes, {
      status: "needs_attention",
      productId: product?.stripeProductId || existingSync.productId || null,
      defaultPriceId: existingSync.defaultPriceId || null,
      unitAmount,
      currency: unitAmount !== null ? "usd" : existingSync.currency || null,
      lastAttemptAt: now,
      lastError: message,
    });

    return {
      ok: false,
      stripeProductId: product?.stripeProductId || existingSync.productId || null,
      attributes,
      summary: {
        status: "needs_attention",
        productId: product?.stripeProductId || existingSync.productId || null,
        defaultPriceId: existingSync.defaultPriceId || null,
        lastSyncedAt: existingSync.lastSyncedAt || null,
        lastAttemptAt: now,
        lastError: message,
      },
    };
  }
}
