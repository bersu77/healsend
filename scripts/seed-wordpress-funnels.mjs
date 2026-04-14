/**
 * Seed script: creates onboarding templates sourced from WordPress FluentForms
 * on stage.healsend.com. Skips templates whose slug already exists.
 *
 * Run:  node scripts/seed-wordpress-funnels.mjs
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* ── reusable step builders ─────────────────────────────────── */

const multiQ = (title, subtitle, options) => ({
  title,
  subtitle,
  type: "QUESTION_MULTI",
  config: { options },
  required: true,
});

const singleQ = (title, subtitle, options) => ({
  title,
  subtitle,
  type: "QUESTION_SINGLE",
  config: { options },
  required: true,
});

const healthHistoryStep = {
  title: "Tell us about your health",
  subtitle: "This helps our providers create a safe treatment plan.",
  type: "CUSTOM_FORM",
  config: {
    fields: [
      {
        name: "conditions",
        label: "Do you have any diagnosed medical conditions?",
        type: "textarea",
        placeholder: "e.g. diabetes, high blood pressure, thyroid issues, none",
        required: true,
      },
      {
        name: "medications",
        label: "Are you currently taking any medications?",
        type: "textarea",
        placeholder: "List current medications or type 'None'",
        required: true,
      },
      {
        name: "allergies",
        label: "Any known allergies?",
        type: "text",
        placeholder: "e.g. penicillin, sulfa drugs, none",
        required: true,
      },
    ],
  },
  required: true,
};

const accountStep = {
  title: "Create Your Account",
  subtitle:
    "Your information is protected by 256-bit encryption and HIPAA safeguards.",
  type: "ACCOUNT_CREATE",
  config: {},
  required: true,
};

const textAlertsStep = {
  title: "Stay in the loop",
  subtitle:
    "Get timely updates about your treatment, shipped right to your phone.",
  type: "TEXT_ALERTS",
  config: {
    benefits: [
      {
        icon: "prescriptions",
        title: "Prescription Reminders",
        desc: "Never miss a dose with timely medication reminders",
      },
      {
        icon: "local_shipping",
        title: "Shipping Updates",
        desc: "Real-time tracking for your medication deliveries",
      },
      {
        icon: "medical_services",
        title: "Provider Messages",
        desc: "Important messages from your care team",
      },
      {
        icon: "lab_research",
        title: "Lab Results",
        desc: "Get notified the moment your results are ready",
      },
      {
        icon: "percent",
        title: "Exclusive Offers",
        desc: "Early access to promotions and savings",
      },
    ],
  },
  required: false,
};

const checkoutStep = (summaryTitle, price) => ({
  title: "Complete Your Order",
  subtitle: "Secure checkout — your treatment ships in discreet packaging.",
  type: "CHECKOUT",
  config: {
    summary: {
      title: summaryTitle,
      subtitle: "Includes licensed provider consultation",
      lineItems: [
        { label: "Provider consultation", amount: "$0.00", discount: true },
        { label: "First month supply", amount: price },
        { label: "Shipping", amount: "FREE", discount: true },
      ],
      total: price,
    },
  },
  required: true,
});

/* ── shared question sets ────────────────────────────────────── */

// Generic body goals — used by Sermorelin, HRT Lite, Enclomiphene, Sleep, Glutathione & LDN
const bodyGoalsQ = multiQ(
  "What are your physical body goals?",
  "Select all that apply.",
  [
    "Improve muscle tone",
    "Maintain a healthy body composition",
    "Improve metabolic health",
    "Improve cardiovascular health",
    "Improve energy levels",
    "Improve recovery after workouts",
    "Other",
  ],
);

const wellBeingQ = multiQ(
  "How would you like to improve your daily well-being?",
  "Select all that apply.",
  [
    "Boost daily energy and reduce fatigue",
    "Improve memory and mental clarity",
    "Enhance focus and concentration",
    "Support mood and emotional well-being",
    "Improve sleep quality and restfulness",
    "Ease chronic discomfort or pain",
    "Other",
  ],
);

// PT-141 goals question — used by PT-141, Oxytocin, ED meds
const pt141GoalsQ = multiQ(
  "What results are you looking to achieve?",
  "Select all that apply.",
  [
    "Increase sexual desire or arousal",
    "Enhance pleasure and satisfaction",
    "Improve ability to climax or reduce performance anxiety",
    "Balance mood and increase confidence",
    "Achieve stronger, longer-lasting erections",
    "All of the above",
  ],
);

