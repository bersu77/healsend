import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ENCLOMIPHENE = {
  name: "Enclomiphene",
  slug: "enclomiphene",
  shortDescription:
    "Stimulates your body's own testosterone production naturally by acting on the HPG axis — without shutting down fertility.",
  description:
    "Enclomiphene citrate is a selective estrogen receptor modulator (SERM) that binds to estrogen receptors in the hypothalamus and pituitary gland, triggering increased LH and FSH release. This signals the testes to produce more testosterone naturally — preserving fertility and avoiding the shutdown that comes with exogenous TRT.",
  images: ["/images/marketing/enclomiphene.png"],
  tags: ["Fertility-Safe", "Rx"],
  featured: true,
  priority: 310,
  variants: [
    { name: "1 Month Plan", price: 89, salePrice: 119 },
    { name: "3 Month Plan", price: 79, salePrice: 109 },
    { name: "12 Month Plan", price: 69, salePrice: 99 },
  ],
  attributes: {
    detailPage: {
      overviewTitle: "About Enclomiphene",
      overviewBody:
        "Enclomiphene citrate is a selective estrogen receptor modulator (SERM) that works by binding to estrogen receptors in the brain — specifically the hypothalamus and pituitary gland. This triggers your body to release more LH (luteinizing hormone) and FSH (follicle-stimulating hormone), which signal the testes to produce more testosterone naturally. Unlike exogenous TRT, enclomiphene preserves your body's own hormone production and maintains fertility.",
      benefitsTitle: "Key Benefits",
      benefits: [
        "Stimulates natural testosterone production through the HPG axis",
        "Preserves fertility — no testicular shutdown unlike exogenous TRT",
        "Increases LH and FSH for balanced hormonal signaling",
        "Improves energy levels, mood, and mental clarity",
        "Enhances physical performance and lean muscle support",
        "No injections required — simple oral capsule taken daily",
        "Clinician-monitored with regular lab work included",
        "Can be combined with other therapies for optimized results",
      ],
      howTitle: "How Enclomiphene Works",
      howSteps: [
        {
          title: "Blocks Estrogen Feedback",
          desc: "Enclomiphene binds to estrogen receptors in the hypothalamus, blocking the negative feedback loop that suppresses hormone production.",
          icon: "psychology",
        },
        {
          title: "Releases LH & FSH",
          desc: "The pituitary gland responds by releasing more LH and FSH — the hormones that signal testosterone production.",
          icon: "hub",
        },
        {
          title: "Natural T Production",
          desc: "Your testes receive the signal and produce more testosterone naturally, while maintaining sperm production and fertility.",
          icon: "trending_up",
        },
      ],
      safetyTitle: "Safety Information",
      safetyItems: [
        {
          icon: "warning",
          colorClass: "text-amber-500",
          title: "Important Safety Information",
          body: "Enclomiphene requires a prescription. A licensed provider will review your health profile, symptoms, and lab work before prescribing. Common side effects may include headaches, nausea, or mild mood changes. Not appropriate for everyone.",
        },
        {
          icon: "info",
          colorClass: "text-blue-500",
          title: "Enclomiphene vs Traditional TRT",
          body: "Unlike testosterone injections which shut down natural production and can impair fertility, enclomiphene stimulates your body's own testosterone production. Ideal for men who want to raise T levels while preserving the option to have children.",
        },
        {
          icon: "verified_user",
          colorClass: "text-emerald-500",
          title: "Quality & Monitoring",
          body: "Lab work included to track total testosterone, free testosterone, LH, FSH, and estradiol. Regular check-ins with your clinician to optimize dosing. Compounded in U.S. pharmacies. FSA & HSA eligible.",
        },
      ],
    },
  },
};

