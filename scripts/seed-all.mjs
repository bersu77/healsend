/**
 * Comprehensive seed script: imports products from CSVs, creates categories,
 * onboarding templates, and links everything together.
 *
 * Run:  node scripts/seed-all.mjs
 */

import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { normalizeImportedCatalogProduct } from "./lib/catalog-normalization.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const prisma = new PrismaClient();

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseImages(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function tryParseJSON(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ══════════════════════════════════════════════════════════════
   Category definitions with proper groupings
   ══════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  { name: "Weight Loss", slug: "weight-loss", priority: 1 },
  { name: "Sexual Health", slug: "sexual-health", priority: 2 },
  { name: "Anti-aging", slug: "anti-aging", priority: 3 },
  { name: "Strength & Recovery", slug: "strength-recovery", priority: 4 },
  { name: "Sleep", slug: "sleep", priority: 5 },
];

/* ══════════════════════════════════════════════════════════════
   Product → onboarding slug mapping
   ══════════════════════════════════════════════════════════════ */

const PRODUCT_TO_ONBOARDING = {
  // Weight Loss
  "tirzepatide-injections": "craving-portion-control",
  "tirzepatide-drops": "craving-portion-control",
  "tirzepatide-tablets": "craving-portion-control",
  "semaglutide-injections": "food-noise-appetite",
  "semaglutide-drops": "food-noise-appetite",
  "semaglutide-tablets": "food-noise-appetite",
  // Sexual Health
  sildenafil: "performance-issues",
  "pt-141-oxytocin-nasal-sprays": "low-intimacy-drive",
  "pt-141-nasal-spray": "low-intimacy-drive",
  "oxytocin-nasal-spray": "low-intimacy-drive",
  "generic-viagra": "performance-issues",
  "generic-cialis": "performance-issues",
  "pt-141-surge-2-in-1": "low-intimacy-drive",
  // Anti-aging
  "nad-injection-glutathione-1x-product": "nad-injection-therapy",
  "nad-nasal-glutathione-injection": "nad-nasal-spray",
  "glutathione-injection": "nad-injection-therapy",
  glutathione: "nad-injection-therapy",
  "glutathione-low-dose-naltrexone-ldn": "nad-injection-therapy",
  "low-dose-naltrexone-ldn": "nad-injection-therapy",
  "nad-injections": "nad-injection-therapy",
  "nad-nasal-spray": "nad-nasal-spray",
  // Strength & Recovery
  "sermorelin-injection-him-her": "growth-hormone-support",
  "sermorelin-injection": "growth-hormone-support",
  "sermorelin-enclomiphene-capsules-him": "growth-hormone-support",
  "sermorelin-enclomiphene": "growth-hormone-support",
  enclomiphene: "growth-hormone-support",
  // Sleep
  "generic-remeron-mirtazapine": "sleep-support",
  "generic-trazodone": "sleep-support",
};

/* ══════════════════════════════════════════════════════════════
   Onboarding template definitions
   ══════════════════════════════════════════════════════════════ */

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

const planSelectionStep = (prefix, firstMonthPrice) => ({
  title: "Choose Your Plan",
  subtitle:
    "All plans include provider consultation, medication, and ongoing support.",
  type: "PLAN_SELECTION",
  config: {
    plans: [
      {
        id: `${prefix}-12mo`,
        name: "12-Month Plan",
        badge: "Best Value",
        badgeBg: "#003366",
        badgeColor: "#ffffff",
        featured: true,
        firstMonth: firstMonthPrice,
        thenPrice: "$199/mo after",
        features: [
          "Lowest guaranteed monthly rate (Maximum savings)",
          "Annual health optimization plan",
          "Quarterly comprehensive progress reviews",
          "Locked-in pricing for 12 months",
          "Concierge support access 24/7",
        ],
      },
      {
        id: `${prefix}-6mo`,
        name: "6-Month Plan",
        badge: "Doctor Recommended",
        badgeBg: "#008080",
        badgeColor: "#ffffff",
        featured: false,
        firstMonth: firstMonthPrice,
        thenPrice: "$219/mo after",
        features: [
          "180-day comprehensive health roadmap",
          "Reduced monthly rate for consistent care",
          "Advanced refill synchronization",
          "VIP shipping status",
          "Concierge support access 24/7",
        ],
      },
      {
        id: `${prefix}-3mo`,
        name: "3-Month Plan",
        badge: "Most Popular",
        badgeBg: "#FAD02C",
        badgeColor: "#000000",
        featured: false,
        firstMonth: firstMonthPrice,
        thenPrice: "$239/mo after",
        features: [
          "Clinician-guided 90-day protocol",
          "Includes medication + ongoing provider care",
          "Priority dosing & refill management",
          "Free rapid shipping",
        ],
      },
      {
        id: `${prefix}-1mo`,
        name: "Monthly Plan",
        firstMonth: firstMonthPrice,
        thenPrice: "$249/mo after",
        features: [
          "Start anytime — cancel anytime",
          "Includes medication + provider care",
          "Free 2-day shipping",
          "Flexible month-to-month access",
        ],
      },
    ],
  },
  required: true,
});

const sanitizeTemplateSteps = (steps) =>
  steps
    .filter(
      (step) =>
        String(step?.title || "").trim().toLowerCase() !==
        "tell us about your health",
    )
    .map((step, index) => ({
      ...step,
      order: index + 1,
    }));

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

const ONBOARDING_TEMPLATES = [
  /* ═══════════════ SEXUAL WELLNESS ═══════════════ */
  {
    name: "Low Intimacy Drive",
    slug: "low-intimacy-drive",
    description:
      "Personalized assessment for patients experiencing low intimacy drive. Matches to PT-141 nasal spray therapy.",
    categorySlug: "sexual-health",
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
              price: "From $99/mo",
              icon: "nasal",
              badge: "RECOMMENDED",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("pt141-lid", "$169"),
      checkoutStep("PT-141 Nasal Spray — Monthly Plan", "$169.00"),
    ],
  },
  {
    name: "Loss of Desire",
    slug: "loss-of-desire",
    description:
      "Intake flow for patients seeking to rekindle desire and arousal.",
    categorySlug: "sexual-health",
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
              price: "From $99/mo",
              icon: "nasal",
              badge: "PROVIDER PICK",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("pt141-lod", "$169"),
      checkoutStep("PT-141 Nasal Spray — Monthly Plan", "$169.00"),
    ],
  },
  {
    name: "Performance Issues",
    slug: "performance-issues",
    description:
      "Comprehensive intake for patients experiencing intimate performance difficulties.",
    categorySlug: "sexual-health",
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
          "Sildenafil (Generic Viagra) works differently from traditional options — proven PDE5 inhibitor for reliable performance.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "sildenafil",
              name: "Sildenafil (Generic Viagra®)",
              description:
                "Works within 30-60 minutes. Proven PDE5 inhibitor for consistent performance.",
              price: "From $59/mo",
              icon: "medication",
              badge: "CLINICALLY PROVEN",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
            {
              id: "generic-cialis",
              name: "Generic Cialis® (Tadalafil)",
              description:
                "Stay ready for up to 36 hours. Consistent daily or as-needed dosing.",
              price: "From $59/mo",
              icon: "medication",
              badge: "LONG-LASTING",
              badgeClass: "bg-blue-100 text-blue-700",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("ed", "$139"),
      checkoutStep("ED Treatment — Monthly Plan", "$139.00"),
    ],
  },
  {
    name: "No Sexual Stamina",
    slug: "no-sexual-stamina",
    description:
      "Tailored assessment for patients looking to improve sexual stamina and endurance.",
    categorySlug: "sexual-health",
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
              price: "From $99/mo",
              icon: "nasal",
              badge: "BEST FOR STAMINA",
              badgeClass: "bg-blue-100 text-blue-700",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("pt141-nss", "$169"),
      checkoutStep("PT-141 Nasal Spray — Monthly Plan", "$169.00"),
    ],
  },

  /* ═══════════════ WEIGHT LOSS ═══════════════ */
  {
    name: "GLP-1 Eligibility Assessment",
    slug: "glp-1-eligibility",
    description:
      "Determine if you qualify for GLP-1 receptor agonist therapy for weight management.",
    categorySlug: "weight-loss",
    steps: [
      goalStep(
        "What's your primary weight loss goal?",
        "This helps us understand what success looks like for you.",
        [
          "Lose 10–20 lbs",
          "Lose 20–50 lbs",
          "Lose 50+ lbs",
          "Maintain after significant loss",
          "Improve metabolic health markers",
        ],
      ),
      {
        title: "What motivates you to lose weight?",
        subtitle: "Select the most important factor.",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Improve my physical health",
            "Feel better about my appearance",
            "Boost my energy levels",
            "Reduce medication dependence",
            "Doctor recommended weight loss",
          ],
        },
        required: true,
      },
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
      planSelectionStep("glp1", "$99"),
      checkoutStep("GLP-1 Weight Loss — First Month", "$99.00"),
    ],
  },
  {
    name: "Food Noise & Appetite Support",
    slug: "food-noise-appetite",
    description:
      "Intake for patients struggling with constant food thoughts and appetite control.",
    categorySlug: "weight-loss",
    steps: [
      goalStep(
        "How would you describe your relationship with food?",
        "Understanding your patterns helps us find the right treatment.",
        [
          "Constant food thoughts throughout the day",
          "Difficulty stopping once I start eating",
          "Emotional or stress eating",
          "Late-night cravings I can't control",
          "All of the above",
        ],
      ),
      {
        title: "How much does food noise affect your daily life?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Mildly — annoying but manageable",
            "Moderately — affects my focus and mood",
            "Significantly — impacts work and relationships",
            "Severely — dominates my day",
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
          "Semaglutide (GLP-1) has been clinically proven to reduce food noise and appetite by up to 60%.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "semaglutide-injections",
              name: "Semaglutide Injections",
              description:
                "Weekly injection. Targets appetite centers in the brain to reduce food noise and cravings.",
              price: "From $129/mo",
              icon: "medication",
              badge: "FDA APPROVED",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("sema", "$129"),
      checkoutStep("Semaglutide — First Month", "$129.00"),
    ],
  },
  {
    name: "Craving & Portion Control Support",
    slug: "craving-portion-control",
    description:
      "For patients looking to better manage portions and control food cravings.",
    categorySlug: "weight-loss",
    steps: [
      goalStep(
        "What type of cravings do you struggle with most?",
        "This helps us personalize your treatment approach.",
        [
          "Sugar and sweets",
          "Carbs and starchy foods",
          "Salty snacks",
          "Large portions at meals",
          "Feeling unable to stop eating",
        ],
      ),
      {
        title: "When are cravings strongest for you?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Morning",
            "Afternoon (2–5 PM slump)",
            "After dinner / late night",
            "When stressed or emotional",
            "All day, constantly",
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
          "Tirzepatide (dual GIP/GLP-1) is the most powerful weight loss medication available, targeting both appetite and metabolism.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "tirzepatide-injections",
              name: "Tirzepatide Injections",
              description:
                "Weekly injection. Dual-action GIP/GLP-1 for maximum appetite control and metabolic improvement.",
              price: "From $129/mo",
              icon: "medication",
              badge: "MOST EFFECTIVE",
              badgeClass: "hs-gradient text-white",
            },
            {
              id: "tirzepatide-drops",
              name: "Tirzepatide Drops",
              description:
                "Sublingual drops — same active compound, needle-free administration.",
              price: "From $129/mo",
              icon: "water_drop",
              badge: "NEEDLE-FREE",
              badgeClass: "bg-blue-100 text-blue-700",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("tirz", "$129"),
      checkoutStep("Tirzepatide — First Month", "$129.00"),
    ],
  },

  /* ═══════════════ ANTI-AGING ═══════════════ */
  {
    name: "NAD+ Injection Therapy",
    slug: "nad-injection-therapy",
    description:
      "Intake flow for NAD+ injection therapy — cellular repair, energy, and longevity.",
    categorySlug: "anti-aging",
    steps: [
      goalStep(
        "What's your primary goal with NAD+ therapy?",
        "NAD+ supports cellular energy, repair, and longevity.",
        [
          "Boost energy and reduce fatigue",
          "Sharpen mental clarity and focus",
          "Support anti-aging and longevity",
          "Support addiction recovery",
          "Overall wellness optimization",
        ],
      ),
      {
        title: "What symptoms are you currently experiencing?",
        type: "QUESTION_MULTI",
        config: {
          options: [
            "Chronic fatigue",
            "Brain fog",
            "Poor sleep quality",
            "Slow recovery from exercise",
            "Mood changes",
            "Skin aging concerns",
            "None of the above",
          ],
        },
        required: true,
      },
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Your Recommended Protocol",
        subtitle:
          "NAD+ injections deliver the coenzyme directly to your cells for maximum bioavailability and energy restoration.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "nad-injection",
              name: "NAD+ Injection + Glutathione",
              description:
                "Subcutaneous NAD+ with powerful antioxidant glutathione for cellular repair and detox.",
              price: "From $129/mo",
              icon: "syringe",
              badge: "MOST POPULAR",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("nad-inj", "$129"),
      checkoutStep("NAD+ Injection — Monthly Plan", "$129.00"),
    ],
  },
  {
    name: "NAD+ Nasal Spray",
    slug: "nad-nasal-spray",
    description:
      "Needle-free NAD+ nasal spray therapy for energy, focus, and anti-aging.",
    categorySlug: "anti-aging",
    steps: [
      goalStep(
        "Why are you interested in NAD+ Nasal Spray?",
        "This helps us tailor your treatment plan.",
        [
          "I want the benefits of NAD+ without needles",
          "Looking for a daily energy boost",
          "Want to sharpen focus and mental clarity",
          "Anti-aging and cellular repair",
          "Complement to my existing NAD+ protocol",
        ],
      ),
      {
        title: "Have you used NAD+ products before?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "No, this is my first time",
            "Yes, IV NAD+ infusions",
            "Yes, NAD+ injections",
            "Yes, oral NAD+ supplements",
            "Yes, multiple forms",
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
          "NAD+ Nasal Spray offers convenient, needle-free delivery with rapid absorption through the nasal mucosa.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "nad-nasal-spray",
              name: "NAD+ Nasal Spray + Glutathione Injection",
              description:
                "Daily nasal spray NAD+ with monthly glutathione injection for maximum cellular rejuvenation.",
              price: "From $129/mo",
              icon: "nasal",
              badge: "NEEDLE-FREE NAD+",
              badgeClass: "bg-emerald-100 text-emerald-700",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("nad-spray", "$129"),
      checkoutStep("NAD+ Nasal Spray — Monthly Plan", "$129.00"),
    ],
  },
  {
    name: "MICC+B12 Shots",
    slug: "micc-b12-shots",
    description:
      "Lipotropic MICC+B12 injection therapy for metabolism and energy support.",
    categorySlug: "anti-aging",
    steps: [
      goalStep(
        "What's your primary reason for considering MICC+B12?",
        "MICC+B12 supports fat metabolism, energy, and mood.",
        [
          "Boost metabolism and fat burning",
          "Increase energy levels",
          "Support weight management",
          "Improve mood and mental clarity",
          "Complement my existing wellness routine",
        ],
      ),
      {
        title: "Are you currently taking B12 supplements?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "No, I'm not supplementing B12",
            "Yes, oral B12 supplements",
            "Yes, B12 injections",
            "I've tried them in the past",
            "Not sure",
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
          "MICC+B12 combines lipotropic compounds (Methionine, Inositol, Choline, Cyanocobalamin) for enhanced fat metabolism and energy.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "micc-b12",
              name: "MICC+B12 Injection",
              description:
                "Weekly lipotropic injection. Supports fat metabolism, energy, liver function, and overall vitality.",
              price: "From $99/mo",
              icon: "syringe",
              badge: "METABOLISM BOOST",
              badgeClass: "bg-orange-100 text-orange-700",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("micc", "$99"),
      checkoutStep("MICC+B12 — Monthly Plan", "$99.00"),
    ],
  },

  /* ═══════════════ STRENGTH & RECOVERY ═══════════════ */
  {
    name: "Growth Hormone Support",
    slug: "growth-hormone-support",
    description:
      "Assessment for Sermorelin and growth hormone peptide therapy — muscle, recovery, performance.",
    categorySlug: "strength-recovery",
    steps: [
      goalStep(
        "What's your primary goal?",
        "Sermorelin naturally stimulates your body's own growth hormone production.",
        [
          "Build lean muscle mass",
          "Recover faster from workouts",
          "Improve sleep quality",
          "Boost energy and stamina",
          "Anti-aging and body recomposition",
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
                "Nightly subcutaneous injection. Stimulates natural GH release during sleep for muscle, recovery, and vitality.",
              price: "From $159/mo",
              icon: "fitness_center",
              badge: "NATURAL GH SUPPORT",
              badgeClass: "hs-gradient text-white",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("serm", "$159"),
      checkoutStep("Sermorelin Injection — Monthly Subscription", "$159.00"),
    ],
  },

  /* ═══════════════ SLEEP ═══════════════ */
  {
    name: "Sleep Support",
    slug: "sleep-support",
    description:
      "Assessment for sleep medication therapy — improve sleep onset, duration, and quality.",
    categorySlug: "sleep",
    steps: [
      goalStep(
        "What's your primary sleep concern?",
        "Understanding your sleep patterns helps us find the right treatment.",
        [
          "Difficulty falling asleep",
          "Waking up during the night",
          "Not feeling rested after sleeping",
          "Anxiety that prevents sleep",
          "All of the above",
        ],
      ),
      {
        title: "How long have you struggled with sleep?",
        type: "QUESTION_SINGLE",
        config: {
          options: [
            "Less than 1 month",
            "1–3 months",
            "3–6 months",
            "6–12 months",
            "Over a year",
          ],
        },
        required: true,
      },
      multiQuestion(
        "What have you tried for sleep?",
        "Select all that apply.",
        [
          "Melatonin or OTC sleep aids",
          "Prescription sleep medication",
          "CBD or herbal supplements",
          "Sleep hygiene improvements",
          "Therapy or CBT-I",
          "Nothing yet",
        ],
      ),
      healthHistoryStep,
      accountStep,
      textAlertsStep,
      {
        title: "Your Recommended Treatment",
        subtitle:
          "Our providers will match you with the most appropriate sleep medication based on your specific symptoms.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "mirtazapine",
              name: "Generic Remeron® (Mirtazapine)",
              description:
                "Low-dose antidepressant with powerful sedative properties. Improves sleep onset and quality.",
              price: "From $49/mo",
              icon: "bedtime",
              badge: "FOR SLEEP ONSET",
              badgeClass: "bg-indigo-100 text-indigo-700",
            },
            {
              id: "trazodone",
              name: "Generic Trazodone",
              description:
                "Well-tolerated sleep aid. Promotes deeper, more restful sleep without next-day grogginess.",
              price: "From $49/mo",
              icon: "bedtime",
              badge: "FOR STAYING ASLEEP",
              badgeClass: "bg-purple-100 text-purple-700",
            },
          ],
        },
        required: true,
      },
      planSelectionStep("sleep", "$49"),
      checkoutStep("Sleep Medication — Monthly Plan", "$49.00"),
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   CSV Import
   ══════════════════════════════════════════════════════════════ */

async function importCSV(filePath, categoryMap) {
  const content = fs.readFileSync(filePath, "utf8");
  // Handle BOM
  const cleanContent = content.replace(/^\uFEFF/, "");
  const records = parse(cleanContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  });

  console.log(
    `  Parsed ${records.length} rows from ${path.basename(filePath)}`,
  );

  let imported = 0;
  let skipped = 0;

  for (const row of records) {
    const name = row["Name"];
    if (!name) {
      skipped++;
      continue;
    }

    const type = (row["Type"] || "simple").toLowerCase();
    // Skip variations — we create them from tiers
    if (type === "variation") {
      skipped++;
      continue;
    }

    const wcId = row["ID"] ? parseInt(row["ID"], 10) : null;
    const slug = slugify(name);

    // Check for existing
    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug }, ...(wcId ? [{ wcId }] : [])] },
    });
    if (existing) {
      console.log(`  Skipping duplicate: ${name}`);
      skipped++;
      continue;
    }

    // Resolve category
    const normalizedProduct = normalizeImportedCatalogProduct({
      name,
      slug,
      category: row["Categories"] || null,
      images: parseImages(row["Images"]),
      shortDescription: row["Short description"] || null,
      description: row["Description"] || null,
      tags: [],
    });
    const categoryId = normalizedProduct.categorySlug
      ? categoryMap[normalizedProduct.categorySlug]
      : null;

    const subscriptionTiers = tryParseJSON(
      row["Meta: _hld_subscription_tiers"],
    );
    const stripeProductId = row["Meta: stripe_product_id"] || null;

    const productType = type === "variable" ? "VARIABLE" : "SIMPLE";

    const product = await prisma.product.create({
      data: {
        wcId: wcId || undefined,
        name,
        slug: normalizedProduct.slug,
        type: productType,
        sku: row["SKU"] || null,
        published: row["Published"] === "1",
        featured: row["Is featured?"] === "1",
        shortDescription: normalizedProduct.shortDescription,
        description: normalizedProduct.description,
        regularPrice: null,
        salePrice: null,
        taxStatus: row["Tax status"] || "taxable",
        inStock: row["In stock?"] !== "0",
        stock: row["Stock"] ? parseInt(row["Stock"], 10) : null,
        weight: row["Weight (kg)"] ? parseFloat(row["Weight (kg)"]) : null,
        images: normalizedProduct.images,
        stripeProductId: stripeProductId || undefined,
        categoryId,
        tags: normalizedProduct.tags,
        subscriptionTiers: subscriptionTiers || undefined,
        priority: row["Meta: _hld_category_priority"]
          ? parseInt(row["Meta: _hld_category_priority"], 10)
          : 0,
      },
    });

    // Create variants from subscription tiers
    if (
      productType === "VARIABLE" &&
      subscriptionTiers &&
      Array.isArray(subscriptionTiers)
    ) {
      for (const tier of subscriptionTiers) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: `${tier.duration_months} Month Plan`,
            price: tier.first_price || 0,
            salePrice: tier.then_price || null,
            stripePriceId: tier.stripe_price_id || null,
            attributes: tier,
          },
        });
      }
    }

    // For simple products with no tiers, set a default price
    if (
      productType === "SIMPLE" &&
      (!subscriptionTiers || subscriptionTiers.length === 0)
    ) {
      const regPrice = row["Regular price"]
        ? parseFloat(row["Regular price"])
        : null;
      const salePrice = row["Sale price"]
        ? parseFloat(row["Sale price"])
        : null;
      if (regPrice) {
        await prisma.product.update({
          where: { id: product.id },
          data: { regularPrice: regPrice, salePrice },
        });
      }
    }

    imported++;
    console.log(
      `  ✓ Imported: ${name} (${productType}, ${subscriptionTiers?.length || 0} tiers)`,
    );
  }

  return { imported, skipped };
}

