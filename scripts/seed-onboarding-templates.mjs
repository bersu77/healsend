/**
 * Seed script: creates onboarding templates for every treatment in the
 * TreatmentSideNav.  Each template is a multi-step intake flow tailored
 * to the treatment category.
 *
 * Run:  node scripts/seed-onboarding-templates.mjs
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* ──────────────────────────────────────────────────────────────
   Default styling — applied to templates that have no styling yet.
   ALL_AT_ONCE: charges immediately and enables Klarna/Afterpay BNPL.
   ────────────────────────────────────────────────────────────── */
const DEFAULT_TEMPLATE_STYLING = {
  checkoutPricingMode: "ALL_AT_ONCE",
  delayedChargeDays: 20,
};

/* ──────────────────────────────────────────────────────────────
   Step builders — reusable across templates
   ────────────────────────────────────────────────────────────── */

const goalStep = (title, subtitle, options) => ({
  title,
  subtitle,
  type: "QUESTION_SINGLE",
  config: { options },
  required: true,
});

const multiQuestion = (title, subtitle, options) => ({
  title,
  subtitle,
  type: "QUESTION_MULTI",
  config: { options },
  required: true,
});

const bmiStep = {
  title: "Let's check your BMI",
  subtitle: "We need your height and weight to determine eligibility.",
  type: "BMI_CALCULATOR",
  config: {},
  required: true,
};

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

const sanitizeTemplateSteps = (steps) =>
  steps
    .filter(
      (step) =>
        String(step?.title || "")
          .trim()
          .toLowerCase() !== "tell us about your health",
    )
    .map((step, index) => ({
      ...step,
      order: index + 1,
    }));

/* ──────────────────────────────────────────────────────────────
   Template definitions — one per treatment menu item
   ────────────────────────────────────────────────────────────── */