/* ── template definitions ────────────────────────────────────── */

const TEMPLATES = [
  /* ─── PT-141 ─── */
  {
    name: "PT-141",
    slug: "pt-141",
    description:
      "Direct intake flow for patients seeking PT-141 peptide therapy for sexual wellness.",
    steps: [
      pt141GoalsQ,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "pt-141-injections",
              name: "PT-141 Injections",
              description:
                "Injectable peptide therapy for enhanced arousal and performance.",
              price: "$249/mo",
              icon: "vaccines",
              badge: "MOST EFFECTIVE",
              badgeClass: "bg-blue-100 text-blue-700",
            },
            {
              id: "pt-141-nasal-spray",
              name: "PT-141 Nasal Spray",
              description:
                "Needle-free delivery — use 30–60 minutes before intimacy.",
              price: "$249/mo",
              icon: "nasal",
              badge: "NEEDLE-FREE",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("PT-141 — Monthly Plan", "$249.00"),
    ],
  },

  /* ─── Sermorelin ─── */
  {
    name: "Sermorelin",
    slug: "sermorelin",
    description:
      "Intake flow for patients seeking Sermorelin growth hormone-releasing peptide therapy.",
    steps: [
      bodyGoalsQ,
      wellBeingQ,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "sermorelin-injection",
              name: "Sermorelin Injection",
              description:
                "Subcutaneous injection that stimulates natural growth hormone release.",
              price: "$199/mo",
              icon: "vaccines",
              badge: "PROVIDER PICK",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Sermorelin — Monthly Plan", "$199.00"),
    ],
  },

  /* ─── Sleep ─── */
  {
    name: "Sleep Support",
    slug: "sleep",
    description:
      "Intake flow for patients seeking clinical support for sleep quality and restoration.",
    steps: [
      singleQ(
        "How would you describe your sleep challenges?",
        "Your answers help our providers recommend the right treatment.",
        [
          "Trouble falling asleep",
          "Waking up frequently at night",
          "Waking up too early",
          "Not feeling rested after sleep",
          "All of the above",
        ],
      ),
      wellBeingQ,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "sleep-support",
              name: "Sleep Support Protocol",
              description:
                "Clinically formulated to improve sleep quality and duration.",
              price: "$149/mo",
              icon: "bedtime",
              badge: "RECOMMENDED",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Sleep Support — Monthly Plan", "$149.00"),
    ],
  },

  /* ─── Oxytocin ─── */
  {
    name: "Oxytocin",
    slug: "oxytocin",
    description:
      "Intake flow for patients seeking oxytocin therapy for connection, mood, and intimacy.",
    steps: [
      pt141GoalsQ,
      singleQ(
        "How long have you been experiencing these concerns?",
        "Help us understand your situation better.",
        ["Less than 3 months", "3–6 months", "6–12 months", "Over a year"],
      ),
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "oxytocin-nasal-spray",
              name: "Oxytocin Nasal Spray",
              description:
                "Fast-acting nasal spray that enhances bonding, trust, and mood.",
              price: "$199/mo",
              icon: "nasal",
              badge: "PROVIDER PICK",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Oxytocin — Monthly Plan", "$199.00"),
    ],
  },

  /* ─── NAD+Glutathione ─── */
  {
    name: "NAD+ & Glutathione",
    slug: "nad-glutathione",
    description:
      "Intake flow for patients seeking combined NAD+ and Glutathione anti-aging and energy support.",
    steps: [
      multiQ(
        "What are your goals for exploring NAD+ therapy?",
        "Select all that apply.",
        [
          "Anti-Aging",
          "Improve mental clarity",
          "Boost energy",
          "Improve physical performance",
          "Detox and Cleanse",
          "Immune support",
          "Improve appearance",
          "Other",
        ],
      ),
      wellBeingQ,
      multiQ(
        "Do you have any of the following medical conditions?",
        "Check all that apply.",
        [
          "Heart disease",
          "High blood pressure",
          "Diabetes",
          "Thyroid disorders",
          "Kidney disease",
          "Liver disease",
          "Cancer",
          "Autoimmune disorders",
          "Blood clotting disorders",
          "None of the above",
        ],
      ),
      singleQ(
        "Are you currently pregnant or planning to become pregnant?",
        "This affects treatment eligibility.",
        [
          "Yes, currently pregnant",
          "Planning to become pregnant",
          "No, none of the above",
        ],
      ),
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "nad-injections",
              name: "NAD+ Injections",
              description:
                "High-bioavailability NAD+ with Glutathione for maximum cellular repair.",
              price: "$299/mo",
              icon: "vaccines",
              badge: "MOST EFFECTIVE",
              badgeClass: "bg-amber-100 text-amber-700",
            },
            {
              id: "nad-nasal-spray",
              name: "NAD+ Nasal Spray",
              description:
                "Convenient nasal delivery for daily cognitive and energy support.",
              price: "$199/mo",
              icon: "nasal",
              badge: "NEEDLE-FREE",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("NAD+ & Glutathione — Monthly Plan", "$299.00"),
    ],
  },

  /* ─── ED Meds ─── */
  {
    name: "ED Medications",
    slug: "ed-meds",
    description:
      "Intake flow for patients seeking prescription erectile dysfunction treatment.",
    steps: [
      pt141GoalsQ,
      singleQ(
        "How long have you been experiencing ED concerns?",
        "All answers are confidential.",
        [
          "Less than 3 months",
          "3–6 months",
          "6–12 months",
          "Over a year",
          "As long as I can remember",
        ],
      ),
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "pt-141-injections",
              name: "PT-141 Injections",
              description:
                "Peptide therapy targeting the CNS for natural erectile response.",
              price: "$249/mo",
              icon: "vaccines",
              badge: "CLINICALLY STUDIED",
              badgeClass: "bg-blue-100 text-blue-700",
            },
            {
              id: "pt-141-nasal-spray",
              name: "PT-141 Nasal Spray",
              description: "Convenient nasal delivery — no injection required.",
              price: "$249/mo",
              icon: "nasal",
              badge: "NEEDLE-FREE",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("ED Medications — Monthly Plan", "$249.00"),
    ],
  },

  /* ─── Glutathione & LDN ─── */
  {
    name: "Glutathione & LDN",
    slug: "glutathione-ldn",
    description:
      "Intake flow for patients seeking Glutathione and Low Dose Naltrexone (LDN) immune and wellness support.",
    steps: [
      bodyGoalsQ,
      wellBeingQ,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "glutathione-ldn",
              name: "Glutathione + LDN",
              description:
                "Antioxidant + immune modulator combination for whole-body wellness.",
              price: "$249/mo",
              icon: "vaccines",
              badge: "IMMUNE SUPPORT",
              badgeClass: "bg-purple-100 text-purple-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Glutathione & LDN — Monthly Plan", "$249.00"),
    ],
  },

  /* ─── Enclomiphene ─── */
  {
    name: "Enclomiphene",
    slug: "enclomiphene",
    description:
      "Intake flow for patients seeking Enclomiphene testosterone optimization therapy.",
    steps: [
      bodyGoalsQ,
      wellBeingQ,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "enclomiphene",
              name: "Enclomiphene",
              description:
                "Oral testosterone stimulant that preserves natural hormone production.",
              price: "$149/mo",
              icon: "medication",
              badge: "ORAL OPTION",
              badgeClass: "bg-blue-100 text-blue-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Enclomiphene — Monthly Plan", "$149.00"),
    ],
  },

  /* ─── HRT Lite ─── */
  {
    name: "HRT Lite",
    slug: "hrt-lite",
    description:
      "Intake flow for patients seeking entry-level hormone replacement therapy.",
    steps: [
      bodyGoalsQ,
      wellBeingQ,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "hrt-lite",
              name: "HRT Lite",
              description:
                "Low-dose hormone therapy tailored to restore balance and vitality.",
              price: "$199/mo",
              icon: "medication",
              badge: "ENTRY LEVEL",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("HRT Lite — Monthly Plan", "$199.00"),
    ],
  },

  /* ─── Glutathione ─── */
  {
    name: "Glutathione",
    slug: "glutathione",
    description:
      "Intake flow for patients seeking Glutathione antioxidant therapy for skin, immunity, and detox.",
    steps: [
      multiQ("What are your wellness goals?", "Select all that apply.", [
        "Improve skin radiance and tone",
        "Boost immune defenses",
        "Detox and cellular cleanse",
        "Improve energy levels",
        "Reduce oxidative stress",
        "Anti-aging support",
        "Other",
      ]),
      wellBeingQ,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "glutathione-injection",
              name: "Glutathione Injection",
              description:
                "High-dose IV-quality antioxidant therapy for detox and glow.",
              price: "$199/mo",
              icon: "vaccines",
              badge: "MOST POTENT",
              badgeClass: "bg-amber-100 text-amber-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Glutathione — Monthly Plan", "$199.00"),
    ],
  },

  /* ─── NAD (direct) ─── */
  {
    name: "NAD+ Therapy",
    slug: "nad",
    description:
      "Direct intake flow for patients seeking NAD+ cellular energy and anti-aging therapy.",
    steps: [
      multiQ(
        "What are your goals for exploring NAD+ therapy?",
        "Select all that apply.",
        [
          "Anti-Aging",
          "Improve mental clarity",
          "Boost energy",
          "Improve physical performance",
          "Detox and Cleanse",
          "Immune support",
          "Improve appearance",
          "Other",
        ],
      ),
      wellBeingQ,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "nad-injections",
              name: "NAD+ Injections",
              description:
                "Maximum bioavailability — direct cellular NAD+ replenishment.",
              price: "$249/mo",
              icon: "vaccines",
              badge: "MOST EFFECTIVE",
              badgeClass: "bg-amber-100 text-amber-700",
            },
            {
              id: "nad-nasal-spray",
              name: "NAD+ Nasal Spray",
              description:
                "Convenient daily nasal delivery for cognitive energy support.",
              price: "$149/mo",
              icon: "nasal",
              badge: "NEEDLE-FREE",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("NAD+ Therapy — Monthly Plan", "$249.00"),
    ],
  },

  /* ─── Performance Lab ─── */
  {
    name: "Performance Lab",
    slug: "performance-lab",
    description:
      "Intake flow for high-performance athletes and biohackers seeking CJC-1295/Ipamorelin peptide protocols.",
    steps: [
      singleQ(
        "Which best describes your current training plateau?",
        "Understanding your barrier helps us personalize your protocol.",
        [
          "Strength and muscle gains have stalled",
          "Recovery takes longer than it used to",
          "Low energy despite consistent training",
          "Poor sleep affecting performance",
          "All of the above",
        ],
      ),
      multiQ(
        "What performance outcomes are most important to you?",
        "Select all that apply.",
        [
          "Increase lean muscle mass",
          "Accelerate post-workout recovery",
          "Improve sleep quality and GH release",
          "Boost metabolic rate",
          "Enhance endurance and stamina",
          "Reduce body fat",
        ],
      ),
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Select Your Protocol",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "cjc-ipamorelin-blend",
              name: "CJC-1295 / Ipamorelin Blend",
              description:
                "Gold Standard dual-pathway GH secretagogue for accelerated recovery.",
              price: "$299/mo",
              icon: "vaccines",
              badge: "GOLD STANDARD",
              badgeClass: "bg-amber-100 text-amber-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Performance Lab Protocol — Monthly Plan", "$299.00"),
    ],
  },
];

/* ── main ────────────────────────────────────────────────────── */

async function main() {
  let created = 0;
  let skipped = 0;

  for (const tpl of TEMPLATES) {
    const existing = await prisma.onboardingTemplate.findUnique({
      where: { slug: tpl.slug },
    });

    if (existing) {
      console.log(`  SKIP  ${tpl.slug}  (already exists)`);
      skipped++;
      continue;
    }

    const stepsData = tpl.steps.map((step, idx) => ({
      title: step.title,
      subtitle: step.subtitle ?? "",
      type: step.type,
      config: step.config ?? {},
      order: idx + 1,
      required: step.required ?? true,
    }));

    await prisma.onboardingTemplate.create({
      data: {
        name: tpl.name,
        slug: tpl.slug,
        description: tpl.description ?? "",
        steps: { create: stepsData },
      },
    });

    console.log(`  CREATE ${tpl.slug}  (${stepsData.length} steps)`);
    created++;
  }

  console.log(`\nDone. Created: ${created}  Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