/* ══════════════════════════════════════════════════════════════
   Main seed function
   ══════════════════════════════════════════════════════════════ */

async function main() {
  console.log("🌱 Starting comprehensive HealSend data seed...\n");

  // ─── 1. Create categories ───
  console.log("📁 Creating categories...");
  const categoryMap = {};

  for (const cat of CATEGORIES) {
    const existing = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });
    if (existing) {
      categoryMap[cat.slug] = existing.id;
      console.log(`  ✓ Category exists: ${cat.name}`);
    } else {
      const created = await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          priority: cat.priority,
        },
      });
      categoryMap[cat.slug] = created.id;
      console.log(`  ✓ Created category: ${cat.name}`);
    }
  }

  // ─── 2. Import products from CSVs ───
  console.log("\n📦 Importing products from CSVs...");

  const csvFiles = ["wc-product-2.csv", "wc-product-1.csv"]; // CSV2 first (has main products), CSV1 has additional ones
  let totalImported = 0;
  let totalSkipped = 0;

  for (const file of csvFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠ File not found: ${file}`);
      continue;
    }
    console.log(`\n  Processing ${file}...`);
    const result = await importCSV(filePath, categoryMap);
    totalImported += result.imported;
    totalSkipped += result.skipped;
  }

  console.log(
    `\n  📊 Products: ${totalImported} imported, ${totalSkipped} skipped`,
  );

  // ─── 3. Seed onboarding templates ───
  console.log("\n📋 Seeding onboarding templates...");

  for (const tpl of ONBOARDING_TEMPLATES) {
    const sanitizedSteps = sanitizeTemplateSteps(tpl.steps);
    const catId = tpl.categorySlug ? categoryMap[tpl.categorySlug] : null;

    const existing = await prisma.onboardingTemplate.findUnique({
      where: { slug: tpl.slug },
    });

    if (existing) {
      await prisma.onboardingStep.deleteMany({
        where: { templateId: existing.id },
      });

      await prisma.onboardingTemplate.update({
        where: { id: existing.id },
        data: {
          name: tpl.name,
          description: tpl.description,
          active: true,
          categoryId: catId,
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
      await prisma.onboardingTemplate.create({
        data: {
          name: tpl.name,
          slug: tpl.slug,
          description: tpl.description,
          active: true,
          categoryId: catId,
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

  // ─── 4. Summary ───
  const finalProducts = await prisma.product.count();
  const finalVariants = await prisma.productVariant.count();
  const finalCategories = await prisma.category.count();
  const finalTemplates = await prisma.onboardingTemplate.count();
  const finalSteps = await prisma.onboardingStep.count();

  console.log("\n" + "═".repeat(50));
  console.log("🎉 SEED COMPLETE!");
  console.log("═".repeat(50));
  console.log(`  Products:      ${finalProducts}`);
  console.log(`  Variants:      ${finalVariants}`);
  console.log(`  Categories:    ${finalCategories}`);
  console.log(
    `  Onboarding:    ${finalTemplates} templates, ${finalSteps} steps`,
  );
  console.log("═".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
