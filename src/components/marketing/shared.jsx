"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  User2,
  Users,
  X,
} from "lucide-react";
import LoginPageClient from "@/components/auth/LoginPageClient";
import SignupPageClient from "@/components/auth/SignupPageClient";
import { MARKETING_ROUTE_PATHS } from "@/lib/marketing-pages";
import { useAuth } from "@/lib/AuthContext";
import { normalizeLoginRedirectPath } from "@/lib/auth-routing";
import { LEGAL_ROUTE_PATHS, SUPPORT_EMAIL } from "@/lib/legal-links";
import { WORDPRESS_MARKETING_IMAGES } from "@/lib/marketing-images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const ROUTES = MARKETING_ROUTE_PATHS;

/** Face stack shown on homepage product carousel cards (social proof). */
const CAROUSEL_MEMBER_FACE_STACK_SRCS = [
  "/images/4_Home_Doctors_Online_Consultation-Doctors_02.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Doctors_04.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Avatar.jpg",
  "/images/4_Home_Doctors_Online_Consultation-Testimonials_01.jpg",
];
const LEGITSCRIPT_VERIFICATION_URL =
  "https://www.legitscript.com/websites/?checker_keywords=healsend.com";
const HIDDEN_FOOTER_LINK_LABELS = new Set(["Privacy Policy", "Terms of Service"]);
const DESKTOP_NAV_PROMO_IMAGES = Object.freeze({
  weightLoss: WORDPRESS_MARKETING_IMAGES.tirzepatide,
  antiAging: WORDPRESS_MARKETING_IMAGES.nadInjection,
  strengthRecovery: WORDPRESS_MARKETING_IMAGES.sermorelin,
  sexualHealth: WORDPRESS_MARKETING_IMAGES.pt141,
});

