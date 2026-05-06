import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCT_DETAILS = [
  {
    slug: "nad-injections",
    attributes: {
      detailPage: {
        overviewTitle: "About NAD+ Injections",
        overviewBody:
          "NAD+ is a coenzyme present in every cell that powers over 500 biological processes — from energy production and DNA repair to brain function and healthy aging. By age 40, your NAD+ levels can drop by 25–50%. Direct injection delivery is the most efficient method for rapid systemic NAD+ replenishment, bypassing the digestive system entirely for maximum bioavailability.",
        benefitsTitle: "Key Benefits",
        benefits: [
          "Fuels mitochondria and ATP generation for sustained cellular energy",
          "Supports DNA repair from daily oxidative damage",
          "Enhances fat burning, insulin sensitivity, and metabolic control",
          "Balances neurotransmitters and protects neurons for sharper focus",
          "Clears brain fog and sharpens mental clarity",
          "Reduces oxidative stress and muscle soreness for faster recovery",
          "Improves sleep quality and stress resilience",
          "Activates sirtuins — longevity proteins linked to healthy aging",
          "Enhances mitochondrial and metabolic repair pathways",
        ],
        howTitle: "How It Works",
        howSteps: [
          {
            title: "Medical Consultation",
            desc: "Complete a quick online application and meet with a licensed provider to determine your treatment eligibility.",
            icon: "edit_note",
          },
          {
            title: "Home Delivery",
            desc: "Receive your custom NAD+ prescription shipped directly to your door with free expedited shipping, syringes, and alcohol wipes included.",
            icon: "local_shipping",
          },
          {
            title: "Ongoing Support",
            desc: "Access 24/7 medical support with regular check-ins and continuous treatment optimization from U.S.-based health experts.",
            icon: "support_agent",
          },
        ],
        safetyTitle: "Safety Information",
        safetyItems: [
          {
            icon: "warning",
            colorClass: "text-amber-500",
            title: "Important Safety Information",
            body: "NAD+ injections require a prescription. A licensed provider will review your health profile. Most patients inject two to three times weekly. Side effects are mild and rare when supervised by a healthcare provider.",
          },
          {
            icon: "info",
            colorClass: "text-blue-500",
            title: "What to Expect",
            body: "Most patients feel a difference within 2–3 weeks. Deeper benefits like anti-aging support may take 6–8 weeks. NAD+ is compatible with NMN, glutathione, and other therapies. Self-injection at home after proper training.",
          },
          {
            icon: "verified_user",
            colorClass: "text-emerald-500",
            title: "Quality Assurance",
            body: "1200mg (5mL vial) standard dose. Third-party tested for potency, sterility, endotoxicity, and pH balance. Compounded in FDA/DEA-registered U.S. pharmacies. FSA & HSA eligible. Shelf life 6–12 months when refrigerated.",
          },
        ],
      },
    },
  },
  {
    slug: "nad-nasal-spray",
    attributes: {
      detailPage: {
        overviewTitle: "About NAD+ Nasal Spray",
        overviewBody:
          "HealSend NAD+ Nasal Spray delivers pharmaceutical-grade nicotinamide adenine dinucleotide directly into your bloodstream and brain via the nasal mucosa. The nasal mucosa offers a direct pathway to the central nervous system through the olfactory region, bypassing the digestive system for near-instant NAD+ delivery to the brain. Onset in 5–10 minutes with 70–80% bioavailability — no needles required.",
        benefitsTitle: "Key Benefits",
        benefits: [
          "Fast NAD+ elevation for mitochondrial activation within minutes",
          "Sharpens focus and clears brain fog — mental reset within 30 minutes",
          "Steady, all-day cellular energy support without crashes or jitters",
          "Supports recovery from workouts and extended periods of exertion",
          "Helps restore NAD+ levels depleted by stress and aging",
          "High bioavailability with no digestive loss — 70–80% absorption",
          "Improves sleep quality and stress tolerance",
          "Supports DNA repair processes and sirtuin activation for longevity",
          "Reduces fine lines and wrinkles through enhanced cellular repair",
        ],
        howTitle: "How It Works",
        howSteps: [
          {
            title: "Application & Consultation",
            desc: "Complete a quick form and meet with a licensed medical provider 100% online to determine treatment eligibility.",
            icon: "edit_note",
          },
          {
            title: "Medication Delivery",
            desc: "Receive your custom prescription shipped directly to your door with free expedited 2-day shipping.",
            icon: "local_shipping",
          },
          {
            title: "Ongoing Support",
            desc: "Access 24/7 support with regular check-ins, on-demand medical assistance, and no-cost consultations for treatment optimization.",
            icon: "support_agent",
          },
        ],
        safetyTitle: "Safety Information",
        safetyItems: [
          {
            icon: "warning",
            colorClass: "text-amber-500",
            title: "Important Safety Information",
            body: "NAD+ Nasal Spray requires a prescription. A licensed provider will review your health profile and determine eligibility. Not appropriate for everyone — your provider will assess your specific needs.",
          },
          {
            icon: "info",
            colorClass: "text-blue-500",
            title: "Delivery Comparison",
            body: "Nasal spray onset: 5–10 min (70–80% bioavailability). SubQ injection: 10–15 min (85–90%). IV drips: 30–45 min (90–95%). Oral capsules: 1–2 hrs (<20%). Nasal delivery provides the fastest non-injection NAD+ pathway to the brain.",
          },
          {
            icon: "verified_user",
            colorClass: "text-emerald-500",
            title: "Quality Assurance",
            body: "Pharmaceutical-grade purity. Potency tested every 3–6 months. Sterility testing meets USP <797> standards. Endotoxin testing meets USP <85> compliance. Lab-tested by FDA and DEA registered laboratories. FSA & HSA eligible.",
          },
        ],
      },
    },
  },
  {
    slug: "pt-141-nasal-spray",
    attributes: {
      detailPage: {
        overviewTitle: "About PT-141 Nasal Spray",
        overviewBody:
          "PT-141 (Bremelanotide) is a brain-based solution for enhanced arousal and intimacy. Unlike traditional ED medications that work on blood flow, PT-141 activates melanocortin receptors in the central nervous system — targeting the neurochemical pathways of desire itself. Effective for both men and women, with effects typically beginning within one hour.",
        benefitsTitle: "Key Benefits",
        benefits: [
          "Increases sexual desire and responsiveness at the neurochemical level",
          "Enhances mood, confidence, and emotional intimacy",
          "Works rapidly — effects typically begin within 45–90 minutes",
          "Non-hormonal mechanism targets desire, not just blood flow",
          "Doctor-supervised with personalized dosing guidance",
          "Improves physical arousal and blood flow",
          "Effective for both men and women",
          "Discreet nasal spray delivery — no injections needed",
        ],
        howTitle: "How It Works",
        howSteps: [
          {
            title: "Complete Your Application",
            desc: "Answer health questions and consult with a licensed provider online to determine your eligibility.",
            icon: "edit_note",
          },
          {
            title: "Prescription Delivered",
            desc: "Receive your custom PT-141 prescription shipped free to your door within 48 hours in discreet packaging.",
            icon: "local_shipping",
          },
          {
            title: "Ongoing Care",
            desc: "Access unlimited video calls with licensed clinicians, medical assistance hotline, and guaranteed on-time refills.",
            icon: "support_agent",
          },
        ],
        safetyTitle: "Safety Information",
        safetyItems: [
          {
            icon: "warning",
            colorClass: "text-amber-500",
            title: "Important Safety Information",
            body: "PT-141 requires a prescription. Safety assessment includes blood pressure, heart history, medications, and allergies. Not appropriate for everyone. Maximum one dose per 24-hour period; monthly limits apply as directed by your clinician.",
          },
          {
            icon: "info",
            colorClass: "text-blue-500",
            title: "Dosing & Timing",
            body: "Standard dosing is 1.75mg as needed, minimum 45 minutes before sexual activity. Effects typically occur within 45–90 minutes. Maximum eight doses monthly. Do not exceed one dose in 24 hours. Your clinician will provide personalized timing guidance.",
          },
          {
            icon: "verified_user",
            colorClass: "text-emerald-500",
            title: "Quality Assurance",
            body: "Potency confirmed within ±10% active ingredient concentration. Sterility tested to USP 797 standards. Endotoxicity below USP 85 thresholds. Compounded through FDA/DEA-registered labs with third-party quality control. FSA & HSA eligible.",
          },
        ],
      },
    },
  },
];

