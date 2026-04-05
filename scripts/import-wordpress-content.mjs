import { spawnSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const config = {
  sshHost: process.env.WORDPRESS_SSH_HOST,
  sshPort: process.env.WORDPRESS_SSH_PORT || "6543",
  sshUser: process.env.WORDPRESS_SSH_USER || "root",
  dbContainer: process.env.WORDPRESS_DB_CONTAINER || "wp-mysql-prod",
  dbName: process.env.WORDPRESS_DB_NAME || "wordpress",
  dbUser: process.env.WORDPRESS_DB_USER,
  dbPassword: process.env.WORDPRESS_DB_PASSWORD,
  siteUrl: process.env.WORDPRESS_SITE_URL || "https://healsend.com",
  uploadsBaseUrl:
    process.env.WORDPRESS_ASSET_BASE_URL ||
    "https://healsend.com/wp-content/uploads",
};

const CATEGORY_GROUPS = [
  {
    slug: "weight-loss",
    name: "Weight Loss",
    matches: new Set(["medication", "249", "250", "weight-loss", "glp-1"]),
  },
  {
    slug: "sexual-health",
    name: "Sexual Health",
    matches: new Set(["pt_141", "oxytocin", "ed-meds", "sexual-health"]),
  },
  {
    slug: "anti-aging",
    name: "Anti-aging",
    matches: new Set([
      "nad-therapy",
      "nadglutathione",
      "glutathione",
      "anti-aging",
    ]),
  },
  {
    slug: "strength-recovery",
    name: "Strength & Recovery",
    matches: new Set([
      "sermorelin-therapy",
      "hrt-lite",
      "enclomiphene",
      "strength-recovery",
    ]),
  },
  {
    slug: "sleep",
    name: "Sleep",
    matches: new Set(["sleep"]),
  },
];

const PAGE_SLUG_MAP = {
  home: "home",
  "glp-1-weight-loss": "weight-loss",
  "glp-1-form": "weight-loss",
  nad: "nad",
  "nad-injections": "nad",
  "nad-therapy": "nad",
  "pt-141": "sexual-health",
  "pt-141-sexual-wellness-peptide-therapy-online": "sexual-health",
  sermorelin: "strength-recovery",
  "sermorelin-therapy": "strength-recovery",
};

const PRODUCT_ICON_NAMES = ["Zap", "Droplet", "Syringe"];
const SUPPORT_ICON_NAMES = ["Target", "TrendingUp", "Hourglass"];
const CLEAN_INGREDIENT_ICON_NAMES = [
  "Rabbit",
  "TreePine",
  "Ban",
  "FlaskConical",
  "Sparkles",
  "Wheat",
];

function assertImportConfig() {
  const missing = [];

  if (!config.sshHost) missing.push("WORDPRESS_SSH_HOST");
  if (!config.dbUser) missing.push("WORDPRESS_DB_USER");
  if (!config.dbPassword) missing.push("WORDPRESS_DB_PASSWORD");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

function runRemoteMysql(query) {
  const remoteTarget = `${config.sshUser}@${config.sshHost}`;
  const remoteCommand = [
    "docker",
    "exec",
    "-i",
    config.dbContainer,
    "mysql",
    "--batch",
    "--raw",
    "--skip-column-names",
    `-u${config.dbUser}`,
    `-p${config.dbPassword}`,
    config.dbName,
  ];

  const result = spawnSync(
    "ssh",
    ["-p", config.sshPort, remoteTarget, remoteCommand.join(" ")],
    {
      encoding: "utf8",
      input: query,
      maxBuffer: 1024 * 1024 * 256,
    },
  );

  if (result.status !== 0) {
    throw new Error(
      `Remote MySQL query failed: ${result.stderr || result.stdout || "unknown error"}`,
    );
  }

  return result.stdout
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);
}

function decodeBase64(value) {
  if (!value) {
    return "";
  }

  try {
    return Buffer.from(String(value).replace(/\s+/g, ""), "base64").toString(
      "utf8",
    );
  } catch {
    return "";
  }
}

function parseRows(lines, mapper) {
  return lines.map((line) => mapper(line.split("\t")));
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeJsonParse(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function escapeSqlString(value) {
  return String(value || "").replace(/'/g, "''");
}

function parseNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseInteger(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function canonicalAssetUrl(filePath, fallbackUrl) {
  if (filePath) {
    return `${config.uploadsBaseUrl.replace(/\/$/, "")}/${filePath.replace(/^\/+/, "")}`;
  }

  return fallbackUrl || null;
}

function extractUploadUrls(text) {
  const matches = String(text || "").match(
    /https?:\/\/[^"'()\s]+\/wp-content\/uploads\/[^"'()\s]+/g,
  );

  return matches || [];
}

function normalizeRemoteUploadUrl(url) {
  const match = String(url || "").match(/\/wp-content\/uploads\/(.+)$/);
  if (!match) {
    return url;
  }

  return `${config.uploadsBaseUrl.replace(/\/$/, "")}/${match[1].replace(/^\/+/, "")}`;
}

function parseHighlights(text) {
  const cleaned = stripHtml(text);
  if (!cleaned) {
    return [];
  }

  return [...new Set(
    cleaned
      .split(/[,•\n]/)
      .map((part) => part.replace(/\s+/g, " ").trim())
      .filter(Boolean),
  )].slice(0, 6);
}

function summarizeText(title, excerpt, content) {
  const excerptHighlights = parseHighlights(excerpt);
  if (excerptHighlights.length > 0) {
    return excerptHighlights[0];
  }

  const contentText = stripHtml(content);
  if (contentText) {
    return contentText.slice(0, 220);
  }

  return title;
}

function resolveCategoryGroup(termSlugs, termNames) {
  for (const group of CATEGORY_GROUPS) {
    if (termSlugs.some((slug) => group.matches.has(slug))) {
      return {
        slug: group.slug,
        name: group.name,
      };
    }
  }

  const fallbackSlug = termSlugs[0] || slugify(termNames[0] || "treatments");
  const fallbackName = termNames[0] || "Treatments";

  return {
    slug: fallbackSlug,
    name: fallbackName,
  };
}

function getPageType(slug, linkedProductId, linkedCategoryId) {
  if (slug === "home") {
    return "HOME";
  }

  if (linkedProductId) {
    return "PRODUCT";
  }

  if (linkedCategoryId) {
    return "CATEGORY";
  }

  return "CUSTOM";
}

function buildCategoryPageContent({ category, page, heroImage }) {
  const description =
    stripHtml(page?.excerpt) ||
    stripHtml(page?.contentHtml) ||
    category.description ||
    `Explore ${category.name.toLowerCase()} treatment options with clinician review, transparent pricing, and home delivery.`;

  const highlights = parseHighlights(page?.excerpt || page?.contentHtml);

  return {
    eyebrow: category.name,
    title: page?.title || `${category.name} care built for real life.`,
    description,
    highlights:
      highlights.length > 0
        ? highlights
        : [
            "Transparent pricing",
            "Licensed clinician review",
            "Medication delivered discreetly",
          ],
    ctaText: "Get started",
    heroImage: heroImage || category.image || null,
  };
}

function buildProductMarketingContent({
  product,
  page,
  relatedProducts,
}) {
  const summary = stripHtml(page?.excerpt) || stripHtml(product.shortDescription);
  const bullets = parseHighlights(summary);
  const description =
    stripHtml(page?.contentHtml) ||
    stripHtml(product.description) ||
    stripHtml(product.shortDescription);
  const featureParagraphs =
    description.length > 0
      ? [
          description,
          `${product.name} is reviewed by a licensed clinician and paired with an ongoing plan based on your goals and response.`,
        ]
      : [
          `${product.name} is designed to support your goals with clinician-guided treatment and transparent monthly pricing.`,
        ];

  const benefits = (bullets.length > 0 ? bullets : [
    `Provider-guided support tailored to ${product.name.toLowerCase()}.`,
    "Transparent monthly pricing with no hidden fees.",
    "Home delivery with ongoing follow-up care.",
  ]).slice(0, 3).map((text, index) => ({
    iconName: PRODUCT_ICON_NAMES[index % PRODUCT_ICON_NAMES.length],
    text,
  }));

  const supportFeatures = (bullets.length > 0 ? bullets : [
    "Support your goals with a structured clinician-reviewed plan.",
    "Choose from monthly or longer-term options.",
    "Stay on track with easy refill and follow-up support.",
  ]).slice(0, 3).map((text, index) => ({
    iconName: SUPPORT_ICON_NAMES[index % SUPPORT_ICON_NAMES.length],
    title: text,
    description: text,
  }));

  const carouselImages = [
    product.images?.[0],
    ...relatedProducts.map((relatedProduct) => relatedProduct.images?.[0]),
  ].filter(Boolean);

  return {
    slug: product.slug,
    name: product.name,
    image: product.images?.[0] || null,
    inStock: product.inStock,
    summary,
    heroTitle: page?.title || product.name,
    benefitsCarouselTitle: `What are the benefits of ${product.name}?`,
    tabs: {
      benefits,
      description,
    },
    faqs: [
      {
        question: `What is ${product.name}?`,
        answer:
          description ||
          `${product.name} is a clinician-guided treatment available through HealSend.`,
      },
      {
        question: "How does pricing work?",
        answer:
          "Pricing depends on the plan duration your provider recommends. You will see the available options before checkout.",
      },
      {
        question: "How do I get started?",
        answer:
          "Complete the online intake, review with a licensed clinician, and receive your medication at home if prescribed.",
      },
    ],
    featureSection: {
      title: `${product.name} support designed around how you feel and perform.`,
      description: featureParagraphs,
      image: product.images?.[0] || null,
    },
    supportSection: {
      title: "Built for clear next steps and ongoing support.",
      subtitle:
        "Your plan starts online, is reviewed by a licensed clinician, and stays easy to manage month to month.",
      features: supportFeatures,
    },
    benefitsCarousel: carouselImages.slice(0, 4).map((image, index) => ({
      image,
      text:
        bullets[index] ||
        `${product.name} is delivered through a structured care plan designed around your goals.`,
    })),
    researchSection: {
      title: `What to know about ${product.name}`,
      image: product.images?.[0] || null,
      points:
        bullets.length > 0
          ? bullets
          : [
              "Clinician-guided treatment",
              "Transparent pricing options",
              "Ongoing refill and follow-up support",
            ],
    },
    labTestedSection: {
      title: "Medication sourced through licensed pharmacy partners.",
      description:
        "If prescribed, your treatment is fulfilled through a licensed pharmacy in our network and shipped directly to your door.",
      image: product.images?.[0] || null,
    },
    pricingHighlights: [
      "Transparent monthly pricing",
      "Clinician-guided plans",
      "At-home delivery",
      "Ongoing refill support",
    ],
    simpleSteps: [
      {
        step: 1,
        title: "Complete your intake online",
        description:
          "Answer a few questions about your goals, symptoms, and history so a licensed clinician can review the right next steps.",
        image:
          product.images?.[0] ||
          relatedProducts[0]?.images?.[0] ||
          null,
        imageContainerClass:
          "mt-auto flex h-[220px] w-full items-end justify-center",
        imageClass: "h-[90%] w-auto object-contain object-bottom",
      },
      {
        step: 2,
        title: "Review your treatment options",
        description:
          "If eligible, you will see the treatment plan and pricing options that match your care path before checkout.",
        image:
          relatedProducts[0]?.images?.[0] ||
          product.images?.[0] ||
          null,
        imageContainerClass:
          "mt-auto flex h-[220px] w-full items-center justify-center",
        imageClass: "h-[65%] w-auto object-contain",
      },
      {
        step: 3,
        title: "Receive treatment and ongoing support",
        description:
          "Medication is shipped to your door through licensed pharmacy partners, with easy refills and follow-up care built in.",
        image:
          relatedProducts[1]?.images?.[0] ||
          product.images?.[0] ||
          null,
        imageContainerClass:
          "mt-auto -ml-8 flex h-[220px] w-[calc(100%+4rem)] items-end justify-center",
        imageClass: "h-full w-full rounded-b-[2rem] object-cover object-top",
      },
    ],
    comprehensiveCare: {
      title: `Comprehensive ${product.name} care, not just a prescription.`,
      description:
        "Your plan is designed to stay easy from intake to refills, with clinician review, clear pricing, and ongoing support.",
      introLabel: "HealSend",
      introText:
        "We pair treatment access with guidance, pharmacy fulfillment, and follow-up care so your plan keeps fitting real life after you start.",
      ctaText: `Start Your ${product.name} Journey`,
      features: [
        {
          title: "Clinician Review",
          points: [
            "Licensed provider review before treatment starts",
            "Plans adjusted around your goals and response",
          ],
          image:
            product.images?.[0] ||
            relatedProducts[0]?.images?.[0] ||
            null,
          imageClass:
            "absolute bottom-0 right-6 h-32 w-32 rounded-t-2xl border-4 border-white object-cover shadow-lg md:h-40 md:w-40",
        },
        {
          title: "Simple Ongoing Support",
          points: [
            "Easy reorders and refill continuity",
            "Clear next steps if you have questions",
          ],
          image:
            relatedProducts[0]?.images?.[0] ||
            product.images?.[0] ||
            null,
          imageClass:
            "absolute bottom-6 right-6 aspect-square w-28 rounded-full border-4 border-white object-cover shadow-xl md:w-36",
        },
        {
          title: "Delivered to Your Door",
          points: [
            "Licensed pharmacy fulfillment",
            "Discreet shipping built into the care experience",
          ],
          image:
            relatedProducts[1]?.images?.[0] ||
            product.images?.[0] ||
            null,
          imageClass:
            "absolute bottom-2 right-2 w-32 object-contain mix-blend-multiply md:w-48",
        },
        {
          title: "Transparent Pricing",
          points: [
            "Monthly and multi-month plan options",
            "No hidden steps between eligibility and checkout",
          ],
          image:
            product.images?.[0] ||
            relatedProducts[1]?.images?.[0] ||
            null,
          imageClass:
            "absolute bottom-6 right-6 aspect-square w-28 rounded-full border-4 border-white object-cover shadow-xl md:w-36",
        },
      ],
    },
    cleanIngredients: CLEAN_INGREDIENT_ICON_NAMES.map((iconName, index) => ({
      iconName,
      name:
        [
          "Clinician Reviewed",
          "Discreet Delivery",
          "Transparent Pricing",
          "Flexible Plans",
          "Follow-up Support",
          "Easy Reorders",
        ][index],
    })),
    relatedProducts: relatedProducts.map((relatedProduct) => ({
      id: relatedProduct.slug,
      name: relatedProduct.name,
      image: relatedProduct.images?.[0] || null,
    })),
    sourceExcerpt: summary,
  };
}

function buildHomePageContent(categoriesBySlug) {
  const weightLoss = categoriesBySlug.get("weight-loss");
  const sexualHealth = categoriesBySlug.get("sexual-health");
  const antiAging = categoriesBySlug.get("anti-aging");
  const weightLossProducts = weightLoss?.products || [];
  const sexualHealthProducts = sexualHealth?.products || [];
  const antiAgingProducts = antiAging?.products || [];

  return {
    hero: {
      phrases: [
        { text: "Weight Loss,", color: "#7B75F0" },
        { text: "Sharper Mind,", color: "#2F5EFF" },
        { text: "More Energy,", color: "#7B68EE" },
        { text: "100% Online,", color: "#000000" },
        { text: "Stronger Body,", color: "#485867" },
        { text: "Better Sex,", color: "#8b2020" },
      ],
      subtitle: "we got you",
      description: "Personalized Medications for You",
      row1: [
        {
          title: "Lose weight",
          highlight: "weight",
          image: weightLoss?.products?.[0]?.images?.[0] || "/photoroom-0.png",
          href: "/weight-loss",
          hoverGradient: "bg-[radial-gradient(circle,#6084ff_0%,#4064df_100%)]",
        },
        {
          title: "Oral GLP-1",
          highlight: "GLP-1",
          image: "/Photoroom-1.png",
          href: "/weight-loss",
          hoverGradient: "bg-[radial-gradient(circle,#7b65f0_0%,#5b45d0_100%)]",
        },
        {
          title: "Recharge with NAD+",
          highlight: "NAD+",
          image: antiAging?.products?.[0]?.images?.[0] || "/photoroom-2.png",
          href: "/nad",
          hoverGradient: "bg-[radial-gradient(circle,#40a5f5_0%,#2085d5_100%)]",
        },
        {
          title: "Have Better Sex",
          highlight: "Better Sex",
          image: sexualHealth?.products?.[0]?.images?.[0] || "/photoroom-3.png",
          href: "/sexual-health",
          hoverGradient: "bg-[radial-gradient(circle,#e63946_0%,#c61926_100%)]",
        },
      ],
      row2: [
        {
          title: "Heal & Recover",
          highlight: "Recover",
          image: "/photoroom-4.png",
          href: "/onboarding/growth-hormone-support",
          hoverGradient: "bg-[radial-gradient(circle,#12b379_0%,#0e8a5d_100%)]",
        },
        {
          title: "Explore Treatments",
          highlight: "Treatments",
          href: "/shop",
          hoverGradient: "bg-[radial-gradient(circle,#d4d1ff_0%,#9a95f0_100%)]",
          icon: "search",
        },
        {
          title: "Age Well",
          highlight: "Well",
          image: "/photoroom-6.png",
          href: "/anti-aging",
          hoverGradient: "bg-[radial-gradient(circle,#ffc107_0%,#f59e0b_100%)]",
        },
      ],
    },
    banners: [
      {
        title: "Lose weight Fast with GLP-1s online",
        subtitle: "Licensed Providers • No Hidden Fees",
        buttonText: "Qualify in 1 minute",
        buttonHref: "/weight-loss",
        image: "/wmremove-transformed-2-1.jpeg",
      },
      {
        title: "Activate arousal — safe, fast, and reliable.",
        subtitle: "Discreet • Licensed Providers • No Hidden Fees",
        buttonText: "Qualify in 1 minute",
        buttonHref: "/sexual-health",
        video: "/coup_l.mp4",
      },
      {
        title: "Better Energy, Focus, and Vitality. Backed by Science.",
        secondTitle: "Personalized for you",
        buttonText: "Learn more",
        buttonHref: "/anti-aging",
        image: "/befv.webp",
      },
    ],
    splitFeatures: {
      cards: [
        {
          title: "No one-size-fits-all",
          description:
            stripHtml(weightLoss?.description) ||
            "A licensed provider reviews your goals and history so your plan can be shaped around your body, not forced into a generic program.",
          ctaText: "Get started",
          ctaHref: "/weight-loss",
          variant: "solid",
          accentText: "it's personal",
        },
        {
          title: "Moving in the\nright direction",
          description:
            stripHtml(weightLossProducts[0]?.shortDescription) ||
            "Explore plans designed to support steady progress with clinician review, transparent pricing, and delivery to your door.",
          ctaText: "See if I'm eligible",
          ctaHref: "/weight-loss",
          variant: "image",
          image:
            weightLossProducts[0]?.images?.[0] ||
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
          imageAlt: weightLossProducts[0]?.name || "Weight loss treatment",
        },
      ],
    },
    benefitCarousel: {
      title:
        sexualHealthProducts[0]?.name
          ? `Exploring the benefits of ${sexualHealthProducts[0].name}`
          : "Exploring the Benefits of PT-141 Therapy",
      ctaText: "Explore",
      ctaHref: "/sexual-health",
      image:
        sexualHealthProducts[0]?.images?.[0] ||
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1600",
      imageAlt: sexualHealthProducts[0]?.name || "Sexual health treatment",
    },
    categoryGrid: {
      items: [
        {
          title: weightLossProducts[1]?.name || "Oral GLP-1",
          subtitle:
            stripHtml(weightLossProducts[1]?.shortDescription) ||
            "Needle-free appetite control",
          bg: "bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]",
        },
        {
          title: weightLoss?.name || "Metabolic Health",
          subtitle:
            stripHtml(weightLoss?.description) ||
            "GLP-1 + GIP Treatments",
          bg: "bg-gradient-to-br from-[#6366f1] to-[#4f46e5]",
        },
        {
          title: sexualHealth?.name || "Desire & Intimacy",
          subtitle:
            stripHtml(sexualHealth?.description) ||
            "Better Sex",
          bg: "bg-gradient-to-br from-[#7c3aed] to-[#6d28d9]",
        },
        {
          title: sexualHealthProducts[0]?.name || "PT-141 Nasal Spray",
          subtitle:
            stripHtml(sexualHealthProducts[0]?.shortDescription) ||
            "Natural boost in desire & arousal",
          bg: "bg-gradient-to-br from-[#a78bfa] to-[#ec4899]",
        },
        {
          title: antiAgingProducts[0]?.name || "NAD+",
          subtitle:
            stripHtml(antiAgingProducts[0]?.shortDescription) ||
            "Energy & Focus",
          bg: "bg-gradient-to-br from-[#60a5fa] to-[#3b82f6]",
        },
      ],
    },
    blogCarousel: {
      title: "Your guide to health and wellness starts here.",
      description:
        "Imported from the live treatment catalog so the marketing homepage stays in sync with the products people can actually start.",
      posts: [
        {
          title:
            weightLossProducts[0]?.name
              ? `What to know before starting ${weightLossProducts[0].name}`
              : "Telehealth VS In-person Care: The Key Differences You Should Know",
          content:
            summarizeText(
              weightLossProducts[0]?.name || "Telehealth vs in-person care",
              weightLossProducts[0]?.shortDescription,
              weightLossProducts[0]?.description,
            ),
        },
        {
          title:
            sexualHealthProducts[0]?.name
              ? `How ${sexualHealthProducts[0].name} fits into confidential online care`
              : "From Consultation to Prescription: How to Get an Online Prescription Safely",
          content:
            summarizeText(
              sexualHealthProducts[0]?.name || "Online prescription safety",
              sexualHealthProducts[0]?.shortDescription,
              sexualHealthProducts[0]?.description,
            ),
        },
        {
          title:
            antiAgingProducts[0]?.name
              ? `Comparing ${antiAgingProducts[0].name} and other longevity options`
              : "Can I Meds Online? How it Works, & What to Avoid",
          content:
            summarizeText(
              antiAgingProducts[0]?.name || "Compare longevity options",
              antiAgingProducts[0]?.shortDescription,
              antiAgingProducts[0]?.description,
            ),
        },
        {
          title:
            weightLossProducts[2]?.name
              ? `How pricing and plan tiers work for ${weightLossProducts[2].name}`
              : "How Much Semaglutide to Take: Understanding Dosages and Titration",
          content:
            summarizeText(
              weightLossProducts[2]?.name || "Pricing and plan tiers",
              weightLossProducts[2]?.shortDescription,
              weightLossProducts[2]?.description,
            ),
        },
      ],
    },
  };
}

function getFirstProductImage(product) {
  return Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : null;
}

async function fetchProducts() {
  const query = `
    SELECT
      p.ID,
      p.post_name,
      REPLACE(TO_BASE64(COALESCE(p.post_title, '')), '\n', ''),
      REPLACE(TO_BASE64(COALESCE(p.post_excerpt, '')), '\n', ''),
      REPLACE(TO_BASE64(COALESCE(p.post_content, '')), '\n', ''),
      COALESCE(MAX(CASE WHEN pm.meta_key = '_sku' THEN pm.meta_value END), ''),
      COALESCE(MAX(CASE WHEN pm.meta_key = '_thumbnail_id' THEN pm.meta_value END), ''),
      COALESCE(MAX(CASE WHEN pm.meta_key = '_product_image_gallery' THEN pm.meta_value END), ''),
      COALESCE(MAX(CASE WHEN pm.meta_key = '_regular_price' THEN pm.meta_value END), ''),
      COALESCE(MAX(CASE WHEN pm.meta_key = '_sale_price' THEN pm.meta_value END), ''),
      COALESCE(MAX(CASE WHEN pm.meta_key = '_price' THEN pm.meta_value END), ''),
      COALESCE(MAX(CASE WHEN pm.meta_key = '_stock_status' THEN pm.meta_value END), ''),
      COALESCE(MAX(CASE WHEN pm.meta_key = 'stripe_product_id' THEN pm.meta_value END), ''),
      REPLACE(TO_BASE64(COALESCE(MAX(CASE WHEN pm.meta_key = '_hld_subscription_tiers' THEN pm.meta_value END), '')), '\n', ''),
      COALESCE(MAX(CASE WHEN pm.meta_key = '_hld_category_priority' THEN pm.meta_value END), '0'),
      COALESCE(MAX(CASE WHEN pm.meta_key = '_healsend_subscription_product' THEN pm.meta_value END), ''),
      REPLACE(TO_BASE64(COALESCE(MAX(CASE WHEN pm.meta_key = '_product_attributes' THEN pm.meta_value END), '')), '\n', '')
    FROM wp_posts p
    LEFT JOIN wp_postmeta pm
      ON pm.post_id = p.ID
     AND pm.meta_key IN (
       '_sku',
       '_thumbnail_id',
       '_product_image_gallery',
       '_regular_price',
       '_sale_price',
       '_price',
       '_stock_status',
       'stripe_product_id',
       '_hld_subscription_tiers',
       '_hld_category_priority',
       '_healsend_subscription_product',
       '_product_attributes',
       '_yoast_wpseo_title',
       'rank_math_title',
       'aioseo_title',
       '_yoast_wpseo_metadesc',
       'rank_math_description',
       'aioseo_description'
     )
    WHERE p.post_type = 'product'
      AND p.post_status = 'publish'
    GROUP BY p.ID, p.post_name, p.post_title, p.post_excerpt, p.post_content
    ORDER BY p.ID;
  `;

  return parseRows(runRemoteMysql(query), (columns) => ({
    sourceId: parseInteger(columns[0]),
    slug: columns[1],
    title: decodeBase64(columns[2]),
    excerpt: decodeBase64(columns[3]),
    content: decodeBase64(columns[4]),
    sku: columns[5] || null,
    thumbnailId: parseInteger(columns[6]),
    galleryIds: columns[7]
      ? columns[7].split(",").map((value) => parseInteger(value)).filter(Boolean)
      : [],
    regularPrice: parseNumber(columns[8]),
    salePrice: parseNumber(columns[9]),
    price: parseNumber(columns[10]),
    stockStatus: columns[11] || null,
    stripeProductId: columns[12] || null,
    subscriptionTiers: safeJsonParse(decodeBase64(columns[13]), []),
    categoryPriority: parseInteger(columns[14]) ?? 0,
    isSubscriptionProduct: columns[15] === "yes",
    rawAttributes: decodeBase64(columns[16]),
  }));
}

async function fetchProductTaxonomies() {
  const query = `
    SELECT
      p.ID,
      tt.taxonomy,
      t.slug,
      REPLACE(TO_BASE64(COALESCE(t.name, '')), '\n', ''),
      REPLACE(TO_BASE64(COALESCE(tt.description, '')), '\n', '')
    FROM wp_posts p
    JOIN wp_term_relationships tr ON tr.object_id = p.ID
    JOIN wp_term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
    JOIN wp_terms t ON t.term_id = tt.term_id
    WHERE p.post_type = 'product'
      AND p.post_status = 'publish'
      AND tt.taxonomy IN ('product_cat', 'product_tag', 'product_type', 'product_shipping_class')
    ORDER BY p.ID, tt.taxonomy, t.slug;
  `;

  return parseRows(runRemoteMysql(query), (columns) => ({
    productId: parseInteger(columns[0]),
    taxonomy: columns[1],
    slug: columns[2],
    name: decodeBase64(columns[3]),
    description: decodeBase64(columns[4]),
  }));
}

function buildRelevantPageSlugs(products) {
  const slugs = new Set([
    "home",
    ...Object.keys(PAGE_SLUG_MAP),
    ...Object.values(PAGE_SLUG_MAP),
    ...CATEGORY_GROUPS.map((group) => group.slug),
    ...(products || []).map((product) => product.slug).filter(Boolean),
  ]);

  return [...slugs]
    .map((slug) => String(slug || "").trim())
    .filter(Boolean);
}

async function fetchPages(relevantSlugs = []) {
  const batchSize = 20;
  const pages = [];
  let lastSeenId = 0;
  const slugFilter =
    relevantSlugs.length > 0
      ? `AND p.post_name IN (${relevantSlugs
          .map((slug) => `'${escapeSqlString(slug)}'`)
          .join(", ")})`
      : "";

  while (true) {
    const query = `
      SELECT
        p.ID,
        p.post_type,
        p.post_name,
        REPLACE(TO_BASE64(COALESCE(p.post_title, '')), '\n', ''),
        REPLACE(TO_BASE64(COALESCE(p.post_excerpt, '')), '\n', ''),
        REPLACE(TO_BASE64(COALESCE(p.post_content, '')), '\n', ''),
        COALESCE(MAX(CASE WHEN pm.meta_key = '_thumbnail_id' THEN pm.meta_value END), ''),
        REPLACE(TO_BASE64(COALESCE(MAX(CASE WHEN pm.meta_key IN ('_yoast_wpseo_title', 'rank_math_title', 'aioseo_title') THEN pm.meta_value END), '')), '\n', ''),
        REPLACE(TO_BASE64(COALESCE(MAX(CASE WHEN pm.meta_key IN ('_yoast_wpseo_metadesc', 'rank_math_description', 'aioseo_description') THEN pm.meta_value END), '')), '\n', '')
      FROM wp_posts p
      LEFT JOIN wp_postmeta pm
        ON pm.post_id = p.ID
       AND pm.meta_key IN (
         '_thumbnail_id',
         '_yoast_wpseo_title',
         'rank_math_title',
         'aioseo_title',
         '_yoast_wpseo_metadesc',
         'rank_math_description',
         'aioseo_description'
       )
      WHERE p.post_type IN ('page', 'post', 'healsend_product')
        AND p.post_status = 'publish'
        AND p.ID > ${lastSeenId}
        ${slugFilter}
      GROUP BY p.ID, p.post_type, p.post_name, p.post_title, p.post_excerpt, p.post_content
      ORDER BY p.ID
      LIMIT ${batchSize};
    `;

    const batch = parseRows(runRemoteMysql(query), (columns) => ({
      sourceId: parseInteger(columns[0]),
      postType: columns[1],
      slug: columns[2],
      title: decodeBase64(columns[3]),
      excerpt: decodeBase64(columns[4]),
      contentHtml: decodeBase64(columns[5]),
      thumbnailId: parseInteger(columns[6]),
      seoTitle: decodeBase64(columns[7]),
      seoDescription: decodeBase64(columns[8]),
    }));

    if (batch.length === 0) {
      break;
    }

    pages.push(...batch);
    console.log(
      `Fetched page batch ending at source ID ${batch[batch.length - 1].sourceId} (${pages.length} pages/posts total).`,
    );
    lastSeenId = batch[batch.length - 1].sourceId || lastSeenId;

    if (batch.length < batchSize) {
      break;
    }
  }

  return pages;
}

async function fetchAttachments(attachmentIds) {
  const uniqueIds = [...new Set(attachmentIds.filter(Boolean))];
  if (uniqueIds.length === 0) {
    return [];
  }

  const query = `
    SELECT
      p.ID,
      p.post_name,
      REPLACE(TO_BASE64(COALESCE(p.post_title, '')), '\n', ''),
      REPLACE(TO_BASE64(COALESCE(p.post_excerpt, '')), '\n', ''),
      p.post_mime_type,
      COALESCE(pm_file.meta_value, ''),
      COALESCE(p.guid, ''),
      REPLACE(TO_BASE64(COALESCE(pm_alt.meta_value, '')), '\n', ''),
      REPLACE(TO_BASE64(COALESCE(pm_meta.meta_value, '')), '\n', '')
    FROM wp_posts p
    LEFT JOIN wp_postmeta pm_file
      ON pm_file.post_id = p.ID
      AND pm_file.meta_key = '_wp_attached_file'
    LEFT JOIN wp_postmeta pm_alt
      ON pm_alt.post_id = p.ID
      AND pm_alt.meta_key = '_wp_attachment_image_alt'
    LEFT JOIN wp_postmeta pm_meta
      ON pm_meta.post_id = p.ID
      AND pm_meta.meta_key = '_wp_attachment_metadata'
    WHERE p.ID IN (${uniqueIds.join(",")})
    ORDER BY p.ID;
  `;

  return parseRows(runRemoteMysql(query), (columns) => ({
    sourceId: parseInteger(columns[0]),
    slug: columns[1],
    title: decodeBase64(columns[2]),
    excerpt: decodeBase64(columns[3]),
    mimeType: columns[4] || null,
    filePath: columns[5] || null,
    guid: columns[6] || null,
    altText: decodeBase64(columns[7]),
    metadata: safeJsonParse(decodeBase64(columns[8]), null),
  }));
}

async function upsertMediaAssets(attachments, extraUrls) {
  const assetsBySourceId = new Map();
  const assetsByUrl = new Map();

  for (const attachment of attachments) {
    const url = canonicalAssetUrl(attachment.filePath, attachment.guid);
    if (!url) {
      continue;
    }

    const assetData = {
      slug: attachment.slug || null,
      title: attachment.title || null,
      altText: stripHtml(attachment.altText || attachment.excerpt) || null,
      mimeType: attachment.mimeType,
      filePath: attachment.filePath,
      url,
      metadata: attachment.metadata || undefined,
    };

    const existingAsset = await prisma.mediaAsset.findFirst({
      where: {
        OR: [
          ...(attachment.sourceId ? [{ sourceId: attachment.sourceId }] : []),
          { url },
        ],
      },
      select: {
        id: true,
        sourceId: true,
      },
    });

    const asset = existingAsset
      ? await prisma.mediaAsset.update({
          where: { id: existingAsset.id },
          data: {
            ...assetData,
            ...(existingAsset.sourceId
              ? {}
              : attachment.sourceId
                ? { sourceId: attachment.sourceId }
                : {}),
          },
        })
      : await prisma.mediaAsset.create({
          data: {
            source: "wordpress",
            ...(attachment.sourceId ? { sourceId: attachment.sourceId } : {}),
            ...assetData,
          },
        });

    assetsBySourceId.set(attachment.sourceId, asset);
    assetsByUrl.set(asset.url, asset);
  }

  const pendingExtraAssets = [];

  for (const url of extraUrls) {
    const canonicalUrl = normalizeRemoteUploadUrl(url);
    if (!canonicalUrl || assetsByUrl.has(canonicalUrl)) {
      continue;
    }

    pendingExtraAssets.push({
      source: "wordpress",
      url: canonicalUrl,
      filePath: canonicalUrl.split("/wp-content/uploads/")[1] || null,
    });
    assetsByUrl.set(canonicalUrl, { url: canonicalUrl });
  }

  if (pendingExtraAssets.length > 0) {
    await prisma.mediaAsset.createMany({
      data: pendingExtraAssets,
      skipDuplicates: true,
    });

    const persistedExtraAssets = await prisma.mediaAsset.findMany({
      where: {
        url: {
          in: pendingExtraAssets.map((asset) => asset.url),
        },
      },
    });

    for (const asset of persistedExtraAssets) {
      assetsByUrl.set(asset.url, asset);
    }
  }

  return { assetsBySourceId, assetsByUrl };
}

async function upsertCategories(productTaxonomies) {
  const groupedByCanonicalSlug = new Map();

  for (const row of productTaxonomies) {
    if (row.taxonomy !== "product_cat") {
      continue;
    }

    const bucket = groupedByCanonicalSlug.get(row.productId) || [];
    bucket.push(row);
    groupedByCanonicalSlug.set(row.productId, bucket);
  }

  const categoryIdsByProductId = new Map();
  const categoryRecordsBySlug = new Map();

  for (const [productId, categories] of groupedByCanonicalSlug.entries()) {
    const resolved = resolveCategoryGroup(
      categories.map((category) => category.slug),
      categories.map((category) => category.name),
    );

    let category = categoryRecordsBySlug.get(resolved.slug);
    if (!category) {
      category = await prisma.category.upsert({
        where: { slug: resolved.slug },
        update: {
          name: resolved.name,
          description:
            stripHtml(categories.find((item) => item.description)?.description) ||
            undefined,
        },
        create: {
          name: resolved.name,
          slug: resolved.slug,
          description:
            stripHtml(categories.find((item) => item.description)?.description) ||
            undefined,
        },
      });

      categoryRecordsBySlug.set(resolved.slug, category);
    }

    categoryIdsByProductId.set(productId, category.id);
  }

  return { categoryIdsByProductId, categoryRecordsBySlug };
}

async function importProducts({
  products,
  productTaxonomies,
  assetsBySourceId,
}) {
  const healSendBrand = await prisma.brand.upsert({
    where: { slug: "healsend" },
    update: {
      name: "HealSend",
    },
    create: {
      name: "HealSend",
      slug: "healsend",
      description: "Imported from the live HealSend WordPress catalog.",
    },
  });

  const { categoryIdsByProductId, categoryRecordsBySlug } =
    await upsertCategories(productTaxonomies);

  const taxonomiesByProductId = new Map();
  for (const row of productTaxonomies) {
    const bucket = taxonomiesByProductId.get(row.productId) || [];
    bucket.push(row);
    taxonomiesByProductId.set(row.productId, bucket);
  }

  const importedProducts = [];

  for (const product of products) {
    const relations = taxonomiesByProductId.get(product.sourceId) || [];
    const tags = relations
      .filter((relation) => relation.taxonomy === "product_tag")
      .map((relation) => relation.name);
    const productType =
      relations.find((relation) => relation.taxonomy === "product_type")?.slug ===
      "variable"
        ? "VARIABLE"
        : "SIMPLE";

    const assetIds = [
      product.thumbnailId,
      ...product.galleryIds,
    ].filter(Boolean);
    const imageUrls = assetIds
      .map((assetId) => assetsBySourceId.get(assetId)?.url)
      .filter(Boolean);

    const subscriptionTiers = Array.isArray(product.subscriptionTiers)
      ? product.subscriptionTiers
      : [];
    const firstTier = [...subscriptionTiers].sort(
      (left, right) =>
        (left.plan_priority ?? Number.MAX_SAFE_INTEGER) -
        (right.plan_priority ?? Number.MAX_SAFE_INTEGER),
    )[0];

    const categoryId = categoryIdsByProductId.get(product.sourceId) || null;
    const productData = {
      wcId: product.sourceId,
      sku: product.sku,
      name: product.title,
      slug: product.slug,
      type: productType,
      published: true,
      featured: product.categoryPriority >= 900,
      shortDescription: stripHtml(product.excerpt) || null,
      description: stripHtml(product.content) || null,
      regularPrice:
        firstTier?.then_price ??
        product.regularPrice ??
        product.price ??
        null,
      salePrice:
        firstTier?.first_price ??
        product.salePrice ??
        product.price ??
        null,
      inStock: product.stockStatus !== "outofstock",
      images: imageUrls,
      stripeProductId: product.stripeProductId || null,
      categoryId,
      brandId: healSendBrand.id,
      tags,
      subscriptionTiers:
        subscriptionTiers.length > 0 ? subscriptionTiers : undefined,
      attributes: {
        source: "wordpress",
        rawExcerpt: product.excerpt,
        rawContent: product.content,
        rawAttributes: product.rawAttributes,
        isSubscriptionProduct: product.isSubscriptionProduct,
        taxonomies: relations.map((relation) => ({
          taxonomy: relation.taxonomy,
          slug: relation.slug,
          name: relation.name,
        })),
      },
      priority: product.categoryPriority,
    };

    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [{ wcId: product.sourceId }, { slug: product.slug }],
      },
      select: { id: true },
    });

    const upsertedProduct = existingProduct
      ? await prisma.product.update({
          where: { id: existingProduct.id },
          data: productData,
        })
      : await prisma.product.create({
          data: productData,
        });

    await prisma.productVariant.deleteMany({
      where: { productId: upsertedProduct.id },
    });

    if (subscriptionTiers.length > 0) {
      await prisma.productVariant.createMany({
        data: subscriptionTiers.map((tier) => ({
          productId: upsertedProduct.id,
          name: `${tier.duration_months} Month Plan`,
          price: Number(tier.first_price || tier.then_price || 0),
          salePrice:
            tier.then_price !== undefined && tier.then_price !== null
              ? Number(tier.then_price)
              : null,
          stripePriceId: tier.stripe_price_id || null,
          attributes: tier,
          inStock: upsertedProduct.inStock,
        })),
      });
    }

    importedProducts.push(upsertedProduct);
  }

  return { importedProducts, categoryRecordsBySlug };
}

function mapPageSlug(slug) {
  return PAGE_SLUG_MAP[slug] || slug;
}

async function importMarketingPages({
  pages,
  assetsBySourceId,
  importedProducts,
  categoryRecordsBySlug,
}) {
  const productsBySlug = new Map(importedProducts.map((product) => [product.slug, product]));
  const productsByCategorySlug = new Map();

  for (const product of importedProducts) {
    if (!product.categoryId) {
      continue;
    }

    const categoryRecord = [...categoryRecordsBySlug.values()].find(
      (category) => category.id === product.categoryId,
    );
    if (!categoryRecord) {
      continue;
    }

    const bucket = productsByCategorySlug.get(categoryRecord.slug) || [];
    bucket.push(product);
    productsByCategorySlug.set(categoryRecord.slug, bucket);
  }

  for (const page of pages) {
    const canonicalSlug = mapPageSlug(page.slug);
    const linkedProduct =
      productsBySlug.get(page.slug) ||
      productsBySlug.get(canonicalSlug) ||
      null;
    const linkedCategory =
      categoryRecordsBySlug.get(canonicalSlug) ||
      null;
    const heroAsset = page.thumbnailId
      ? assetsBySourceId.get(page.thumbnailId) || null
      : null;
    const heroImage =
      heroAsset?.url ||
      extractUploadUrls(page.contentHtml)[0] ||
      linkedProduct?.images?.[0] ||
      null;

    let content = {
      sourceExcerpt: stripHtml(page.excerpt),
      sourceHtml: page.contentHtml,
      highlights: parseHighlights(page.excerpt || page.contentHtml),
    };

    if (linkedProduct) {
      const relatedProducts = importedProducts
        .filter(
          (product) =>
            product.id !== linkedProduct.id &&
            product.categoryId === linkedProduct.categoryId,
        )
        .slice(0, 2);
      content = buildProductMarketingContent({
        product: linkedProduct,
        page,
        relatedProducts,
      });
    } else if (linkedCategory) {
      content = buildCategoryPageContent({
        category: linkedCategory,
        page,
        heroImage,
      });
    }

    const marketingPageData = {
      slug: canonicalSlug,
      title: page.title,
      pageType: getPageType(canonicalSlug, linkedProduct?.id, linkedCategory?.id),
      sourcePostType: page.postType,
      sourceUrl: `${config.siteUrl.replace(/\/$/, "")}/${page.slug}`,
      excerpt: stripHtml(page.excerpt) || null,
      seoTitle: page.seoTitle || null,
      seoDescription: page.seoDescription || null,
      heroImage,
      heroAssetId: heroAsset?.id || null,
      contentHtml: page.contentHtml || null,
      content,
      categoryId: linkedCategory?.id || null,
      productId: linkedProduct?.id || null,
    };

    const existingMarketingPage = await prisma.marketingPage.findFirst({
      where: {
        OR: [{ sourcePostId: page.sourceId }, { slug: canonicalSlug }],
      },
      select: { id: true },
    });

    if (existingMarketingPage) {
      await prisma.marketingPage.update({
        where: { id: existingMarketingPage.id },
        data: marketingPageData,
      });
    } else {
      await prisma.marketingPage.create({
        data: {
          source: "wordpress",
          sourcePostId: page.sourceId,
          ...marketingPageData,
        },
      });
    }
  }

  const homePageContent = buildHomePageContent(
    new Map(
      [...categoryRecordsBySlug.entries()].map(([slug, category]) => [
        slug,
        {
          ...category,
          products:
            importedProducts.filter((product) => product.categoryId === category.id) || [],
        },
      ]),
    ),
  );

  await prisma.marketingPage.upsert({
    where: { slug: "home" },
    update: {
      title: "HealSend",
      pageType: "HOME",
      source: "generated",
      sourcePostType: "generated",
      sourceUrl: config.siteUrl,
      content: homePageContent,
    },
    create: {
      slug: "home",
      title: "HealSend",
      pageType: "HOME",
      source: "generated",
      sourcePostType: "generated",
      sourceUrl: config.siteUrl,
      content: homePageContent,
    },
  });
}

async function main() {
  assertImportConfig();

  console.log("Reading WordPress products, taxonomies, pages, and assets...");

  const products = await fetchProducts();
  console.log(`Fetched ${products.length} WordPress products.`);
  const productTaxonomies = await fetchProductTaxonomies();
  console.log(`Fetched ${productTaxonomies.length} product taxonomy rows.`);
  const pages = await fetchPages(buildRelevantPageSlugs(products));
  console.log(`Fetched ${pages.length} WordPress pages/posts.`);

  const attachmentIds = new Set();
  const extraUploadUrls = new Set();

  for (const product of products) {
    if (product.thumbnailId) attachmentIds.add(product.thumbnailId);
    for (const galleryId of product.galleryIds) {
      attachmentIds.add(galleryId);
    }
    for (const url of extractUploadUrls(`${product.excerpt} ${product.content}`)) {
      extraUploadUrls.add(url);
    }
  }

  for (const page of pages) {
    if (page.thumbnailId) attachmentIds.add(page.thumbnailId);
    for (const url of extractUploadUrls(`${page.excerpt} ${page.contentHtml}`)) {
      extraUploadUrls.add(url);
    }
  }

  const attachments = await fetchAttachments([...attachmentIds]);
  console.log(
    `Fetched ${attachments.length} attachment records and ${extraUploadUrls.size} inline upload URLs.`,
  );
  const { assetsBySourceId } = await upsertMediaAssets(
    attachments,
    [...extraUploadUrls],
  );
  console.log(`Upserted ${assetsBySourceId.size} media assets by source id.`);

  const { importedProducts, categoryRecordsBySlug } = await importProducts({
    products,
    productTaxonomies,
    assetsBySourceId,
  });
  console.log(
    `Imported or updated ${importedProducts.length} products across ${categoryRecordsBySlug.size} categories.`,
  );

  await importMarketingPages({
    pages,
    assetsBySourceId,
    importedProducts,
    categoryRecordsBySlug,
  });

  console.log(
    `Imported ${importedProducts.length} products, ${attachments.length} referenced attachments, and ${pages.length} marketing source pages.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