const MARKETING_NAV_SECTIONS = [
  {
    label: "Weight Loss",
    href: ROUTES.weightLoss,
    groups: [
      {
        title: "The GLP-1 Essentials",
        links: [
          { label: "Tirzepatide Injections", href: "/tirzepatide-injections" },
          { label: "Semaglutide Injections", href: "/semaglutide-injections" },
          { label: "Triple-R Weight Loss", href: ROUTES.weightLoss },
        ],
      },
      {
        title: "Precision Recomposition",
        links: [
          { label: "Tesamorelin", href: "/funnels/glp-1" },
          { label: "Lipo-C (MIC/B12)", href: "/funnels/micc-b12-shots" },
          { label: "Neuro-Metabolic", href: "/funnels/glp-1" },
        ],
      },
      {
        title: "Daily Maintenance",
        links: [
          { label: "Tirzepatide Drops", href: "/tirzepatide-drops" },
          { label: "Tirzepatide Tablets", href: "/tirzepatide-tablets" },
          { label: "Semaglutide Tablets", href: "/semaglutide-tablets" },
          { label: "Microdose GLP-1", href: "/semaglutide-drops" },
        ],
      },
    ],
    get links() {
      return this.groups.flatMap((g) => g.links);
    },
    promo: {
      eyebrow: "Get started",
      headline: "Personalized GLP-1. Lose weight.",
      price: "From $129 per month",
      href: "/tirzepatide-injections",
      gradient: "from-[#fbf7ff] via-[#f5f0ff] to-[#eef4ff]",
      image: DESKTOP_NAV_PROMO_IMAGES.weightLoss,
    },
  },
  {
    label: "Hormones",
    href: ROUTES.strength,
    groups: [
      {
        title: "Testosterone Therapy",
        links: [
          { label: "TRT Injections", href: "/funnels/hrt-lite" },
          { label: "Enclomiphene", href: "/funnels/enclomiphene" },
          { label: "HCG", href: "/funnels/hrt-lite" },
        ],
      },
      {
        title: "Growth Hormone Secretagogues",
        links: [
          { label: "Next-Gen GH Peptides", href: "/funnels/performance-lab" },
          { label: "Oral GH Booster", href: "/funnels/growth-hormone-support" },
          { label: "Sermorelin Injections", href: "/funnels/sermorelin" },
        ],
      },
    ],
    get links() {
      return this.groups.flatMap((g) => g.links);
    },
    promo: {
      eyebrow: "Hormone support",
      headline: "Build strength. Recover faster.",
      price: "From $159 per month",
      href: "/sermorelin-injection-2",
      gradient: "from-[#eef6ff] via-[#f5fbff] to-[#f3f3ff]",
      image: DESKTOP_NAV_PROMO_IMAGES.strengthRecovery,
    },
  },
  {
    label: "Recovery",
    href: ROUTES.strength,
    groups: [
      {
        title: "Healing & Recovery",
        links: [
          { label: "The Wolverine Protocol", href: "/funnels/sermorelin" },
          { label: "Advanced Regenerative", href: "/funnels/performance-lab" },
          {
            label: "Total Body Reconstruction",
            href: "/funnels/performance-lab",
          },
        ],
      },
      {
        title: "Growth Hormone Secretagogues",
        links: [
          { label: "Next-Gen GH Peptides", href: "/funnels/performance-lab" },
          { label: "Oral GH Booster", href: "/funnels/growth-hormone-support" },
          { label: "Sermorelin Injections", href: "/funnels/sermorelin" },
        ],
      },
    ],
    get links() {
      return this.groups.flatMap((g) => g.links);
    },
    promo: {
      eyebrow: "Recovery plans",
      headline: "Recover faster. Perform stronger.",
      price: "From $159 per month",
      href: ROUTES.strength,
      gradient: "from-[#eef6ff] via-[#f5fbff] to-[#f3f3ff]",
      image: DESKTOP_NAV_PROMO_IMAGES.strengthRecovery,
    },
  },
  {
    label: "Sexual Health",
    href: ROUTES.sexualHealth,
    groups: [
      {
        title: "Desire & Connection",
        links: [
          { label: "PT-141 Nasal Spray", href: "/pt-141-nasal-spray" },
          { label: "Oxytocin Nasal Spray", href: "/oxytocin-nasal-spray" },
        ],
      },
      {
        title: "Physical Performance",
        links: [
          {
            label: "Surge\u00ae (Tadalafil + Sildenafil)",
            href: "/pt-141-surge-2-in-1",
          },
          { label: "Cialis\u00ae", href: "/generic-cialis" },
          { label: "Viagra\u00ae", href: "/viagra-sildenafil" },
        ],
      },
    ],
    get links() {
      return this.groups.flatMap((g) => g.links);
    },
    promo: {
      eyebrow: "Confidential care",
      headline: "Private support for desire and performance.",
      price: "From $129 per month",
      href: "/pt-141-nasal-spray",
      gradient: "from-[#fff5f5] via-[#fff9fb] to-[#f5f3ff]",
      image: DESKTOP_NAV_PROMO_IMAGES.sexualHealth,
    },
  },
  {
    label: "Longevity",
    href: ROUTES.antiAging,
    groups: [
      {
        title: "Cellular Longevity",
        links: [
          { label: "Systemic NAD+ Reset", href: ROUTES.nad },
          {
            label: "Telomere Lengthening",
            href: "/funnels/nad-injection-therapy",
          },
          {
            label: "Mitochondrial Repair",
            href: "/funnels/nad-injection-therapy",
          },
          {
            label: "Cellular Clearance",
            href: "/funnels/nad-injection-therapy",
          },
        ],
      },
      {
        title: "Photo-Aging Recovery",
        links: [
          { label: "Glutathione", href: "/funnels/glutathione" },
          { label: "Glow Blend", href: "/funnels/glutathione" },
          { label: "GHK-Cu", href: "/funnels/nad-glutathione" },
        ],
      },
      {
        title: "Increase Energy",
        links: [
          { label: "NAD+ Injections", href: "/nad-injections" },
          { label: "NAD+ Nasal Spray", href: "/nad-nasal-spray" },
          { label: "Sermorelin Injections", href: "/funnels/sermorelin" },
          { label: "MIC+", href: "/funnels/micc-b12-shots" },
        ],
      },
    ],
    get links() {
      return this.groups.flatMap((g) => g.links);
    },
    promo: {
      eyebrow: "Most popular",
      headline: "Personalized NAD treatments.",
      price: "From $129 first month*",
      href: ROUTES.nad,
      gradient: "from-[#f7f2ea] via-[#fff8ef] to-[#eef5ff]",
      image: DESKTOP_NAV_PROMO_IMAGES.antiAging,
    },
  },
  {
    label: "Skin & Hair",
    href: ROUTES.antiAging,
    groups: [
      {
        title: "Aesthetics",
        links: [
          { label: "Master Antioxidant", href: "/funnels/glutathione" },
          { label: "Glow Blend", href: "/funnels/glutathione" },
          { label: "GHK-Cu Protocol", href: "/funnels/nad-glutathione" },
          { label: "NAD+ Reset", href: "/nad-injections" },
        ],
      },
    ],
    get links() {
      return this.groups.flatMap((g) => g.links);
    },
    promo: {
      eyebrow: "Aesthetics",
      headline: "Skin & Hair with NAD+.",
      price: "From $129 first month*",
      href: ROUTES.nad,
      gradient: "from-[#fff5f5] via-[#fff9fb] to-[#f5f3ff]",
      image: DESKTOP_NAV_PROMO_IMAGES.antiAging,
    },
  },
  {
    label: "Brain Health",
    href: ROUTES.shop,
    groups: [
      {
        title: "Neuro-Regeneration",
        links: [
          { label: "BDNF & Brain Fog", href: "/funnels/nad-nasal-spray" },
          { label: "Anxiety-Free Focus", href: "/funnels/nad-nasal-spray" },
          { label: "Neuronal Growth", href: "/funnels/nad-nasal-spray" },
          { label: "Intranasal NAD+", href: "/nad-nasal-spray" },
        ],
      },
      {
        title: "Insomnia & Sleep",
        links: [
          { label: "Delta-Sleep Protocol", href: "/funnels/sleep" },
          { label: "Trazodone", href: "/funnels/sleep" },
          { label: "Ramelteon", href: "/funnels/sleep" },
        ],
      },
      {
        title: "Anxiety & Social Calm",
        links: [
          { label: "Propranolol", href: "/funnels/sleep" },
          { label: "Anxiolytic Peptide", href: "/funnels/nad-nasal-spray" },
        ],
      },
    ],
    get links() {
      return this.groups.flatMap((g) => g.links);
    },
    promo: {
      eyebrow: "Cognitive support",
      headline: "Sharper Mind treatments.",
      price: "From $129 first month*",
      href: ROUTES.nad,
      gradient: "from-[#f7f2ea] via-[#fff8ef] to-[#eef5ff]",
      image: DESKTOP_NAV_PROMO_IMAGES.antiAging,
    },
  },
  {
    label: "Gut Health",
    href: ROUTES.shop,
    groups: [
      {
        title: "Total Gut Reset",
        links: [
          { label: "Leaky Gut Repair", href: "/funnels/glutathione-ldn" },
          { label: "Deep Inflammation Calm", href: "/funnels/glutathione-ldn" },
          { label: "Stomach Lining Support", href: "/funnels/glutathione-ldn" },
        ],
      },
    ],
    get links() {
      return this.groups.flatMap((g) => g.links);
    },
    promo: {
      eyebrow: "Gut care",
      headline: "Total Gut Reset.",
      price: "From $129 per month",
      href: ROUTES.shop,
      gradient: "from-[#eef6ff] via-[#f5fbff] to-[#f3f3ff]",
      image: DESKTOP_NAV_PROMO_IMAGES.weightLoss,
    },
  },
];

function buildLoopingItems(items, minimumCount = 8) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const repeatCount =
    items.length < minimumCount ? Math.ceil(minimumCount / items.length) : 1;

  return Array.from({ length: repeatCount }).flatMap(() => items);
}