const MIC_PRODUCT = {
  name: "MIC+B12 Injections",
  slug: "mic-injection",
  shortDescription:
    "Lipotropic support with B12 for metabolism, energy, fat burning, and liver health.",
  description:
    "MIC+B12 combines methionine, inositol, choline, and vitamin B12 to support liver function, convert fat to energy, and sustain focus without crashes. A doctor-supervised metabolic support protocol designed for steady, sustainable results.",
  images: ["/images/peptides-20260506T071409Z-3-001/peptides/peptides/MIC+B12.png"],
  tags: ["Fat-Burning", "Rx"],
  featured: false,
  priority: 240,
  variants: [
    { name: "1 Month Plan", price: 99, salePrice: 119 },
    { name: "3 Month Plan", price: 119, salePrice: 129 },
  ],
  attributes: {
    detailPage: {
      overviewTitle: "About MIC+B12 Injections",
      overviewBody:
        "MIC+B12 combines four powerful metabolic agents — Methionine (liver detox, prevents fat accumulation), Inositol (regulates insulin, stabilizes cell membranes), Choline (exports triglycerides from liver), and Vitamin B12 (ATP synthesis, clean energy boost). Together they support liver function, accelerate fat conversion to energy, and deliver sustained focus without crashes or jitters.",
      benefitsTitle: "Key Benefits",
      benefits: [
        "Boosts fat metabolism and accelerates lipolysis",
        "Clean, sustained energy from B12-powered ATP synthesis",
        "Enhances focus and physical performance without jitters",
        "Supports liver health and detoxification pathways",
        "Promotes steady, sustainable fat loss results",
        "Stabilizes insulin and cell membrane function via Inositol",
        "Prevents fat accumulation through Methionine liver support",
        "Exports triglycerides from the liver via Choline",
      ],
      howTitle: "How It Works",
      howSteps: [
        {
          title: "Online Consultation",
          desc: "Complete a quick form and consult with a licensed provider to determine your treatment eligibility.",
          icon: "edit_note",
        },
        {
          title: "Prescription Shipped Free",
          desc: "Receive your MIC+B12 prescription shipped directly to your door with free expedited 2-day shipping.",
          icon: "local_shipping",
        },
        {
          title: "Ongoing Support",
          desc: "Access 24/7 support with regular check-ins and on-demand medical assistance throughout your treatment.",
          icon: "support_agent",
        },
      ],
      safetyTitle: "Safety Information",
      safetyItems: [
        {
          icon: "warning",
          colorClass: "text-amber-500",
          title: "Important Safety Information",
          body: "MIC+B12 injections require a prescription. A licensed provider will review your health profile. All components (methionine, inositol, choline, B12) are naturally occurring nutrients essential to metabolism. Formulations are preservative-free and sterile.",
        },
        {
          icon: "info",
          colorClass: "text-blue-500",
          title: "Treatment Protocol",
          body: "Initiation phase: 0.5mL 1–2× weekly for tolerance assessment. Optimization: 1mL 2–3× weekly to activate lipolysis. Maintenance: 1mL weekly to sustain results. Most patients see energy and focus improvements within 1–2 weeks; visible fat loss by week 4–6.",
        },
        {
          icon: "verified_user",
          colorClass: "text-emerald-500",
          title: "Quality Assurance",
          body: "Compounded in U.S. pharmacies under strict quality controls. Compatible with GLP-1, NAD+, and peptide protocols for synergistic stacking. Self-administration at home after telehealth approval and training. FSA & HSA eligible.",
        },
      ],
    },
  },
};

