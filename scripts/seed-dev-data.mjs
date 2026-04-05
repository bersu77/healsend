import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "crypto";

const prisma = new PrismaClient();

const BRAND = {
  name: "HealSend",
  slug: "healsend",
  description: "Development brand used for the local HealSend storefront.",
};

const CATEGORIES = [
  { name: "Weight Loss", slug: "weight-loss", priority: 1 },
  { name: "Sexual Health", slug: "sexual-health", priority: 2 },
  { name: "Anti-aging", slug: "anti-aging", priority: 3 },
];

const PRODUCTS = [
  {
    name: "Tirzepatide Injections",
    slug: "tirzepatide-injections",
    categorySlug: "weight-loss",
    featured: true,
    priority: 300,
    shortDescription:
      "Dual-action GLP-1 treatment built for appetite control, reduced food noise, and sustained weight loss.",
    description:
      "Provider-guided tirzepatide plans with flexible monthly and multi-month options.",
    images: ["/images/marketing/tirzepatide.png"],
    tags: ["Most Popular", "Rx"],
    variants: [
      { name: "1 Month Plan", price: 199, salePrice: 249 },
      { name: "3 Month Plan", price: 149, salePrice: 199 },
      { name: "12 Month Plan", price: 119, salePrice: 179 },
    ],
  },
  {
    name: "Semaglutide Injections",
    slug: "semaglutide-injections",
    categorySlug: "weight-loss",
    featured: false,
    priority: 280,
    shortDescription:
      "Trusted GLP-1 pathway for appetite support, steady progress, and long-term weight management.",
    description:
      "Semaglutide injections with transparent pricing and ongoing provider support.",
    images: ["/images/marketing/semaglutide-sermorelin.png"],
    tags: ["Cost Effective", "Rx"],
    variants: [
      { name: "1 Month Plan", price: 179, salePrice: 219 },
      { name: "3 Month Plan", price: 139, salePrice: 189 },
      { name: "12 Month Plan", price: 109, salePrice: 169 },
    ],
  },
  {
    name: "Tirzepatide Drops",
    slug: "tirzepatide-drops",
    categorySlug: "weight-loss",
    featured: false,
    priority: 260,
    shortDescription:
      "Needle-free appetite and craving support in a daily format built for convenience.",
    description:
      "Tirzepatide drops offer a gentle, consistent weight-loss option for patients who prefer a non-injection route.",
    images: ["/images/marketing/tirzepatide.png"],
    tags: ["Needle-Free", "Rx"],
    variants: [
      { name: "1 Month Plan", price: 199, salePrice: 229 },
      { name: "3 Month Plan", price: 159, salePrice: 209 },
      { name: "12 Month Plan", price: 129, salePrice: 189 },
    ],
  },
  {
    name: "PT-141 Nasal Spray",
    slug: "pt-141-nasal-spray",
    categorySlug: "sexual-health",
    featured: true,
    priority: 300,
    shortDescription:
      "Fast-acting support designed to boost desire, arousal, and confidence for men and women.",
    description:
      "PT-141 nasal spray is a discreet sexual wellness option with simple monthly pricing.",
    images: ["/images/marketing/pt141.png"],
    tags: ["Most Effective", "Rx"],
    variants: [
      { name: "1 Month Plan", price: 129, salePrice: 149 },
      { name: "3 Month Plan", price: 99, salePrice: 129 },
      { name: "6 Month Plan", price: 79, salePrice: 109 },
    ],
  },
  {
    name: "Oxytocin Nasal Spray",
    slug: "oxytocin-nasal-spray",
    categorySlug: "sexual-health",
    featured: false,
    priority: 260,
    shortDescription:
      "A needle-free option focused on connection, arousal, and confidence with discreet delivery.",
    description:
      "Oxytocin nasal spray plans are designed for patients who want a non-injection sexual wellness option.",
    images: ["/images/marketing/oxytocin.png"],
    tags: ["Needle-Free", "Rx"],
    variants: [
      { name: "1 Month Plan", price: 119, salePrice: 139 },
      { name: "3 Month Plan", price: 89, salePrice: 119 },
      { name: "6 Month Plan", price: 69, salePrice: 99 },
    ],
  },
  {
    name: "NAD+ Injections",
    slug: "nad-injections",
    categorySlug: "anti-aging",
    featured: true,
    priority: 320,
    shortDescription:
      "High-bioavailability NAD+ therapy built for energy, recovery, focus, and healthy aging support.",
    description:
      "NAD+ injections help replenish a key coenzyme tied to energy metabolism, cellular resilience, and mental clarity.",
    images: ["/product-image.webp"],
    tags: ["Most Popular", "Rx"],
    variants: [
      { name: "1 Month Plan", price: 173, salePrice: 196 },
      { name: "3 Month Plan", price: 119, salePrice: 186 },
      { name: "6 Month Plan", price: 99, salePrice: 169 },
    ],
  },
  {
    name: "NAD+ Nasal Spray",
    slug: "nad-nasal-spray",
    categorySlug: "anti-aging",
    featured: false,
    priority: 300,
    shortDescription:
      "Rapid, needle-free NAD+ support focused on clarity, alertness, and daily clean energy.",
    description:
      "A convenient NAD+ nasal spray option for patients who want cognitive and energy support without injections.",
    images: ["/related-prod-1.webp"],
    tags: ["Needle-Free", "Rx"],
    variants: [
      { name: "1 Month Plan", price: 139, salePrice: 169 },
      { name: "3 Month Plan", price: 119, salePrice: 149 },
      { name: "6 Month Plan", price: 99, salePrice: 129 },
    ],
  },
  {
    name: "NAD+ Patches",
    slug: "nad-patches",
    categorySlug: "anti-aging",
    featured: false,
    priority: 280,
    shortDescription:
      "Simple transdermal NAD+ support for patients who want an easy needle-free anti-aging option.",
    description:
      "NAD+ patches provide a convenient daily routine for patients looking to support vitality and cellular energy.",
    images: ["/related-prod-2.webp"],
    tags: ["Needle-Free", "Rx"],
    variants: [
      { name: "1 Month Plan", price: 199, salePrice: 219 },
      { name: "3 Month Plan", price: 169, salePrice: 199 },
    ],
  },
];

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(salt + password)
    .digest("hex");
  return `${salt}:${hash}`;
}