function useNearViewport(rootMargin = "320px 0px") {
  const elementRef = useRef(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return [elementRef, isNearViewport];
}

const MOBILE_EXPLORE_ITEMS = [
  {
    key: "weight-loss-fast",
    label: "Lose Weight Fast",
    href: ROUTES.weightLoss,
    links: MARKETING_NAV_SECTIONS[0].links,
  },
  {
    key: "power-every-cell",
    label: "Power Every Cell",
    href: ROUTES.nad,
    links: MARKETING_NAV_SECTIONS[4].links,
  },
  {
    key: "sexual-health",
    label: "Sexual Health",
    href: ROUTES.sexualHealth,
    links: MARKETING_NAV_SECTIONS[3].links,
  },
  {
    key: "strength-recovery",
    label: "Strength & Recovery",
    href: ROUTES.strength,
    links: MARKETING_NAV_SECTIONS[2].links,
  },
  {
    key: "anti-aging",
    label: "Longevity",
    href: ROUTES.antiAging,
    links: MARKETING_NAV_SECTIONS[4].links,
  },
];

const _MOBILE_TOP_TREATMENTS = [
  {
    title: "NAD",
    href: ROUTES.nad,
    image: WORDPRESS_MARKETING_IMAGES.nadInjection,
    primaryBadge: "Cellular",
    secondaryBadge: "Rx",
  },
  {
    title: "PT-141",
    href: "/pt-141-nasal-spray",
    image: WORDPRESS_MARKETING_IMAGES.pt141,
    primaryBadge: "Popular",
    secondaryBadge: "Rx",
  },
  {
    title: "Tirzepatide",
    href: "/tirzepatide-injections",
    image: WORDPRESS_MARKETING_IMAGES.tirzepatide,
    primaryBadge: "GLP-1",
    secondaryBadge: "Rx",
  },
  {
    title: "Sermorelin",
    href: "/sermorelin-injection-2",
    image: WORDPRESS_MARKETING_IMAGES.sermorelin,
    primaryBadge: "Recovery",
    secondaryBadge: "Rx",
  },
];

const _MOBILE_SECTION_TO_NAV_LABEL = Object.freeze({
  "weight-loss-fast": "Weight Loss",
  "power-every-cell": "Longevity",
  "sexual-health": "Sexual Health",
  "strength-recovery": "Recovery",
  "anti-aging": "Longevity",
});

const MOBILE_CATEGORY_ITEMS = [
  {
    key: "cat-weight-loss",
    label: "Weight Loss",
    href: ROUTES.weightLoss,
    links: MARKETING_NAV_SECTIONS[0].links,
    promo: MARKETING_NAV_SECTIONS[0].promo,
  },
  {
    key: "cat-hormones",
    label: "Hormones",
    href: ROUTES.strength,
    links: MARKETING_NAV_SECTIONS[1].links,
    promo: MARKETING_NAV_SECTIONS[1].promo,
  },
  {
    key: "cat-recovery",
    label: "Recovery",
    href: ROUTES.strength,
    links: MARKETING_NAV_SECTIONS[2].links,
    promo: MARKETING_NAV_SECTIONS[2].promo,
  },
  {
    key: "cat-sexual-health",
    label: "Sexual Health",
    href: ROUTES.sexualHealth,
    links: MARKETING_NAV_SECTIONS[3].links,
    promo: MARKETING_NAV_SECTIONS[3].promo,
  },
  {
    key: "cat-longevity",
    label: "Longevity",
    href: ROUTES.antiAging,
    links: MARKETING_NAV_SECTIONS[4].links,
    promo: MARKETING_NAV_SECTIONS[4].promo,
  },
  {
    key: "cat-skin-hair",
    label: "Skin & Hair",
    href: ROUTES.antiAging,
    links: MARKETING_NAV_SECTIONS[5].links,
    promo: MARKETING_NAV_SECTIONS[5].promo,
  },
  {
    key: "cat-brain-health",
    label: "Brain Health",
    href: ROUTES.shop,
    links: MARKETING_NAV_SECTIONS[6].links,
    promo: MARKETING_NAV_SECTIONS[6].promo,
  },
  {
    key: "cat-gut-health",
    label: "Gut Health",
    href: ROUTES.shop,
    links: MARKETING_NAV_SECTIONS[7].links,
    promo: MARKETING_NAV_SECTIONS[7].promo,
  },
];

const MARKETING_FOOTER_SECTIONS = Object.freeze([
  {
    title: "Popular Weight Loss",
    links: [
      { label: "GLP-1 Treatments", href: ROUTES.weightLoss },
      { label: "Tirzepatide Injection", href: "/tirzepatide-injections" },
      { label: "Tirzepatide Drops", href: "/tirzepatide-drops" },
      { label: "Semaglutide Injection", href: "/semaglutide-injections" },
    ],
  },
  {
    title: "Sexual Health",
    links: [{ label: "PT-141 Nasal Spray", href: "/pt-141-nasal-spray" }],
  },
  {
    title: "Anti-aging",
    links: [
      { label: "NAD+ Injection", href: "/nad-injections" },
      { label: "NAD+ Nasal Spray", href: "/nad-nasal-spray" },
      { label: "Sermorelin Injection", href: "/funnels/sermorelin" },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        label: "Telehealth Consent",
        href: LEGAL_ROUTE_PATHS.telehealthConsent,
      },
      { label: "Safety Information", href: LEGAL_ROUTE_PATHS.safety },
      {
        label: "My Health My Data",
        href: LEGAL_ROUTE_PATHS.consumerHealthData,
      },
      { label: "Terms", href: LEGAL_ROUTE_PATHS.terms },
      { label: "Privacy", href: LEGAL_ROUTE_PATHS.privacy },
      { label: "Refund Policy", href: LEGAL_ROUTE_PATHS.refund },
    ],
  },
]);