const TEMPLATES = [
  /* ═══════════════ SEXUAL WELLNESS ═══════════════ */
  {
    name: "Low Intimacy Drive",
    slug: "low-intimacy-drive",
    description:
      "Personalized assessment for patients experiencing low intimacy drive. Matches to PT-141 nasal spray therapy.",
    productSlug: "pt-141-nasal-spray",
    steps: [
      goalStep(
        "What best describes your experience?",
        "Understanding your situation helps us recommend the right treatment.",
        [
          "Decreased interest in intimacy",
          "Difficulty getting in the mood",
          "Lower drive than my partner",
          "Intimacy feels like a chore",
          "I want to feel desire again",
        ],
      ),
      {
        title: "How long have you been experiencing this?",
        subtitle: "There's no wrong answer — we're here to help.",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Less than 3 months",
            "3–6 months",
            "6–12 months",
            "Over a year",
            "As long as I can remember",
          ],
        },
        required: true,
      },
      multiQuestion(
        "Have you tried any of the following?",
        "Select all that apply.",
        [
          "Over-the-counter supplements",
          "Lifestyle changes (exercise, diet)",
          "Counseling or therapy",
          "Prescription medication",
          "Nothing yet",
        ],
      ),
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Your Recommended Treatment",
        subtitle:
          "Based on your answers, our providers recommend PT-141 Nasal Spray — a clinically studied peptide that works on brain pathways to restore natural desire.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "pt-141-nasal-spray",
              name: "PT-141 Nasal Spray",
              description:
                "Needle-free peptide therapy that targets brain receptors to enhance natural arousal.",
              price: "$249/mo",
              icon: "nasal",
              badge: "RECOMMENDED",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      checkoutStep("PT-141 Nasal Spray — Monthly Plan", "$249.00"),
    ],
  },

  {
    name: "Loss of Desire",
    slug: "loss-of-desire",
    description:
      "Intake flow for patients seeking to rekindle desire and arousal.",
    productSlug: "pt-141-nasal-spray",
    steps: [
      goalStep(
        "What's your primary concern?",
        "We'll match you with the most effective treatment.",
        [
          "Complete loss of sexual desire",
          "Desire has gradually faded",
          "Desire only with certain triggers",
          "Stress or medication has dulled my desire",
          "I'm not sure what changed",
        ],
      ),
      {
        title: "How is this affecting your life?",
        subtitle: "This helps our providers understand the full picture.",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Strain on my relationship",
            "Lower self-confidence",
            "Emotional distress",
            "All of the above",
            "Just want to feel like myself again",
          ],
        },
        required: true,
      },
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Your Recommended Treatment",
        subtitle:
          "PT-141 activates melanocortin receptors in the brain to naturally restore desire without hormonal side effects.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "pt-141-nasal-spray",
              name: "PT-141 Nasal Spray",
              description:
                "Fast-acting nasal peptide therapy. Use 30–60 minutes before intimacy.",
              price: "$249/mo",
              icon: "nasal",
              badge: "PROVIDER PICK",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      checkoutStep("PT-141 Nasal Spray — Monthly Plan", "$249.00"),
    ],
  },

  {
    name: "Performance Issues",
    slug: "performance-issues",
    description:
      "Comprehensive intake for patients experiencing intimate performance difficulties.",
    productSlug: "pt-141-nasal-spray",
    steps: [
      goalStep(
        "What performance challenge are you experiencing?",
        "All answers are confidential and reviewed only by licensed providers.",
        [
          "Difficulty maintaining arousal",
          "Premature response",
          "Delayed response",
          "Inconsistent performance",
          "Anxiety before intimacy",
        ],
      ),
      {
        title: "How often does this occur?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Rarely (once a month or less)",
            "Sometimes (a few times a month)",
            "Often (weekly)",
            "Almost every time",
            "Every time",
          ],
        },
        required: true,
      },
      multiQuestion(
        "Are any of these contributing factors?",
        "Select all that may apply.",
        [
          "Stress or anxiety",
          "Fatigue or poor sleep",
          "Medication side effects",
          "Relationship concerns",
          "Chronic health condition",
          "Uncertain",
        ],
      ),
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Your Recommended Treatment",
        subtitle:
          "PT-141 works differently from traditional options — it targets the central nervous system for a more natural response.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "pt-141-nasal-spray",
              name: "PT-141 Nasal Spray",
              description:
                "Targets CNS pathways for improved arousal and performance. Needle-free delivery.",
              price: "$249/mo",
              icon: "nasal",
              badge: "CLINICALLY STUDIED",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("PT-141 Nasal Spray — Monthly Plan", "$249.00"),
    ],
  },

  {
    name: "No Sexual Stamina",
    slug: "no-sexual-stamina",
    description:
      "Tailored assessment for patients looking to improve sexual stamina and endurance.",
    productSlug: "pt-141-nasal-spray",
    steps: [
      goalStep(
        "What best describes your stamina concern?",
        "Your answers help our providers find the best-fit solution.",
        [
          "I finish too quickly",
          "I lose interest during intimacy",
          "I feel physically fatigued quickly",
          "My arousal fades mid-encounter",
          "All of the above",
        ],
      ),
      {
        title: "What have you tried so far?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Nothing — this is my first step",
            "Over-the-counter supplements",
            "Prescription medication (e.g. PDE5 inhibitors)",
            "Therapy or counseling",
            "Lifestyle changes",
          ],
        },
        required: true,
      },
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Your Recommended Treatment",
        subtitle:
          "PT-141 has been shown to improve both desire and sustained arousal, helping you go the distance naturally.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "pt-141-nasal-spray",
              name: "PT-141 Nasal Spray",
              description:
                "Enhances desire and sustains arousal through central nervous system activation.",
              price: "$249/mo",
              icon: "nasal",
              badge: "BEST FOR STAMINA",
              badgeClass: "bg-blue-100 text-blue-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("PT-141 Nasal Spray — Monthly Plan", "$249.00"),
    ],
  },

  /* ═══════════════ WEIGHT LOSS ═══════════════ */
  {
    name: "GLP-1 Eligibility Assessment",
    slug: "glp-1",
    description:
      "Determine if you qualify for GLP-1 receptor agonist therapy for weight management.",
    productSlug: "glp-1-injections",
    steps: [
      goalStep("What matters most to you right now?", "", [
        "Lose weight & keep it off",
        "Stop thinking about food",
        "Break through a plateau",
        "Get a clinician-guided plan",
      ]),
      bmiStep,
      multiQuestion(
        "Have you tried any of these approaches?",
        "Select all that apply.",
        [
          "Diet programs (keto, intermittent fasting, etc.)",
          "Regular exercise routine",
          "Weight loss supplements",
          "Prescription weight loss medication",
          "Surgical procedures",
          "Nothing formal yet",
        ],
      ),
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Choose Your Plan",
        subtitle:
          "All plans include provider consultation, GLP-1 medication, and ongoing support.",
        type: "PLAN_SELECTION",
        config: {
          plans: [
            {
              id: "glp1-12mo",
              name: "12-Month Plan",
              badge: "BEST VALUE",
              featured: true,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "1:1 provider consultations",
                "GLP-1 medication included",
                "Free shipping every month",
                "24/7 care team support",
              ],
            },
            {
              id: "glp1-6mo",
              name: "6-Month Plan",
              badge: "GREAT VALUE",
              featured: false,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "1:1 provider consultations",
                "GLP-1 medication included",
                "Free shipping every month",
              ],
            },
            {
              id: "glp1-3mo",
              name: "3-Month Plan",
              badge: "DOCTOR RECOMMENDED",
              featured: false,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "1:1 provider consultations",
                "GLP-1 medication included",
                "Free shipping every month",
              ],
            },
            {
              id: "glp1-1mo",
              name: "Monthly Plan",
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "1:1 provider consultations",
                "GLP-1 medication included",
              ],
            },
          ],
        },
        required: true,
      },
      {
        title: "Select Your Medication",
        subtitle:
          "Your provider will confirm the best option during your consultation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "semaglutide-injections",
              name: "Semaglutide Injections",
              description:
                "Once-weekly GLP-1 injection option with an affiliate payout of $35.",
              price: "$35/mo",
              icon: "vaccines",
              badge: "COST EFFECTIVE",
              badgeClass: "bg-blue-100 text-blue-700",
            },
            {
              id: "tirzepatide-injections",
              name: "Tirzepatide Injections",
              description:
                "Most potent dual-agonist injectable. Average 22% body weight loss in trials.",
              price: "$35/mo",
              icon: "vaccines",
              badge: "HIGHEST SUCCESS RATE",
              badgeClass: "bg-amber-100 text-amber-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("GLP-1 Weight Loss — Subscription", "$35.00"),
    ],
  },

  {
    name: "Food Noise & Appetite Support",
    slug: "food-noise-appetite",
    description:
      "For patients struggling with constant food thoughts and appetite control. Matched to Semaglutide therapy.",
    productSlug: "semaglutide-injections",
    steps: [
      goalStep(
        "How would you describe your relationship with food?",
        "There are no wrong answers — we want to understand your daily experience.",
        [
          "I think about food constantly",
          "I eat even when I'm not hungry",
          "I can't stop once I start eating",
          "I use food for comfort or stress relief",
          "All of the above",
        ],
      ),
      {
        title: "How much does food noise affect your daily life?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Mildly — occasional distraction",
            "Moderately — affects decisions daily",
            "Severely — dominates my thoughts",
            "It's the biggest obstacle to my weight goals",
          ],
        },
        required: true,
      },
      bmiStep,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Your Recommended Treatment",
        subtitle:
          "Semaglutide has been shown to significantly reduce food noise and suppress appetite by mimicking the GLP-1 hormone your body naturally produces.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "semaglutide-injections",
              name: "Semaglutide Injections",
              description:
                "Once-weekly injection that reduces appetite and food-focused thoughts.",
              price: "$249/mo",
              icon: "vaccines",
              badge: "PROVEN FOR FOOD NOISE",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Semaglutide — Monthly Subscription", "$249.00"),
    ],
  },

  {
    name: "Craving & Portion Control",
    slug: "craving-portion-control",
    description:
      "Assessment for patients struggling with cravings and portion sizes. Matched to Tirzepatide therapy.",
    productSlug: "tirzepatide-injections",
    steps: [
      goalStep(
        "What's your biggest challenge with eating?",
        "Help us understand the patterns so we can find the right solution.",
        [
          "Intense cravings for sugar or carbs",
          "I always eat larger portions than intended",
          "Late-night snacking I can't control",
          "I feel hungry even after a big meal",
          "Emotional eating patterns",
        ],
      ),
      {
        title: "What does a typical day of eating look like?",
        subtitle: "Be honest — our providers aren't here to judge.",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "I skip meals then overeat later",
            "I graze throughout the entire day",
            "3 meals but very large portions",
            "Healthy meals but too many snacks",
            "Irregular — depends on stress and mood",
          ],
        },
        required: true,
      },
      bmiStep,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Your Recommended Treatment",
        subtitle:
          "Tirzepatide is a dual GIP/GLP-1 agonist that powerfully reduces cravings and helps you feel satisfied with smaller portions.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "tirzepatide-injections",
              name: "Tirzepatide Injections",
              description:
                "Dual-action injectable that targets both GIP and GLP-1 receptors for superior craving control.",
              price: "$329/mo",
              icon: "vaccines",
              badge: "BEST FOR CRAVINGS",
              badgeClass: "hs-gradient text-white",
            },
            {
              id: "tirzepatide-drops",
              name: "Tirzepatide Oral Drops",
              description:
                "Same powerful dual-agonist formula in a convenient needle-free option.",
              price: "$329/mo",
              icon: "water_drop",
              badge: "NEEDLE FREE",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Tirzepatide — Monthly Subscription", "$329.00"),
    ],
  },

  /* ═══════════════ ANTI-AGING & RECOVERY ═══════════════ */
  {
    name: "NAD+ Injection Therapy",
    slug: "nad-injection-therapy",
    description:
      "Onboarding for NAD+ injection therapy to support cellular repair, energy, and longevity.",
    productSlug: "nad-injection-glutathione-1x-product",
    steps: [
      goalStep(
        "What are you hoping to achieve with NAD+ therapy?",
        "Select the goal that resonates most.",
        [
          "Boost my energy and reduce fatigue",
          "Improve mental clarity and focus",
          "Support anti-aging and cellular repair",
          "Aid recovery from illness or stress",
          "General wellness and longevity",
        ],
      ),
      {
        title: "How would you rate your current energy levels?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "1 — Exhausted most of the day",
            "2 — Low energy, need caffeine to function",
            "3 — Average, but crashes in afternoon",
            "4 — Good, but could be better",
            "5 — Great energy overall",
          ],
        },
        required: true,
      },
      multiQuestion(
        "Which symptoms do you currently experience?",
        "Select all that apply.",
        [
          "Chronic fatigue",
          "Brain fog or poor concentration",
          "Slow recovery from exercise",
          "Poor sleep quality",
          "Joint or muscle stiffness",
          "Premature signs of aging (skin, hair)",
        ],
      ),
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Choose Your Plan",
        subtitle:
          "Select monthly, 3-month, or 12-month support before choosing your treatment.",
        type: "PLAN_SELECTION",
        config: {
          plans: [
            {
              id: "nad-12mo",
              name: "12-Month Plan",
              badge: "BEST VALUE",
              featured: true,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "Provider-guided NAD+ care",
                "Monthly refill management",
                "Priority support",
              ],
            },
            {
              id: "nad-6mo",
              name: "6-Month Plan",
              badge: "GREAT VALUE",
              featured: false,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "Provider-guided NAD+ care",
                "Monthly refill management",
              ],
            },
            {
              id: "nad-3mo",
              name: "3-Month Plan",
              badge: "DOCTOR RECOMMENDED",
              featured: false,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "Provider-guided NAD+ care",
                "Monthly refill management",
              ],
            },
            {
              id: "nad-1mo",
              name: "Monthly Plan",
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: ["Provider-guided NAD+ care"],
            },
          ],
        },
        required: true,
      },
      {
        title: "Your Recommended Protocol",
        subtitle:
          "NAD+ with Glutathione injections replenish cellular energy, support DNA repair, and boost antioxidant defense for whole-body rejuvenation.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "nad-injection-glutathione",
              name: "NAD+ Injection + Glutathione",
              description:
                "Combination therapy with an affiliate payout of $35.",
              price: "$35/mo",
              icon: "science",
              badge: "ANTI-AGING PROTOCOL",
              badgeClass: "hs-gradient text-white",
            },
            {
              id: "nad-nasal-spray",
              name: "NAD+ Nasal Spray",
              description:
                "Needle-free NAD+ option with a $35 affiliate payout.",
              price: "$35/mo",
              icon: "nasal",
              badge: "NEEDLE FREE",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("NAD+ Therapy — Subscription", "$35.00"),
    ],
  },

  {
    name: "NAD+ Nasal Spray",
    slug: "nad-nasal-spray",
    description:
      "Convenient nasal delivery of NAD+ with Glutathione for anti-aging and cognitive support.",
    productSlug: "nad-nasal-glutathione-injection",
    steps: [
      goalStep(
        "Why are you interested in NAD+ nasal spray?",
        "This helps us tailor the treatment to your needs.",
        [
          "I prefer needle-free treatment",
          "I want daily cognitive support",
          "I need something convenient for travel",
          "I've heard about anti-aging benefits",
          "My provider recommended it",
        ],
      ),
      {
        title: "What areas of your health do you want to improve?",
        type: "QUESTION_MULTI",
        config: {
          options: [
            "Mental sharpness and focus",
            "Energy throughout the day",
            "Skin elasticity and appearance",
            "Exercise recovery",
            "Mood and emotional balance",
            "Sleep quality",
          ],
        },
        required: true,
      },
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Choose Your Plan",
        subtitle:
          "Select monthly, 3-month, or 12-month support before choosing your treatment.",
        type: "PLAN_SELECTION",
        config: {
          plans: [
            {
              id: "nad-nasal-12mo",
              name: "12-Month Plan",
              badge: "BEST VALUE",
              featured: true,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "Provider-guided NAD+ care",
                "Monthly refill management",
                "Priority support",
              ],
            },
            {
              id: "nad-nasal-6mo",
              name: "6-Month Plan",
              badge: "GREAT VALUE",
              featured: false,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "Provider-guided NAD+ care",
                "Monthly refill management",
              ],
            },
            {
              id: "nad-nasal-3mo",
              name: "3-Month Plan",
              badge: "DOCTOR RECOMMENDED",
              featured: false,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "Provider-guided NAD+ care",
                "Monthly refill management",
              ],
            },
            {
              id: "nad-nasal-1mo",
              name: "Monthly Plan",
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: ["Provider-guided NAD+ care"],
            },
          ],
        },
        required: true,
      },
      {
        title: "Your Recommended Treatment",
        subtitle:
          "NAD+ Nasal Spray provides a convenient, needle-free way to deliver NAD+ directly through the nasal mucosa for fast absorption.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "nad-nasal-spray",
              name: "NAD+ Nasal Spray + Glutathione Injection",
              description: "Daily NAD+ support with a $35 affiliate payout.",
              price: "$35/mo",
              icon: "nasal",
              badge: "NEEDLE-FREE NAD+",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("NAD+ Nasal Spray Protocol", "$35.00"),
    ],
  },

  {
    name: "MICC+B12 Shots",
    slug: "micc-b12-shots",
    description:
      "Lipotropic injection therapy combining MICC and B12 for metabolism boost and fat burning support.",
    productSlug: "micc-b12",
    steps: [
      goalStep(
        "What's your primary goal with MICC+B12?",
        "Understanding your goals helps us optimize your protocol.",
        [
          "Accelerate fat burning",
          "Boost metabolism and energy",
          "Complement my weight loss program",
          "Improve liver function and detox",
          "Overall wellness boost",
        ],
      ),
      {
        title: "How active is your current lifestyle?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Sedentary (desk job, minimal exercise)",
            "Lightly active (walking, occasional workouts)",
            "Moderately active (3–4 workouts per week)",
            "Very active (daily exercise)",
            "Athlete / intense training",
          ],
        },
        required: true,
      },
      bmiStep,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Your Recommended Protocol",
        subtitle:
          "MICC+B12 is a lipotropic compound (Methionine, Inositol, Choline, Cyanocobalamin) that supports fat metabolism, liver function, and energy production.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "micc-b12",
              name: "MICC+B12 Injection Kit",
              description:
                "Weekly self-administered shots. Supports fat metabolism, energy, and liver health.",
              price: "$149/mo",
              icon: "vaccines",
              badge: "METABOLISM BOOST",
              badgeClass: "bg-amber-100 text-amber-700",
            },
          ],
        },
        required: true,
      },
      checkoutStep("MICC+B12 Shots — Monthly Subscription", "$149.00"),
    ],
  },

  /* ═══════════════ STRENGTH & PERFORMANCE ═══════════════ */
  {
    name: "Growth Hormone Support",
    slug: "growth-hormone-support",
    description:
      "Sermorelin injection therapy to support natural growth hormone production for muscle, recovery, and vitality.",
    productSlug: "sermorelin-injection-him-her",
    steps: [
      goalStep(
        "What are you looking to achieve?",
        "Sermorelin supports your body's natural growth hormone production.",
        [
          "Build lean muscle mass",
          "Faster recovery from workouts",
          "Improve sleep quality",
          "Increase energy and vitality",
          "Anti-aging and body composition",
        ],
      ),
      {
        title: "What's your current fitness level?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Beginner — just starting",
            "Intermediate — regular workouts",
            "Advanced — structured training program",
            "Competitive athlete",
            "Returning after a break",
          ],
        },
        required: true,
      },
      {
        title: "Have you used growth hormone peptides before?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "No, this is my first time",
            "Yes, I've used Sermorelin before",
            "Yes, I've used other peptides (Ipamorelin, CJC-1295, etc.)",
            "Yes, I've used HGH directly",
          ],
        },
        required: true,
      },
      bmiStep,
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Choose Your Plan",
        subtitle:
          "Select monthly, 3-month, or 12-month support before choosing your treatment.",
        type: "PLAN_SELECTION",
        config: {
          plans: [
            {
              id: "sermorelin-12mo",
              name: "12-Month Plan",
              badge: "BEST VALUE",
              featured: true,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "Provider-guided hormone support",
                "Monthly refill management",
                "Priority support",
              ],
            },
            {
              id: "sermorelin-6mo",
              name: "6-Month Plan",
              badge: "GREAT VALUE",
              featured: false,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "Provider-guided hormone support",
                "Monthly refill management",
              ],
            },
            {
              id: "sermorelin-3mo",
              name: "3-Month Plan",
              badge: "DOCTOR RECOMMENDED",
              featured: false,
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: [
                "Provider-guided hormone support",
                "Monthly refill management",
              ],
            },
            {
              id: "sermorelin-1mo",
              name: "Monthly Plan",
              firstMonth: "$35",
              thenPrice: "$35/mo after",
              features: ["Provider-guided hormone support"],
            },
          ],
        },
        required: true,
      },
      {
        title: "Your Recommended Protocol",
        subtitle:
          "Sermorelin stimulates your pituitary gland to naturally increase growth hormone production — without the risks of synthetic HGH.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "sermorelin-injection",
              name: "Sermorelin Injection (Him/Her)",
              description:
                "Nightly subcutaneous injection with a $35 affiliate payout.",
              price: "$35/mo",
              icon: "fitness_center",
              badge: "NATURAL GH SUPPORT",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      checkoutStep("Sermorelin Injection — Subscription", "$35.00"),
    ],
  },
];

