import {
  Droplet,
  Syringe,
  Zap,
} from "lucide-react";
import { WORDPRESS_MARKETING_IMAGES } from "@/lib/marketing-images";

export const productContent = {
  id: "nad-injection",
  name: "NAD+ Injection",
  inStock: true,
  image: WORDPRESS_MARKETING_IMAGES.nadInjection,
  price: {
    firstMonth: 119,
    regular: 186,
    savings: 81,
  },
  tabs: {
    benefits: [
      {
        icon: Zap,
        text: "Restores energy, sharpens focus, and supports recovery at the cellular level.",
      },
      {
        icon: Syringe,
        text: "Only $15/shot* — at-home kit included, no clinic visits.",
      },
      {
        icon: Droplet,
        text: "Full-strength 500–1000mg vials (200mg/mL) from a licensed U.S. pharmacy.",
      },
    ],
    pricing: {
      title: "Choose the vial size best for you. No hidden fees.",
      sizes: [
        {
          title: "500mg (2.5mL vial)",
          subtitle:
            "Great for those starting slowly\nor using NAD+ 1-3x per week",
          plans: [
            { name: "3-Month Plan", firstMonthPrice: 119, regularPrice: 186 },
            { name: "Monthly Plan", firstMonthPrice: 173, regularPrice: 196 },
          ],
        },
        {
          title: "1000mg (5mL vial)",
          subtitle:
            "Best for those aiming for higher frequency (up to 5x/week)",
          plans: [
            { name: "3-Month Plan", firstMonthPrice: 145, regularPrice: 226 },
            { name: "Monthly Plan", firstMonthPrice: 217, regularPrice: 246 },
          ],
        },
      ],
    },
    description:
      "NAD+ (Nicotinamide Adenine Dinucleotide) injections help replenish a vital coenzyme that declines with age, playing a key role in energy metabolism, DNA repair, and cellular resilience. This therapy is designed for those seeking more natural energy, clearer focus, and support for long-term wellness.",
  },
  faqs: [
    {
      question: "What is NAD+ and why does it matter?",
      answer:
        "NAD+ is a crucial coenzyme found in every cell of your body. It is essential for cellular energy production and DNA repair.",
    },
    {
      question: "What are the potential benefits of NAD+ injections?",
      answer:
        "Benefits may include increased energy, improved mental clarity, and support for healthy aging.",
    },
    {
      question:
        "What is the difference between oral NAD+ supplements and injections?",
      answer:
        "Injections bypass the digestive system for higher absorption directly into the bloodstream.",
    },
  ],
  testimonials: [
    {
      name: "Jenna P.",
      role: "Verified member",
      quote:
        "I wanted steady energy and less burnout, not something that felt extreme. The whole process felt clear and supportive from the start.",
      highlight: "Clearer focus and better momentum",
    },
    {
      name: "Elias C.",
      role: "Verified member",
      quote:
        "What stood out most was how simple the plan felt. I knew what I was taking, why I was taking it, and what the next step would be.",
      highlight: "A plan that felt easy to stay consistent with",
    },
    {
      name: "Chloe F.",
      role: "Verified member",
      quote:
        "The best part was not having to piece things together myself. The care path, delivery, and follow-up all felt connected.",
      highlight: "More confidence in the whole routine",
    },
  ],
  relatedProducts: [
    {
      id: "tirzepatide-injections",
      name: "Tirzepatide Injections",
      image: WORDPRESS_MARKETING_IMAGES.tirzepatide,
    },
    {
      id: "semaglutide-injections",
      name: "Semaglutide Injections",
      image: "/semaglutide-injections-product.webp",
    },
  ],
  featureSection: {
    title: "Feel stronger and age with confidence. On your terms.",
    description: [
      "The NAD+ program supports cellular energy, sharpens your mind, and helps you age vibrantly.",
      "NAD+ (short for Nicotinamide Adenine Dinucleotide) is a molecule found in every cell of your body. It is essential to cellular energy and repair. NAD+ levels decline naturally as we age, which is why some patients explore replenishing it. That's where NAD+ therapy comes in.",
    ],
    image: WORDPRESS_MARKETING_IMAGES.nadInjection,
  },
  supportSection: {
    title: "Designed to Support How You Feel & Function",
    subtitle:
      "You will notice differences in how you eat, lose weight, and feel.",
    features: [
      {
        iconImage: "/images/articles/liver.jpg",
        title: "Control Appetite",
        description: "Feel full sooner. Crave less.",
      },
      {
        iconImage: "/images/articles/blogs/trade.jpg",
        title: "Steady Energy",
        description: "Balanced blood sugar = fewer crashes.",
      },
      {
        iconImage: "/images/image.png",
        title: "Real Weight Loss",
        description: "Weekly progress you can see.",
        iconClass: "h-28 w-28",
      },
    ],
  },
  benefitsCarousel: [
    {
      image: WORDPRESS_MARKETING_IMAGES.nadInjection,
      text: "Supports energy and skin vibrancy at the cellular level.",
    },
    {
      image: WORDPRESS_MARKETING_IMAGES.nadNasal,
      text: "Could help with mental clarity and focus.",
    },
    {
      image: WORDPRESS_MARKETING_IMAGES.nadPatches,
      text: "Designed to complement longevity goals.",
    },
    {
      image: WORDPRESS_MARKETING_IMAGES.sermorelin,
      text: "Some patients report improved energy and focus.",
    },
  ],
  researchSection: {
    title: "What the research shows about NAD+",
    image: "/images/articles/blogs/female.jpg",
    points: [
      "Supports cellular repair & energy (ATP)",
      "Activates longevity enzymes like SIRT1",
      "May support focus, metabolism & skin health",
      "Administered subcutaneously for high-absorption",
    ],
  },
  labTestedSection: {
    title: "Lab tested medications for quality & potency",
    description:
      "Our medication is delivered from a state licensed pharmacy in our network, right to your door when you need it.",
    image: "/lab-tested-medications.jpeg",
  },
  closingCta: {
    eyebrow: "Ready to feel like you again?",
    title:
      "Discover whether NAD+ support fits your energy, focus, and long-term wellness goals.",
    description:
      "Every plan is clinician-guided and designed to keep the next step obvious, from eligibility through delivery and ongoing support.",
    bullets: [
      "1-on-1 guidance from U.S.-based clinicians",
      "Transparent pricing and no hidden fees",
      "Fast delivery and ongoing care support",
      "A cleaner path from intake to treatment",
    ],
    planLabel: "NAD+ Injection",
    supportNote:
      "Discounts are applied automatically at checkout when available, and final treatment fit still depends on clinician review.",
  },
  cleanIngredients: [
    {
      iconImage: "/images/clean/evidence-based-treatments.png",
      name: "Evidence-Based Treatments",
    },
    {
      iconImage: "/images/clean/online-private.png",
      name: "100% Online & Private",
    },
    {
      iconImage: "/images/clean/automatic-refills.png",
      name: "Automatic refills",
    },
    {
      iconImage: "/images/clean/same-day-prescriptions.png",
      name: "Same-Day Prescriptions",
    },
    {
      iconImage: "/images/clean/transparent-pricing.png",
      name: "Affordable, Transparent Pricing",
    },
    {
      iconImage: "/images/clean/fast-free-delivery.png",
      name: "Fast free delivery",
    },
  ],
};