async function main() {
  console.log("Seeding product detail page content...\n");

  // Update existing products with detailPage attributes
  for (const product of PRODUCT_DETAILS) {
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (!existing) {
      console.log(`  ⚠ Product "${product.slug}" not found in DB — skipping.`);
      continue;
    }

    const currentAttrs =
      existing.attributes && typeof existing.attributes === "object"
        ? existing.attributes
        : {};

    await prisma.product.update({
      where: { slug: product.slug },
      data: {
        attributes: {
          ...currentAttrs,
          ...product.attributes,
        },
      },
    });

    console.log(`  ✓ Updated detailPage for "${product.slug}"`);
  }

  // Upsert MIC+B12 product (may not exist yet)
  const micCategory = await prisma.category.findUnique({
    where: { slug: "anti-aging" },
  });
  const brand = await prisma.brand.findUnique({
    where: { slug: "healsend" },
  });

  if (!micCategory || !brand) {
    console.log(
      "\n  ⚠ Category 'anti-aging' or brand 'healsend' not found — run seed-dev-data first."
    );
  } else {
    const mic = await prisma.product.upsert({
      where: { slug: MIC_PRODUCT.slug },
      update: {
        name: MIC_PRODUCT.name,
        shortDescription: MIC_PRODUCT.shortDescription,
        description: MIC_PRODUCT.description,
        images: MIC_PRODUCT.images,
        tags: MIC_PRODUCT.tags,
        featured: MIC_PRODUCT.featured,
        priority: MIC_PRODUCT.priority,
        attributes: MIC_PRODUCT.attributes,
        categoryId: micCategory.id,
        brandId: brand.id,
      },
      create: {
        name: MIC_PRODUCT.name,
        slug: MIC_PRODUCT.slug,
        type: "VARIABLE",
        published: true,
        featured: MIC_PRODUCT.featured,
        shortDescription: MIC_PRODUCT.shortDescription,
        description: MIC_PRODUCT.description,
        regularPrice: MIC_PRODUCT.variants[0]?.salePrice ?? null,
        salePrice: MIC_PRODUCT.variants[0]?.price ?? null,
        inStock: true,
        images: MIC_PRODUCT.images,
        tags: MIC_PRODUCT.tags,
        categoryId: micCategory.id,
        brandId: brand.id,
        priority: MIC_PRODUCT.priority,
        attributes: MIC_PRODUCT.attributes,
      },
    });

    // Recreate variants for MIC
    await prisma.productVariant.deleteMany({
      where: { productId: mic.id },
    });
    await prisma.productVariant.createMany({
      data: MIC_PRODUCT.variants.map((v) => ({
        productId: mic.id,
        name: v.name,
        price: v.price,
        salePrice: v.salePrice ?? null,
        inStock: true,
      })),
    });

    console.log(`  ✓ Upserted MIC+B12 product with detailPage content`);
  }

  console.log("\nDone!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