async function upsertCategory(category) {
  return prisma.category.upsert({
    where: { slug: category.slug },
    update: {
      name: category.name,
      priority: category.priority,
    },
    create: category,
  });
}

async function upsertBrand() {
  return prisma.brand.upsert({
    where: { slug: BRAND.slug },
    update: {
      name: BRAND.name,
      description: BRAND.description,
    },
    create: BRAND,
  });
}

async function seedCatalog() {
  const brand = await upsertBrand();
  const categories = await Promise.all(CATEGORIES.map(upsertCategory));
  const categoryIdsBySlug = new Map(
    categories.map((category) => [category.slug, category.id]),
  );
  const productsBySlug = new Map();

  for (const product of PRODUCTS) {
    const categoryId = categoryIdsBySlug.get(product.categorySlug);

    const upsertedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        type: "VARIABLE",
        published: true,
        featured: product.featured,
        shortDescription: product.shortDescription,
        description: product.description,
        regularPrice:
          product.variants[0]?.salePrice ?? product.variants[0]?.price ?? null,
        salePrice: product.variants[0]?.price ?? null,
        inStock: true,
        images: product.images,
        tags: product.tags,
        categoryId,
        brandId: brand.id,
        priority: product.priority,
      },
      create: {
        name: product.name,
        slug: product.slug,
        type: "VARIABLE",
        published: true,
        featured: product.featured,
        shortDescription: product.shortDescription,
        description: product.description,
        regularPrice:
          product.variants[0]?.salePrice ?? product.variants[0]?.price ?? null,
        salePrice: product.variants[0]?.price ?? null,
        inStock: true,
        images: product.images,
        tags: product.tags,
        categoryId,
        brandId: brand.id,
        priority: product.priority,
      },
    });

    await prisma.productVariant.deleteMany({
      where: { productId: upsertedProduct.id },
    });

    if (product.variants.length > 0) {
      await prisma.productVariant.createMany({
        data: product.variants.map((variant) => ({
          productId: upsertedProduct.id,
          name: variant.name,
          price: variant.price,
          salePrice: variant.salePrice ?? null,
          inStock: true,
        })),
      });
    }

    const hydratedProduct = await prisma.product.findUnique({
      where: { id: upsertedProduct.id },
      include: { variants: true, category: true, brand: true },
    });

    productsBySlug.set(product.slug, hydratedProduct);
    console.log(`Seeded product: ${product.name}`);
  }

  return { brand, categories, productsBySlug };
}

