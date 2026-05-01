/**
 * Canonical GLP-1 onboarding funnel definition (client requirements in code).
 * Used by onboarding page auto-materialization and optionally by scripts/seed-onboarding-templates.mjs.
 */
export const GLP1_ONBOARDING_SLUG = "glp-1";

const DEFAULT_TEMPLATE_STYLING = {
  checkoutPricingMode: "ALL_AT_ONCE",
  delayedChargeDays: 20,
};

function goalStep(title, subtitle, options) {
  return {
    title,
    subtitle,
    type: "QUESTION_SINGLE",
    config: { options },
    required: true,
  };
}

function multiQuestion(title, subtitle, options) {
  return {
    title,
    subtitle,
    type: "QUESTION_MULTI",
    config: { options },
    required: true,
  };
}

const healthHistoryStep = {
  title: "Your health background",
  subtitle: "This helps our providers create a safe treatment plan.",
  type: "CUSTOM_FORM",
  config: {
    fields: [
      {
        name: "conditions",
        label: "Do you have any diagnosed medical conditions?",
        type: "textarea",
        placeholder:
          "e.g. diabetes, high blood pressure, thyroid issues, none",
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

function checkoutStep(summaryTitle, price) {
  return {
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
  };
}

const glp1BmiStep = {
  title: "Your basics. We'll do the math.",
  subtitle:
    "Takes 15 seconds. We use this to personalize your projection.",
  type: "BMI_CALCULATOR",
  config: {
    eligibleMinBmi: 27,
    strictMinBmi: false,
    feetLabel: "Feet",
    inchesLabel: "Inches",
    weightLabel: "Your current weight",
    feetPlaceholder: "Feet",
    inchesPlaceholder: "Inches",
    weightPlaceholder: "Pounds",
    continueLabel: "Show me my transformation",
  },
  required: true,
};

const glp1AccountStep = {
  ...accountStep,
  title: "Almost there · Save your progress",
  config: {
    ...accountStep.config,
    accountEyebrow: "Almost there · Save your progress",
    authTabSignup: "Create account",
    authTabLogin: "I already have one",
    signupHeadlineParts: {
      lead: "Create your ",
      accent: "secure account",
      tail: ".",
    },
    signupHeadline: "Create your secure account.",
    signupLede:
      "Skip the waiting room. Your projection is ready on the next screen.",
    signupCta: "Create account & view results",
    loginHeadlineParts: {
      lead: "Log in to ",
      accent: "continue",
      tail: ".",
    },
    loginHeadline: "Log in to continue.",
    loginLede:
      "Pick up where you left off without losing your progress.",
    loginCta: "Log in",
    oauthGoogleSignup: "Continue with Google",
    oauthGoogleLogin: "Log in with Google",
    oauthAppleSignup: "Continue with Apple",
    oauthAppleLogin: "Log in with Apple",
  },
};

const glp1TextAlertsStep = {
  ...textAlertsStep,
  title: "Stay in the loop",
  subtitle:
    "Get timely updates about your treatment, shipped right to your phone.",
};

function buildGlp1CheckoutStep() {
  const base = checkoutStep(
    "GLP-1 Weight Loss — Order summary",
    "$3,289.00",
  );
  return {
    ...base,
    subtitle: "Secure checkout. Cancel anytime.",
    config: {
      ...base.config,
      checkoutHeadline: "You're in.",
      fsaBannerText: "FSA/HSA eligible for reimbursement",
      warrantyTagline: "Lose weight or your money back.",
      checkoutTrustChips: [
        "Free shipping",
        "Provider visit included",
        "HSA/FSA eligible",
      ],
      checkoutOrderBenefits: [
        "1:1 provider consultations",
        "GLP-1 medication included",
        "Free shipping every month",
        "Priority patient concierge line",
      ],
      includedBenefits: [
        {
          title: "Unlimited doctor communication",
          previousPrice: "$129",
        },
        { title: "HSA / FSA eligible", previousPrice: "$29" },
        { title: "Free overnight shipping", previousPrice: "$49" },
        { title: "Provider visit included", previousPrice: "$99" },
        { title: "Patient concierge line", previousPrice: "$99" },
        {
          title: "HealSend Weight Loss Warranty",
          previousPrice: "$179",
        },
      ],
      faq: [
        {
          q: "When does my medicine ship?",
          a:
            "Once your provider approves your plan (usually within 24 hours), your first shipment goes out via FedEx Express and arrives in 2 business days.",
        },
        {
          q: "Is GLP-1 safe?",
          a:
            "GLP-1 medications are FDA-regulated and have been used for over a decade. Your prescribing clinician will assess your full health profile before approving treatment.",
        },
        {
          q: "Can I cancel?",
          a:
            "Yes. You can cancel any monthly plan anytime. Multi-month plans lock in lower per-month pricing — see your plan terms for specifics.",
        },
        {
          q: "What if I don't qualify?",
          a:
            "If our provider determines GLP-1 isn't right for you, you'll receive a full refund — no charge whatsoever.",
        },
      ],
    },
  };
}

/**
 * Same shape previously passed to the seed script for slug `glp-1`.
 * @returns {{ name: string, slug: string, description: string, productSlug: string, styling?: object, steps: object[] }}
 */
export function getGlp1OnboardingDefinition() {
  return {
    name: "GLP-1 Eligibility Assessment",
    slug: GLP1_ONBOARDING_SLUG,
    description:
      "Determine if you qualify for GLP-1 receptor agonist therapy for weight management.",
    productSlug: "glp-1-injections",
    styling: DEFAULT_TEMPLATE_STYLING,
    steps: [
      goalStep(
        "What matters most to you?",
        "No wrong answers. We use this to personalize your plan.",
        [
          "Lose weight & keep it off",
          "Stop thinking about food",
          "Break through a plateau",
          "Get clinician-guided care",
        ],
      ),
      glp1BmiStep,
      glp1AccountStep,
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
      {
        title: "Choose your GLP-1",
        subtitle:
          "Both are FDA-regulated and prescribed by a US-licensed physician. Your provider can switch you anytime.",
        type: "MEDICATION_SELECT",
        config: {
          medications: [
            {
              id: "semaglutide-injections",
              name: "Semaglutide",
              description:
                "A trusted, FDA-regulated GLP-1 used by millions worldwide for weight loss. Average ~15% body weight loss in clinical use.",
              price: "From $299/mo",
              icon: "vaccines",
              badge: "CLASSIC",
              badgeClass: "bg-blue-100 text-blue-700",
            },
            {
              id: "tirzepatide-injections",
              name: "Tirzepatide",
              description:
                "Dual-action GLP-1 + GIP medication clinically shown to deliver strong weight-loss results (~21%).",
              price: "From $399/mo",
              icon: "vaccines",
              badge: "MOST EFFECTIVE",
              badgeClass: "bg-amber-100 text-amber-700",
            },
          ],
        },
        required: true,
      },
      {
        title: "Choose your treatment plan",
        subtitle:
          "All plans include provider consultation, GLP-1 medication, and ongoing support.",
        type: "PLAN_SELECTION",
        config: {
          plans: [
            {
              id: "glp1-12mo",
              name: "12-Month Transformation",
              badge: "BEST VALUE",
              featured: true,
              durationMonths: 12,
              firstMonth: "$0",
              thenPrice: "$299",
              medicationTiers: {
                "tirzepatide-injections": {
                  firstMonth: "$0",
                  thenPrice: "$399",
                },
              },
              promoSubtitle: "Best results come with consistency",
              ctaFeatured: "Get started",
              features: [
                "1:1 provider consultations",
                "GLP-1 medication included",
                "Free shipping every month",
                "Priority patient concierge line",
              ],
            },
            {
              id: "glp1-3mo",
              name: "3-Month Plan",
              badge: "POPULAR",
              featured: false,
              durationMonths: 3,
              firstMonth: "$149",
              thenPrice: "$299",
              medicationTiers: {
                "tirzepatide-injections": {
                  firstMonth: "$199",
                  thenPrice: "$399",
                },
              },
              cta: "Choose 3-month plan",
              features: [
                "1:1 provider consultations",
                "GLP-1 medication included",
                "Free shipping every month",
              ],
            },
            {
              id: "glp1-1mo",
              name: "Monthly Plan",
              badge: "FLEXIBLE",
              featured: false,
              durationMonths: 1,
              firstMonth: "$299",
              thenPrice: "$299",
              medicationTiers: {
                "tirzepatide-injections": {
                  firstMonth: "$399",
                  thenPrice: "$399",
                },
              },
              cta: "Choose monthly plan",
              features: [
                "1:1 provider consultations",
                "GLP-1 medication included",
              ],
            },
          ],
        },
        required: true,
      },
      glp1TextAlertsStep,
      buildGlp1CheckoutStep(),
    ],
  };
}