const TRT = {
  name: "TRT (Testosterone Injections)",
  slug: "testosterone-injections",
  shortDescription:
    "Clinical-grade testosterone replacement therapy for men with low T — restore energy, strength, mood, and drive.",
  description:
    "Testosterone Replacement Therapy (TRT) delivers exogenous testosterone via injection to restore levels in men diagnosed with hypogonadism or clinically low testosterone. HealSend's program includes at-home blood work, clinician-guided dosing, and ongoing monitoring to keep your levels in the optimal range.",
  images: ["/images/articles/wmremove-transformed-2%20(1).jpeg"],
  tags: ["Most Popular", "Rx"],
  featured: true,
  priority: 320,
  variants: [
    { name: "1 Month Plan", price: 149, salePrice: 199 },
    { name: "3 Month Plan", price: 129, salePrice: 179 },
    { name: "12 Month Plan", price: 99, salePrice: 149 },
  ],
  attributes: {
    detailPage: {
      overviewTitle: "About Testosterone Replacement Therapy",
      overviewBody:
        "Testosterone Replacement Therapy (TRT) is a clinician-guided treatment for men with clinically low testosterone (hypogonadism). By restoring testosterone to optimal levels (typically 600–900 ng/dL), TRT addresses the root cause of symptoms like fatigue, low libido, brain fog, mood changes, and loss of muscle mass. HealSend members raise total T levels at twice the speed of monitor-and-wait clinics within 90 days.",
      benefitsTitle: "Key Benefits",
      benefits: [
        "Restores testosterone to optimal levels (600–900 ng/dL range)",
        "Boosts energy, stamina, and reduces chronic fatigue",
        "Supports lean muscle growth and strength recovery",
        "Enhances mood, motivation, and mental clarity",
        "Promotes healthy libido and sexual function",
        "Improves sleep quality and stress resilience",
        "At-home blood draw and lab work included in all plans",
        "Average increase of +418 ng/dL within 90 days",
        "96.8% of members report improvement by week 6",
      ],
      howTitle: "How It Works",
      howSteps: [
        {
          title: "At-Home Lab Work",
          desc: "Complete an at-home blood draw kit to check your total testosterone, free T, SHBG, estradiol, and full metabolic panel — no clinic visit needed.",
          icon: "biotech",
        },
        {
          title: "Clinician Review & Rx",
          desc: "A licensed provider reviews your labs and symptoms, determines your protocol, and ships your prescription with everything you need — free 48-hour delivery.",
          icon: "medical_services",
        },
        {
          title: "Ongoing Optimization",
          desc: "Regular follow-up labs, unlimited clinician messaging, and dose adjustments to keep your levels dialed in. 91% of members stay past 90 days.",
          icon: "tune",
        },
      ],
      safetyTitle: "Safety Information",
      safetyItems: [
        {
          icon: "warning",
          colorClass: "text-amber-500",
          title: "Important Safety Information",
          body: "TRT requires a prescription and confirmed low testosterone via blood work. May affect fertility by suppressing natural testosterone production. Not appropriate for men actively trying to conceive — consider enclomiphene as a fertility-preserving alternative. Regular lab monitoring is required.",
        },
        {
          icon: "info",
          colorClass: "text-blue-500",
          title: "What to Expect",
          body: "Weeks 2–4: improved energy, mood, and motivation. Weeks 4–8: noticeable strength gains, better sleep, increased libido. Weeks 8–12: full optimization with lab-confirmed levels in target range. Your clinician adjusts dosing based on your response and bloodwork.",
        },
        {
          icon: "verified_user",
          colorClass: "text-emerald-500",
          title: "Quality & Monitoring",
          body: "Pharmaceutical-grade testosterone cypionate compounded in U.S. pharmacies. At-home blood draw included — no clinic visits. Free shipping with syringes and supplies. Unlimited clinician messaging. FSA & HSA eligible. Cancel anytime.",
        },
      ],
    },
  },
};

async function main() {
  console.log("Seeding TRT & Enclomiphene products...\n");

  const category = await prisma.category.findFirst({
    where: { slug: { in: ["anti-aging", "sexual-health"] } },
    orderBy: { priority: "asc" },
  });
  const brand = await prisma.brand.findUnique({
    where: { slug: "healsend" },
  });

  if (!category || !brand) {
    console.log("  ⚠ Required category or brand not found — run seed-dev-data first.");
    return;
  }

  for (const product of [ENCLOMIPHENE, TRT]) {
    const upserted = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        images: product.images,
        tags: product.tags,
        featured: product.featured,
        priority: product.priority,
        attributes: product.attributes,
        categoryId: category.id,
        brandId: brand.id,
      },
      create: {
        name: product.name,
        slug: product.slug,
        type: "VARIABLE",
        published: true,
        featured: product.featured,
        shortDescription: product.shortDescription,
        description: product.description,
        regularPrice: product.variants[0]?.salePrice ?? null,
        salePrice: product.variants[0]?.price ?? null,
        inStock: true,
        images: product.images,
        tags: product.tags,
        categoryId: category.id,
        brandId: brand.id,
        priority: product.priority,
        attributes: product.attributes,
      },
    });

    await prisma.productVariant.deleteMany({
      where: { productId: upserted.id },
    });
    await prisma.productVariant.createMany({
      data: product.variants.map((v) => ({
        productId: upserted.id,
        name: v.name,
        price: v.price,
        salePrice: v.salePrice ?? null,
        inStock: true,
      })),
    });

    console.log(`  ✓ Upserted "${product.name}" with detailPage content`);
  }

  console.log("\nDone!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
