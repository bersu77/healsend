import {
  Atom,
  Droplet,
  FlaskConical,
  Hourglass,
  Leaf,
  Rabbit,
  Syringe,
  Target,
  TrendingUp,
  TreePine,
  Wheat,
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
        text: "Helps power cellular energy production at the mitochondrial level, the powerhouse of your cells.",
      },
      {
        icon: Syringe,
        text: "Only $15/shot*, homekit included.",
      },
      {
        icon: Droplet,
        text: "Full-strength dosages of 500-1000mg per vial (200mg/mL).",
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
      id: "nad-nasal-spray",
      name: "NAD+ Nasal Spray",
      image: WORDPRESS_MARKETING_IMAGES.nadNasal,
    },
    {
      id: "nad-patches",
      name: "NAD+ Patches",
      image: WORDPRESS_MARKETING_IMAGES.nadPatches,
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
    title: "Designed to support how you feel and function.",
    subtitle:
      "You may notice real differences in how you think, move, and feel.",
    features: [
      {
        icon: Target,
        title: "Sharper focus & clarity",
        description: "Brain fog? Meet your new clarity companion.",
      },
      {
        icon: TrendingUp,
        title: "Restore energy & metabolism",
        description: "NAD+ boosts mitochondrial function to power your day.",
      },
      {
        icon: Hourglass,
        title: "Support healthy aging",
        description: "Support DNA repair and longevity enzymes like SIRT1.",
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
    image: WORDPRESS_MARKETING_IMAGES.nadNasal,
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
    image: WORDPRESS_MARKETING_IMAGES.nadPatches,
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
    { icon: Rabbit, name: "Cruelty Free" },
    { icon: TreePine, name: "Eco Friendly" },
    { icon: Leaf, name: "Paraben Free" },
    { icon: FlaskConical, name: "Silicone Free" },
    { icon: Atom, name: "Sulphate Free" },
    { icon: Wheat, name: "Gluten Free" },
  ],
};
