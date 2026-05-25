import {
  DollarSign,
  Droplet,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Truck,
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
        icon: ShieldCheck,
        text: "Same price at every dose. No hidden fees.",
      },
      {
        icon: Truck,
        text: "Free expedited shipping.",
      },
      {
        icon: DollarSign,
        text: "No membership fees.",
      },
      {
        icon: Stethoscope,
        text: "Doctor-led plans, coaching & active community.",
      },
    ],
    pricing: {
      title: "Choose the plan best for you. No hidden fees.",
      sizes: [
        {
          title: "500mg (2.5mL vial)",
          subtitle:
            "Great for those starting slowly\nor using NAD+ 1-3x per week",
          plans: [
            { name: "3-Month Plan", price: 186 },
            { name: "Monthly Plan", price: 196 },
          ],
        },
        {
          title: "1000mg (5mL vial)",
          subtitle:
            "Best for those aiming for higher frequency (up to 5x/week)",
          plans: [
            { name: "3-Month Plan", price: 226 },
            { name: "Monthly Plan", price: 246 },
          ],
        },
      ],
    },
    description:
      "GLP-1 treatment plans are medically guided and personalized to your health profile to support sustainable weight loss. They may help reduce appetite, support weight loss, and improve blood sugar control as part of a structured care plan. Unlike generic approaches, your treatment includes licensed provider oversight, ongoing adjustments, and continuous support to improve consistency and outcomes. Start your free telehealth consultation to see if a personalized GLP-1 plan is right for you.",
  },
  faqs: [
    {
      question: "What's included with my plan?",
      answer:
        "Every HealSend plan is personalized to you. After reviewing your health profile, a licensed provider creates your treatment plan. If appropriate, you'll receive a tailored dosing schedule and prescription shipped directly to your door via a state-licensed pharmacy. You also get 24/7 messaging access to your care team for ongoing support.",
    },
    {
      question: "What treatment options do I have?",
      answer:
        "You'll be matched to a personalized GLP-1 program based on your goals, medical history, and eligibility. Options may include different medications and dosing plans optimized for weight loss. We're also expanding into oral GLP-1s and peptide-based programs for patients who are not suited for GLP-1s or want more targeted fat-loss support.",
    },
    {
      question: "What if I need to cancel?",
      answer:
        "You can cancel anytime in your patient portal with no fees or long-term commitments. Cancellation stops future billing, but does not affect orders already sent to the pharmacy. For pending orders, contact care@healsend.com for support.",
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