/* ──────────────────────────────────────────────────────────────
   Seed runner
   ────────────────────────────────────────────────────────────── */

async function main() {
  console.log("🌱 Seeding onboarding templates...\n");

  for (const tpl of TEMPLATES) {
    const sanitizedSteps = sanitizeTemplateSteps(tpl.steps);
    const existing = await prisma.onboardingTemplate.findUnique({
      where: { slug: tpl.slug },
    });

    if (existing) {
      // Update existing: replace steps
      await prisma.onboardingStep.deleteMany({
        where: { templateId: existing.id },
      });

      // Only set styling if it isn't already configured by an admin
      const hasExistingStyling =
        existing.styling &&
        typeof existing.styling === "object" &&
        Object.keys(existing.styling).length > 0;

      await prisma.onboardingTemplate.update({
        where: { id: existing.id },
        data: {
          name: tpl.name,
          description: tpl.description,
          active: true,
          ...(!hasExistingStyling
            ? { styling: tpl.styling || DEFAULT_TEMPLATE_STYLING }
            : {}),
        },
      });

      for (let i = 0; i < sanitizedSteps.length; i++) {
        const s = sanitizedSteps[i];
        await prisma.onboardingStep.create({
          data: {
            templateId: existing.id,
            title: s.title,
            subtitle: s.subtitle || null,
            type: s.type,
            order: i + 1,
            config: s.config || {},
            required: s.required ?? true,
          },
        });
      }

      console.log(`  ✅ Updated: ${tpl.name} (${sanitizedSteps.length} steps)`);
    } else {
      // Create new
      await prisma.onboardingTemplate.create({
        data: {
          name: tpl.name,
          slug: tpl.slug,
          description: tpl.description,
          active: true,
          styling: tpl.styling || DEFAULT_TEMPLATE_STYLING,
          steps: {
            create: sanitizedSteps.map((s, i) => ({
              title: s.title,
              subtitle: s.subtitle || null,
              type: s.type,
              order: i + 1,
              config: s.config || {},
              required: s.required ?? true,
            })),
          },
        },
      });

      console.log(`  ✅ Created: ${tpl.name} (${sanitizedSteps.length} steps)`);
    }
  }

  console.log(`\n🎉 Done! ${TEMPLATES.length} onboarding templates seeded.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