async function upsertUsers() {
  const adminPasswordHash = await hashPassword("Admin123!");
  const demoPasswordHash = await hashPassword("Demo123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@healsend.com" },
    update: {
      name: "HealSend Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      stripeCustomerId: "cus_dev_admin",
    },
    create: {
      email: "admin@healsend.com",
      name: "HealSend Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      stripeCustomerId: "cus_dev_admin",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "demo@healsend.com" },
    update: {
      name: "Demo Customer",
      phone: "+15551234567",
      role: "CUSTOMER",
      passwordHash: demoPasswordHash,
      stripeCustomerId: "cus_dev_demo_customer",
    },
    create: {
      email: "demo@healsend.com",
      name: "Demo Customer",
      phone: "+15551234567",
      role: "CUSTOMER",
      passwordHash: demoPasswordHash,
      stripeCustomerId: "cus_dev_demo_customer",
    },
  });

  await prisma.session.deleteMany({
    where: { userId: { in: [admin.id, customer.id] } },
  });

  await prisma.session.createMany({
    data: [
      {
        userId: admin.id,
        token: "dev-admin-session-token",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
      {
        userId: customer.id,
        token: "dev-customer-session-token",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    ],
  });

  console.log("Seeded users and sessions");
  return { admin, customer };
}

async function seedCustomerData(customer, productsBySlug) {
  await prisma.address.deleteMany({ where: { userId: customer.id } });
  const address = await prisma.address.create({
    data: {
      userId: customer.id,
      line1: "123 Wellness Way",
      city: "Austin",
      state: "TX",
      zip: "78701",
      country: "US",
      isDefault: true,
    },
  });

  await prisma.onboarding.upsert({
    where: { userId: customer.id },
    update: {
      goal: "Boost energy and support healthy aging",
      motivation: "I want steady energy and sharper focus.",
      feet: 5,
      inches: 10,
      weight: 176,
      bmi: 25.3,
      textAlerts: true,
      completedAt: new Date(),
    },
    create: {
      userId: customer.id,
      goal: "Boost energy and support healthy aging",
      motivation: "I want steady energy and sharper focus.",
      feet: 5,
      inches: 10,
      weight: 176,
      bmi: 25.3,
      textAlerts: true,
      completedAt: new Date(),
    },
  });

  await prisma.paymentMethod.deleteMany({ where: { userId: customer.id } });
  await prisma.paymentMethod.create({
    data: {
      userId: customer.id,
      stripePaymentMethodId: "pm_dev_visa",
      brand: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2030,
      isDefault: true,
    },
  });

  await prisma.message.deleteMany({ where: { userId: customer.id } });
  await prisma.message.createMany({
    data: [
      {
        userId: customer.id,
        subject: "Welcome to HealSend",
        body: "Your account is ready and your care team is here whenever you need support.",
        fromAdmin: true,
        read: true,
      },
      {
        userId: customer.id,
        subject: "Shipping Update",
        body: "Your next refill is scheduled and will ship in the next 48 hours.",
        fromAdmin: true,
        read: false,
      },
    ],
  });

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: "sub_dev_demo_customer" },
    update: {
      userId: customer.id,
      planName: "NAD+ 3 Month Plan",
      status: "ACTIVE",
      amount: 119,
      currency: "USD",
      interval: "month",
      intervalCount: 1,
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
    create: {
      userId: customer.id,
      stripeSubscriptionId: "sub_dev_demo_customer",
      planName: "NAD+ 3 Month Plan",
      status: "ACTIVE",
      amount: 119,
      currency: "USD",
      interval: "month",
      intervalCount: 1,
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  const nadProduct = productsBySlug.get("nad-injections");
  const defaultVariant = nadProduct?.variants?.[1] || nadProduct?.variants?.[0];

  const cart = await prisma.cart.upsert({
    where: { userId: customer.id },
    update: {},
    create: { userId: customer.id },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  if (nadProduct) {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: nadProduct.id,
        variantId: defaultVariant?.id || null,
        quantity: 1,
        metadata: { seeded: true },
      },
    });
  }

  const order = await prisma.order.upsert({
    where: { orderNumber: "DEV-1001" },
    update: {
      userId: customer.id,
      status: "PROCESSING",
      subtotal: defaultVariant?.price || nadProduct?.salePrice || 0,
      total: defaultVariant?.price || nadProduct?.salePrice || 0,
      addressId: address.id,
      notes: "Development seed order",
    },
    create: {
      orderNumber: "DEV-1001",
      userId: customer.id,
      status: "PROCESSING",
      subtotal: defaultVariant?.price || nadProduct?.salePrice || 0,
      total: defaultVariant?.price || nadProduct?.salePrice || 0,
      addressId: address.id,
      notes: "Development seed order",
    },
  });

  await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
  if (nadProduct) {
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: nadProduct.id,
        variantId: defaultVariant?.id || null,
        name: defaultVariant?.name
          ? `${nadProduct.name} - ${defaultVariant.name}`
          : nadProduct.name,
        price: defaultVariant?.price || nadProduct.salePrice || 0,
        quantity: 1,
        metadata: { seeded: true },
      },
    });
  }

  const formTemplate = await prisma.formTemplate.upsert({
    where: { slug: "development-health-checkin" },
    update: {
      name: "Development Health Check-In",
      description: "Dummy form used for local testing.",
      active: true,
      fields: [
        {
          name: "goal",
          label: "Primary Goal",
          type: "text",
          required: true,
        },
        {
          name: "energy_level",
          label: "Energy Level",
          type: "select",
          options: ["Low", "Medium", "High"],
          required: true,
        },
      ],
    },
    create: {
      name: "Development Health Check-In",
      slug: "development-health-checkin",
      description: "Dummy form used for local testing.",
      active: true,
      fields: [
        {
          name: "goal",
          label: "Primary Goal",
          type: "text",
          required: true,
        },
        {
          name: "energy_level",
          label: "Energy Level",
          type: "select",
          options: ["Low", "Medium", "High"],
          required: true,
        },
      ],
    },
  });

  await prisma.formSubmission.deleteMany({
    where: { formId: formTemplate.id, email: customer.email },
  });
  await prisma.formSubmission.create({
    data: {
      formId: formTemplate.id,
      email: customer.email,
      data: {
        goal: "Improve daily focus and energy",
        energy_level: "Medium",
      },
    },
  });

  const onboardingTemplate = await prisma.onboardingTemplate.findUnique({
    where: { slug: "nad-injection-therapy" },
  });

  if (onboardingTemplate) {
    await prisma.onboardingSubmission.deleteMany({
      where: { templateId: onboardingTemplate.id, userId: customer.id },
    });

    await prisma.onboardingSubmission.create({
      data: {
        templateId: onboardingTemplate.id,
        userId: customer.id,
        data: {
          motivation: "More energy and better recovery",
          selectedPlan: defaultVariant?.name || "3 Month Plan",
          selectedMedication: nadProduct?.slug || "nad-injections",
        },
        completedAt: new Date(),
      },
    });
  }

  await prisma.ghlContact.upsert({
    where: { ghlId: "dev-ghl-contact-001" },
    update: {
      firstName: "Demo",
      lastName: "Customer",
      email: customer.email,
      phone: customer.phone,
      tags: ["demo", "local-seed", "active-customer"],
      userId: customer.id,
    },
    create: {
      ghlId: "dev-ghl-contact-001",
      firstName: "Demo",
      lastName: "Customer",
      email: customer.email,
      phone: customer.phone,
      tags: ["demo", "local-seed", "active-customer"],
      userId: customer.id,
    },
  });

  console.log("Seeded customer records, cart, order, messages, forms, and CRM data");
}

async function main() {
  const { productsBySlug } = await seedCatalog();
  const { customer } = await upsertUsers();
  await seedCustomerData(customer, productsBySlug);
}

main()
  .catch((error) => {
    console.error("Failed to seed development data:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