const MARKETING_FOOTER_PATIENT_CARE = Object.freeze([
  { label: "1-631-800-9294", href: "tel:16318009294" },
  { label: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
  { label: "31 Hudson Yards, NY, NY 10001" },
]);

function MarketingFooterSection({ title, links }) {
  return (
    <div>
      <h4 className="mb-6 text-sm font-bold">{title}</h4>
      <ul className="space-y-4 text-sm text-gray-400">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            {link.href ? (
              <Link
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ) : (
              link.label
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Convert flat DB navigation items (with nested children) to the MARKETING_NAV_SECTIONS format.
// Falls back to hardcoded promo/groups for matching section labels.
function buildNavSectionsFromDb(dbItems) {
  return dbItems.map((item) => {
    const fallback = MARKETING_NAV_SECTIONS.find(
      (s) => s.label.toLowerCase() === item.label.toLowerCase(),
    );
    const childLinks = (item.children || []).map((c) => ({
      label: c.label,
      href: c.url,
    }));
    const groups =
      childLinks.length > 0
        ? [{ title: "", links: childLinks }]
        : (fallback?.groups ?? []);
    return {
      label: item.label,
      href: item.url,
      groups,
      get links() {
        return this.groups.flatMap((g) => g.links);
      },
      promo: fallback?.promo ?? null,
    };
  });
}

// Build mobile category items from nav sections (matches the shape of MOBILE_CATEGORY_ITEMS).
function buildMobileCategoryItemsFromSections(sections) {
  return sections.map((s) => ({
    key: `cat-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label: s.label,
    href: s.href,
    get links() {
      return s.links;
    },
    promo: s.promo,
  }));
}

export function MarketingNavbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const [authOverlayMode, setAuthOverlayMode] = useState(null);
  const [navSections, setNavSections] = useState(MARKETING_NAV_SECTIONS);
  const [mobileCatItems, setMobileCatItems] = useState(MOBILE_CATEGORY_ITEMS);
  const [authRedirectPath, setAuthRedirectPath] = useState("");
  const [authProviderConfig, setAuthProviderConfig] = useState({
    google: true,
    apple: true,
  });
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const closeTimeout = useRef(null);
  const secondaryCta = isAuthenticated
    ? null
    : { href: ROUTES.login, label: "Sign In" };
  const primaryCta = isAuthenticated
    ? user?.role === "ADMIN"
      ? { href: "/dashboard", label: "Dashboard" }
      : { href: "/account", label: "My Account" }
    : null;
  const mobileAccountCta = isAuthenticated
    ? primaryCta
    : { href: ROUTES.login, label: "Sign In" };

  const activeSection =
    navSections.find((section) => section.label === activeMenu) || null;
  const _activeMobileSection =
    MOBILE_EXPLORE_ITEMS.find((item) => item.key === mobileSection) || null;
  const dropdownSection = activeSection || navSections[0];
  const activeNavCategory =
    mobileCatItems.find((item) => item.key === mobileSection) || null;

  const openMenu = (label) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setActiveMenu(label);
  };

  const scheduleClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = setTimeout(() => setActiveMenu(null), 140);
  };

  const cancelClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileSection(null);
  };

  const openAuthOverlay = (mode, redirectTo = "") => {
    setActiveMenu(null);
    closeMobileMenu();
    const nextRedirect = normalizeLoginRedirectPath(redirectTo);
    setAuthRedirectPath(nextRedirect);
    setAuthOverlayMode(mode);
  };

  const closeAuthOverlay = () => {
    setAuthOverlayMode(null);
    setAuthRedirectPath("");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const clickedInsideHeader =
        headerRef.current && headerRef.current.contains(event.target);
      const clickedInsideMobilePanel =
        mobilePanelRef.current && mobilePanelRef.current.contains(event.target);

      if (!clickedInsideHeader && !clickedInsideMobilePanel) {
        setActiveMenu(null);
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      setMobileSection(null);
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let isMounted = true;

    async function loadAuthProviders() {
      try {
        const response = await fetch("/api/auth/providers", {
          cache: "no-store",
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (isMounted) {
          setAuthProviderConfig({
            google: Boolean(data?.google),
            apple: Boolean(data?.apple),
          });
        }
      } catch {}
    }

    loadAuthProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load header navigation from DB; fall back to hardcoded if DB has no items
  useEffect(() => {
    let isMounted = true;
    async function loadHeaderNav() {
      try {
        const res = await fetch("/api/navigation?location=header", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.items || data.items.length === 0) return;
        if (!isMounted) return;
        const sections = buildNavSectionsFromDb(data.items);
        setNavSections(sections);
        setMobileCatItems(buildMobileCategoryItemsFromSections(sections));
      } catch {}
    }
    loadHeaderNav();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const authMode = searchParams.get("auth");
    if (authMode !== "login" && authMode !== "signup") {
      return;
    }

    const nextRedirect = normalizeLoginRedirectPath(
      searchParams.get("redirect") || "",
    );
    setAuthRedirectPath(nextRedirect);
    setAuthOverlayMode(authMode);

    if (typeof window !== "undefined") {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("auth");
      nextParams.delete("redirect");
      const nextQuery = nextParams.toString();
      const nextUrl = `${pathname || "/"}${nextQuery ? `?${nextQuery}` : ""}`;
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }, [pathname, searchParams]);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50"
        onMouseLeave={scheduleClose}
      >
        {/* Glass fill — always visible, stronger on scroll */}
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            scrolled
              ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,247,255,0.94)_50%,rgba(235,240,255,0.95)_100%)] backdrop-blur-2xl"
              : "bg-white/90 backdrop-blur-xl"
          }`}
        />
        {/* Top specular highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
        {/* Bottom border */}
        <div
          className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-40"
          }`}
        />
        {/* Drop shadow below header */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-8 translate-y-full bg-[linear-gradient(180deg,rgba(15,23,42,0.06),transparent)] transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-30"
          }`}
        />

        <div className="relative px-4 py-3">
          <div className="mx-auto max-w-[1340px] px-4 py-2 md:px-8">
            <div className="flex items-center justify-between gap-3 rounded-[1.7rem]  md:px-5">
              <Link
                href={ROUTES.home}
                className="flex shrink-0 items-center"
                onClick={() => {
                  setActiveMenu(null);
                  closeMobileMenu();
                }}
              >
                <Image
                  src="/logo.png"
                  alt="HealSend"
                  width={164}
                  height={52}
                  priority
                  className="h-12 w-auto md:h-14"
                />
              </Link>

              <div className="relative hidden xl:block">
                <nav className="flex items-center gap-5">
                  {navSections.map((section) => {
                    const isActive = activeMenu === section.label;

                    return (
                      <Link
                        key={section.label}
                        href={section.href}
                        onMouseEnter={() => openMenu(section.label)}
                        onFocus={() => openMenu(section.label)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-1 py-2 text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${
                          isActive
                            ? "text-[#111827]"
                            : "text-[#4b5565] hover:text-[#111827]"
                        }`}
                      >
                        <span>{section.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 sm:hidden">
                  {isAuthenticated ? (
                    <Link
                      href={mobileAccountCta.href}
                      className="hs-outline-btn inline-flex min-w-[104px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
                    >
                      <span>{mobileAccountCta.label}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAuthOverlay("login")}
                      className="hs-outline-btn inline-flex min-w-[92px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
                    >
                      <span>{mobileAccountCta.label}</span>
                    </button>
                  )}
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  {secondaryCta ? (
                    <button
                      type="button"
                      onClick={() => openAuthOverlay("login")}
                      className="hs-outline-btn inline-flex min-w-[92px] items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
                    >
                      <span>{secondaryCta.label}</span>
                    </button>
                  ) : null}
                  {primaryCta ? (
                    <Link
                      href={primaryCta.href}
                      className="hs-solid-btn inline-flex min-w-[122px] items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
                    >
                      <span>{primaryCta.label}</span>
                    </Link>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen((currentValue) => !currentValue)
                  }
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/70 text-[#111827] shadow-[0_2px_8px_rgba(15,23,42,0.10),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all hover:bg-white/90 hover:shadow-[0_4px_14px_rgba(15,23,42,0.14)] xl:hidden"
                  aria-label="Open navigation menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-x-0 top-full hidden border-t border-white/30 bg-[linear-gradient(160deg,rgba(255,255,255,0.82)_0%,rgba(247,249,255,0.88)_100%)] backdrop-blur-2xl shadow-[0_28px_60px_rgba(15,23,42,0.12),0_1px_0_rgba(255,255,255,0.9)_inset] transition-all duration-200 ease-out xl:block ${
            activeSection
              ? "visible translate-y-0"
              : "pointer-events-none invisible -translate-y-2"
          }`}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="mx-auto max-w-[1340px] px-4 py-4 md:px-8">
            <div
              className={`grid overflow-hidden rounded-[1.55rem] ${dropdownSection.promo ? "md:grid-cols-[1.12fr_0.88fr]" : ""}`}
            >
              <div className="px-5 py-5">
                <div
                  className={`${(dropdownSection.groups || []).length > 2 ? "grid grid-cols-2 gap-x-6 gap-y-5" : "space-y-5"}`}
                >
                  {(dropdownSection.groups || []).map((group) => (
                    <div key={group.title}>
                      <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.26em] text-[#6f63c7]">
                        {group.title}
                      </p>
                      <div className="space-y-0.5">
                        {group.links.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="group flex items-center justify-between rounded-[0.9rem] px-3 py-2 text-[14px] font-semibold text-[#111827] transition-colors duration-200 hover:bg-white/85 hover:text-[#5a43d6]"
                          >
                            <span>{item.label}</span>
                            <ChevronRight className="h-4 w-4 text-[#9aa3b2] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#5a43d6]" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {dropdownSection.promo && (
                <div className="border-t border-[#e8edf4] px-5 py-5 md:border-l md:border-t-0">
                  <Link
                    href={dropdownSection.promo.href}
                    className={`group relative block min-h-[22rem] overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${dropdownSection.promo.gradient} shadow-[0_14px_34px_rgba(15,23,42,0.08)]`}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,24,0.08)_0%,rgba(10,14,24,0.2)_38%,rgba(10,14,24,0.58)_100%)]" />
                    <Image
                      src={dropdownSection.promo.image}
                      alt={dropdownSection.promo.headline}
                      fill
                      sizes="(min-width: 768px) 28rem, 100vw"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="relative flex min-h-[22rem] flex-col justify-end p-5 text-white">
                      <div className="max-w-[15rem]">
                        <h3 className="text-[1.55rem] font-semibold leading-[1.02] tracking-tight text-white">
                          {dropdownSection.promo.headline}
                        </h3>
                        <div className="mt-5">
                          <span className="hs-solid-btn inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors">
                            <span>Explore now</span>
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-[rgba(17,24,39,0.28)] backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileMenu}
      />

      <div
        ref={mobilePanelRef}
        className={`fixed bottom-0 right-0 top-0 z-[70] flex w-full max-w-sm flex-col bg-white shadow-[0_30px_80px_rgba(15,23,42,0.24)] transition-transform duration-300 xl:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button row */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          {isAuthenticated ? (
            <div className="w-full flex items-center justify-between gap-2">
              <h6>Menu</h6>
              <Link
                href={user?.role === "ADMIN" ? "/dashboard" : "/account"}
                onClick={closeMobileMenu}
                className="flex items-center gap-2 rounded-full  px-3 py-1.5 text-md font-semibold text-[#1c1a24] hover:bg-[#eef0fa] transition-colors"
              >
                <User2 className="h-6 w-6 text-[#5d62f3] " />
                {/* <span className="max-w-[120px] truncate">
                  {user?.email ?? "Account"}
                </span> */}
              </Link>
              {/* <button
                type="button"
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="flex items-center gap-1.5 rounded-full border border-[#e8edf5] bg-[#f5f7fd] px-3 py-1.5 text-sm font-semibold text-[#e05252] hover:bg-[#fff0f0] transition-colors"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button> */}
            </div>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center text-[#1c1a24]"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {/* Main panel */}
          <div
            className={`h-full overflow-y-auto transition-all duration-300 ease-out ${
              activeNavCategory
                ? "-translate-x-8 opacity-0 pointer-events-none"
                : "translate-x-0 opacity-100"
            }`}
          >
            {/* Treatment Categories */}
            <div className="border-t border-gray-200">
              <div className="px-6 pt-5 pb-3">
                <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Treatment Categories
                </p>
              </div>
              {mobileCatItems.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setMobileSection(cat.key)}
                  className="flex w-full items-center justify-between border-b border-gray-100 px-6 py-4 group"
                >
                  <span className="text-[22px] font-normal text-[#1c1a24] group-hover:text-black transition-colors">
                    {cat.label}
                  </span>
                  <ChevronRight className="h-5 w-5 text-[#1c1a24]" />
                </button>
              ))}
            </div>

            {/* Get Started */}
            <div className="border-t border-gray-200 px-6 pt-6 pb-6">
              <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-4">
                Get Started
              </p>
              <Link href="/tirzepatide-injections" onClick={closeMobileMenu}>
                <div className="relative rounded-2xl overflow-hidden bg-[#2db560] min-h-[160px] flex items-end p-4">
                  <div className="absolute right-0 bottom-0 w-44 h-44 pointer-events-none">
                    <Image
                      src="/images/marketing/weight-loss-image-menu-cutout.png"
                      alt="GLP-1 treatments"
                      fill
                      className="object-contain object-right-bottom"
                      sizes="176px"
                    />
                  </div>
                  <div className="relative z-10 max-w-[55%]">
                    <p className="text-white font-bold text-[18px] leading-snug mb-3">
                      Personalized GLP-1 Treatments
                    </p>
                    <span className="inline-block bg-white/20 text-white text-[12px] font-medium rounded-full px-3 py-1">
                      From $129 first month*
                    </span>
                  </div>
                </div>
              </Link>
              <p className="mt-2 text-[11px] text-gray-400">
                *First month discount on 3-month plan.
              </p>
            </div>

            {/* Discover HealSend */}
            <div className="border-t border-gray-200 px-6 pt-6 pb-10">
              <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-4">
                Discover HealSend
              </p>
              <div className="space-y-4">
                {[{ label: "Blog", href: "/blog" }].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block text-[22px] font-normal text-[#1c1a24] hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-panel */}
          <div
            className={`absolute inset-0 h-full overflow-y-auto transition-transform duration-300 ease-out ${
              activeNavCategory
                ? "translate-x-0"
                : "translate-x-full pointer-events-none"
            }`}
          >
            {activeNavCategory ? (
              <div className="flex flex-col h-full">
                {/* Sub-panel header */}
                <div className="flex items-center px-5 pt-5 pb-4 border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => setMobileSection(null)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1c1a24]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 pt-5 pb-3">
                    <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                      {activeNavCategory.label}
                    </p>
                  </div>

                  {activeNavCategory.links.length > 0 ? (
                    <>
                      <Link
                        href={activeNavCategory.href}
                        onClick={closeMobileMenu}
                        className="flex items-center justify-between border-b border-gray-100 px-6 py-4 group"
                      >
                        <span className="text-[22px] font-normal text-[#1c1a24] group-hover:text-black transition-colors">
                          Browse all
                        </span>
                        <ChevronRight className="h-5 w-5 text-[#1c1a24]" />
                      </Link>
                      {activeNavCategory.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={closeMobileMenu}
                          className="flex items-center justify-between border-b border-gray-100 px-6 py-4 group"
                        >
                          <span className="text-[22px] font-normal text-[#1c1a24] group-hover:text-black transition-colors">
                            {link.label}
                          </span>
                          <ChevronRight className="h-5 w-5 text-[#1c1a24]" />
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={activeNavCategory.href}
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between border-b border-gray-100 px-6 py-4 group"
                    >
                      <span className="text-[22px] font-normal text-[#1c1a24] group-hover:text-black transition-colors">
                        Browse all
                      </span>
                      <ChevronRight className="h-5 w-5 text-[#1c1a24]" />
                    </Link>
                  )}

                  {activeNavCategory.promo ? (
                    <div className="px-6 pt-6 pb-10">
                      <Link
                        href={activeNavCategory.promo.href}
                        onClick={closeMobileMenu}
                        className="group relative block min-h-[220px] overflow-hidden rounded-[1.35rem] border border-[#e2e8f0] shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
                      >
                        <Image
                          src={activeNavCategory.promo.image}
                          alt={activeNavCategory.promo.headline}
                          fill
                          sizes="84vw"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,14,24,0.08)_0%,rgba(10,14,24,0.22)_38%,rgba(10,14,24,0.62)_100%)]" />
                        <div className="relative flex min-h-[220px] flex-col justify-end p-5 text-white">
                          <h4 className="max-w-[14rem] text-[1.35rem] font-semibold leading-[1.04] tracking-tight">
                            {activeNavCategory.promo.headline}
                          </h4>
                          <div className="mt-4">
                            <span className="hs-solid-btn inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors">
                              <span>Explore now</span>
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {authOverlayMode === "signup" ? (
        <SignupPageClient
          redirectPathOverride={authRedirectPath}
          enableGoogleAuth={authProviderConfig.google}
          enableAppleAuth={authProviderConfig.apple}
          onClose={closeAuthOverlay}
          onSwitchToLogin={() => setAuthOverlayMode("login")}
          overlay
        />
      ) : null}

      {authOverlayMode === "login" ? (
        <LoginPageClient
          redirectPathOverride={authRedirectPath}
          enableGoogleAuth={authProviderConfig.google}
          enableAppleAuth={authProviderConfig.apple}
          onClose={closeAuthOverlay}
          onSwitchToSignup={() => setAuthOverlayMode("signup")}
          overlay
        />
      ) : null}
    </>
  );
}

export function MarketingFooter() {
  const [openMobileFooterSection, setOpenMobileFooterSection] = useState(null);
  const [footerSections, setFooterSections] = useState(
    MARKETING_FOOTER_SECTIONS,
  );

  // Load footer navigation from DB; falls back to hardcoded if DB has no items
  useEffect(() => {
    let isMounted = true;
    async function loadFooterNav() {
      try {
        const res = await fetch("/api/navigation?location=footer", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.items || data.items.length === 0) return;
        if (!isMounted) return;
        setFooterSections(
          data.items.map((item) => ({
            title: item.label,
            links: (item.children || []).map((c) => ({
              label: c.label,
              href: c.url,
            })),
          })),
        );
      } catch {}
    }
    loadFooterNav();
    return () => {
      isMounted = false;
    };
  }, []);

  const mobileSections = [
    ...footerSections,
    {
      title: "HealSend Patient Care",
      links: MARKETING_FOOTER_PATIENT_CARE,
    },
  ];

  return (
    <footer className="bg-[#1c1d20] px-4 py-12 text-white md:px-8">
      <div className="mx-auto mb-10 max-w-[1340px] md:hidden">
        <div>
          {mobileSections.map((section) => {
            const isOpen = openMobileFooterSection === section.title;

            return (
              <div key={section.title} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setOpenMobileFooterSection(isOpen ? null : section.title)
                  }
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-bold text-white">
                    {section.title}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-3 pb-4 text-sm text-gray-400">
                      {section.links
                        .filter((link) => !HIDDEN_FOOTER_LINK_LABELS.has(link.label))
                        .map((link) => (
                        <li key={`${section.title}-${link.label}`}>
                          {link.href ? (
                            <Link
                              href={link.href}
                              className="transition-colors hover:text-white"
                            >
                              {link.label}
                            </Link>
                          ) : (
                            link.label
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mb-12 hidden max-w-[1340px] grid-cols-2 gap-6 md:grid md:grid-cols-5">
        {footerSections.map((section) => (
          <MarketingFooterSection key={section.title} {...section} />
        ))}
        <div>
          <h4 className="mb-6 text-sm font-bold">HealSend Patient Care</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            {MARKETING_FOOTER_PATIENT_CARE
              .filter((item) => !HIDDEN_FOOTER_LINK_LABELS.has(item.label))
              .map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile: LegitScript above HealSend, centered, below accordions. Desktop: row with logo left. */}
      <div className="mx-auto mt-2 max-w-[1340px] md:mt-12">
        <div className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-end md:justify-between">
          <div className="order-1 shrink-0 md:order-2">
            <a
              href={LEGITSCRIPT_VERIFICATION_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Verify HealSend with LegitScript"
              className="block transition-opacity hover:opacity-90"
            >
              <img
                src="/legitscript-verification-badge.png"
                alt="LegitScript verification badge"
                width={400}
                height={140}
                decoding="async"
                className="h-24 w-auto max-w-full object-contain sm:h-[6.75rem] md:h-28 lg:h-32"
              />
            </a>
          </div>

          <div className="order-2 shrink-0 md:order-1">
            <Link
              href={ROUTES.home}
              className="block transition-opacity hover:opacity-90"
            >
              <img
                src="/logo.png"
                alt="HealSend"
                width={320}
                height={80}
                decoding="async"
                className="h-[4.5rem] w-auto max-w-full object-contain md:h-[5rem]"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MarketingBanner({
  title,
  secondTitle,
  subtitle,
  buttonText,
  buttonHref,
  image,
  backgroundImage,
  backgroundPosition = "center center",
  video,
  eagerMedia = false,
}) {
  const stageBackground = backgroundImage || image || null;
  const [sectionRef, shouldLoadMedia] = useNearViewport();
  const shouldRenderMedia = eagerMedia || shouldLoadMedia;

  return (
    <section
      ref={sectionRef}
      className="relative my-10 flex min-h-[430px] items-center justify-center overflow-hidden rounded-[24px] border border-black/5 bg-white text-center shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:min-h-[520px] lg:min-h-[730px]"
    >
      <div className="absolute inset-0 z-0 bg-[#ffffff]" />
      <div className="absolute inset-0 z-0">
        {stageBackground && !video && shouldRenderMedia ? (
          <div
            className="h-full w-full scale-[1.02] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${stageBackground}")`,
              backgroundPosition,
            }}
          />
        ) : null}
        {video && shouldRenderMedia ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : null}
        <div
          className={`absolute inset-0 ${
            video
              ? "bg-black/38"
              : "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(12,14,20,0.5)_55%,rgba(12,14,20,0.74)_100%)]"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_40%)]" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-[960px] flex-col items-center px-5 py-12 text-white sm:px-8 lg:px-10 lg:py-16">
        <h2 className="[font-family:'Open_Sans',sans-serif] mb-5 text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.7rem] lg:text-[40px]">
          {title}
        </h2>
        {secondTitle ? (
          <p className="[font-family:'Open_Sans',sans-serif] mb-4 text-base font-light text-gray-100 sm:text-xl lg:text-[32px]">
            {secondTitle}
          </p>
        ) : null}
        <Link
          href={buttonHref}
          className="[font-family:'Open_Sans',sans-serif] hs-solid-btn mb-5 rounded-full px-8 py-3.5 text-[15px] font-bold transition-all duration-300 hover:-translate-y-0.5 sm:px-9 sm:py-4 sm:text-[17px] lg:text-[22px]"
        >
          {buttonText}
        </Link>
        {subtitle ? (
          <p className="[font-family:'Open_Sans',sans-serif] whitespace-pre-line text-[0.98rem] font-light text-gray-100 sm:text-[1.2rem] lg:text-[1.65rem]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}

const marketingProductCarouselNavButtonClassName =
  "inline-flex size-10 shrink-0 aspect-square items-center justify-center rounded-full border border-gray-200 bg-white p-0 text-gray-700 shadow-none transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300/80 focus-visible:ring-offset-2";

export function MarketingProductCarousel({ products, eagerImages = false }) {
  const [api, setApi] = useState(null);
  const isTransitioningRef = useRef(false);
  const releaseTimeoutRef = useRef(null);
  const carouselProducts = buildLoopingItems(products, 8);

  useEffect(() => {
    return () => {
      if (releaseTimeoutRef.current) {
        clearTimeout(releaseTimeoutRef.current);
      }
    };
  }, []);

  const step = (direction) => {
    if (!api || isTransitioningRef.current) {
      return;
    }

    isTransitioningRef.current = true;
    if (releaseTimeoutRef.current) {
      clearTimeout(releaseTimeoutRef.current);
    }

    if (direction === "left") {
      api.scrollPrev();
    } else {
      api.scrollNext();
    }

    releaseTimeoutRef.current = setTimeout(() => {
      isTransitioningRef.current = false;
    }, 420);
  };

  return (
    <section className="relative w-full py-8">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          containScroll: false,
          loop: carouselProducts.length > 1,
          duration: 32,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 items-stretch md:-ml-6 lg:-ml-8">
          {carouselProducts.map((product, productIndex) => (
            <CarouselItem
              key={`${product.title}-${productIndex}`}
              className="basis-[88%] pl-4 sm:basis-[52%] md:pl-6 lg:basis-[30%] lg:pl-8 xl:basis-[23%]"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative flex h-[148px] items-center justify-center overflow-hidden bg-[#f4f5f9] sm:h-[168px]">
                  <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-1rem)] flex-wrap gap-1">
                    {product.tags.map((tag) => (
                      <span
                        key={`${product.title}-${tag.label}`}
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${tag.bg} ${tag.text}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    loading={eagerImages ? "eager" : undefined}
                    sizes="(min-width: 1280px) 23vw, (min-width: 640px) 52vw, 88vw"
                    className="block h-full w-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-3.5 sm:pt-3.5">
                  <h3 className="mb-1 text-center text-lg font-bold leading-snug text-[#7b75f0] sm:text-left sm:text-xl">
                    {product.title}
                  </h3>
                  <p className="mb-3 text-center font-body text-[10px] font-normal leading-snug tracking-[0.02em] text-[#c5cad5] sm:mb-2.5 sm:text-left sm:text-[11px]">
                    {product.price}
                  </p>

                  <div className="mb-3 flex shrink-0 flex-col items-center gap-1">
                    <div className="flex justify-center -space-x-1.5">
                      {CAROUSEL_MEMBER_FACE_STACK_SRCS.map((src) => (
                        <span
                          key={src}
                          className="relative h-[22px] w-[22px] shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#eef0f8]"
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="22px"
                            className="object-cover object-center"
                          />
                        </span>
                      ))}
                    </div>
                    <p className="font-body text-[9px] font-semibold uppercase tracking-[0.14em] text-[#cdd3dc]">
                      2k+ members
                    </p>
                  </div>

                  {product.isAssessment ? (
                    <Link
                      href={product.href}
                      className="hs-solid-btn mt-auto block w-full rounded-full py-2.5 text-center text-sm font-bold transition-colors sm:py-3"
                    >
                      Start assessment
                    </Link>
                  ) : (
                    <div className="mt-auto flex gap-2">
                      <Link
                        href={product.href}
                        className="hs-solid-btn flex-1 rounded-full py-2.5 text-center text-xs font-bold transition-colors sm:py-3 sm:text-sm"
                      >
                        Get Started
                      </Link>
                      <Link
                        href={product.secondaryHref || product.href}
                        className="hs-outline-btn flex-1 rounded-full py-2.5 text-center text-xs font-bold transition-colors sm:py-3 sm:text-sm"
                      >
                        Learn more
                      </Link>
                    </div>
                  )}
                  <span className="mt-3 block text-center font-body text-[9px] font-normal tracking-wide text-[#dde1e8] underline decoration-[#e8ecf0] underline-offset-1 sm:text-[10px]">
                    ⓘ Important safety information
                  </span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 hidden items-center justify-end gap-4 md:flex">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step("left")}
            className={marketingProductCarouselNavButtonClassName}
            aria-label="Show previous products"
          >
            <ChevronLeft className="h-5 w-5 shrink-0" />
          </button>
          <button
            type="button"
            onClick={() => step("right")}
            className={marketingProductCarouselNavButtonClassName}
            aria-label="Show next products"
          >
            <ChevronRight className="h-5 w-5 shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
}

export const MARKETING_ROUTES = ROUTES;

export function MinimalMarketingNavbar() {
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [authOverlayMode, setAuthOverlayMode] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const primaryCta = isAuthenticated
    ? user?.role === "ADMIN"
      ? { href: "/dashboard", label: "Dashboard" }
      : { href: "/account", label: "My Account" }
    : null;

  return (
    <>
    <header className="sticky top-0 z-50">
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          scrolled
            ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,247,255,0.94)_50%,rgba(235,240,255,0.95)_100%)] backdrop-blur-2xl"
            : "bg-white/90 backdrop-blur-xl"
        }`}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      <div
        className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-40"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-8 translate-y-full bg-[linear-gradient(180deg,rgba(15,23,42,0.06),transparent)] transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-30"
        }`}
      />

      <div className="relative px-3 py-1.5 sm:px-5 md:px-6">
        <div className="mx-auto max-w-[1340px] py-1 md:px-8">
          <div className="flex min-w-0 w-full max-w-full items-center justify-between gap-2 rounded-[1.7rem] sm:gap-3 md:px-5">
            <Link
              href={ROUTES.home}
              className="flex min-w-0 shrink items-center overflow-hidden"
            >
              <Image
                src="/logo.png"
                alt="HealSend"
                width={164}
                height={52}
                priority
                className="h-10 w-auto max-w-[7.5rem] object-contain object-left sm:h-12 sm:max-w-[8.5rem] md:h-14 md:max-w-none"
              />
            </Link>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setAuthOverlayMode("login")}
                  className="hs-outline-btn inline-flex min-h-[2.5rem] items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:min-w-[92px] sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <span>Sign In</span>
                </button>
              ) : null}
              {primaryCta ? (
                <Link
                  href={primaryCta.href}
                  className="hs-solid-btn inline-flex min-h-[2.5rem] items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition-all sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm md:min-w-[122px]"
                >
                  <span className="max-w-[10.5rem] truncate sm:max-w-none">
                    {primaryCta.label}
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>

    {authOverlayMode === "login" ? (
      <LoginPageClient
        enableGoogleAuth
        enableAppleAuth
        onClose={() => setAuthOverlayMode(null)}
        onSwitchToSignup={() => setAuthOverlayMode("signup")}
        overlay
      />
    ) : null}

    {authOverlayMode === "signup" ? (
      <SignupPageClient
        enableGoogleAuth
        enableAppleAuth
        onClose={() => setAuthOverlayMode(null)}
        onSwitchToLogin={() => setAuthOverlayMode("login")}
        overlay
      />
    ) : null}
    </>
  );
}

const MEMBER_AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
];

export function ActiveMembersBanner() {
  return (
    <div className="flex items-center gap-2.5 pt-1">
      <div className="flex -space-x-2">
        {MEMBER_AVATARS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className="h-6 w-6 rounded-full border-[1.5px] border-white object-cover"
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">
        <strong className="font-semibold text-gray-700">2,000+</strong> active members
      </span>
    </div>
  );
}

const TRUST_AVATARS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
];

function LaurelLeft({ className }) {
  return <img src="/images/clean/image.png" alt="" aria-hidden="true" className={className} />;
}

function LaurelRight({ className }) {
  return <img src="/images/articles/blogs/image.png" alt="" aria-hidden="true" className={className} />;
}

function GoogleStar() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" aria-hidden="true">
      <polygon points="9,0 11.3,6.2 18,6.8 12.9,11 14.5,17.5 9,14.2 3.5,17.5 5.1,11 0,6.8 6.7,6.2" fill="#F5A623" />
    </svg>
  );
}

export function TrustBadgesRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:flex-nowrap lg:justify-end">
      {/* Google Reviews badge */}
      <div className="flex items-center gap-1">
        <LaurelLeft className="h-14 w-7 sm:h-16 sm:w-8" />
        <div className="flex flex-col items-center gap-1.5 px-1">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.33 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.37-.76-2.84-.76-4.59s.27-3.22.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.67 14.62 48 24 48z"/>
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Google</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <GoogleStar key={i} />)}
          </div>
          <p className="text-center text-sm font-bold text-gray-800">
            4.9 <span className="font-normal text-gray-500">· Google Reviews</span>
          </p>
        </div>
        <LaurelRight className="h-14 w-7 sm:h-16 sm:w-8" />
      </div>

      {/* HealSend Members badge */}
      <div className="flex items-center gap-1">
        <LaurelLeft className="h-14 w-7 sm:h-16 sm:w-8" />
        <div className="flex flex-col items-center gap-1.5 px-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">HealSend</span>
          <div className="flex -space-x-1.5">
            {TRUST_AVATARS.slice(0, 7).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                aria-hidden="true"
                className="h-5 w-5 rounded-full border-[1.5px] border-white object-cover"
              />
            ))}
          </div>
          <p className="text-center text-sm font-bold text-gray-800">
            2K+ <span className="font-normal text-gray-500">Members</span>
          </p>
        </div>
        <LaurelRight className="h-14 w-7 sm:h-16 sm:w-8" />
      </div>
    </div>
  );
}
