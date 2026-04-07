"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChartNoAxesCombined,
  Circle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  Percent,
  ShieldCheck,
  Stethoscope,
  TrendingDown,
  Users,
  X,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const TEST_MARKETING_ASSETS = Object.freeze({
  careSupportLifestyle: "/images/marketing/bundle/care-support-lifestyle.webp",
  semaglutideInjections:
    "/images/marketing/bundle/semaglutide-injections-product.png",
  tirzepatideInjections:
    "/images/marketing/bundle/tirzepatide-injections-product.png",
  oralTirzepatide: "/images/marketing/bundle/oral-tirzepatide-product.png",
  sermorelin: "/images/marketing/bundle/sermorelin-product.png",
  strengthLifestyle: "/images/marketing/bundle/strength-lifestyle.jpg",
  microdoseSemaglutideDrops:
    "/images/marketing/bundle/microdose-semaglutide-drops.webp",
  oxytocinNasalSpray:
    "/images/marketing/bundle/oxytocin-nasal-spray-product.png",
  nadInjections: "/images/marketing/bundle/nad-injections-product.png",
  micB12: "/images/marketing/bundle/mic-b12-product.png",
  weightLossLifestyle: "/images/marketing/bundle/weight-loss-lifestyle-1.png",
});

const LEFT_MARQUEE_ITEMS = [
  {
    src: TEST_MARKETING_ASSETS.weightLossLifestyle,
    alt: "HealSend weight-loss member",
    heightClass: "h-[218px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#dcebff]",
  },
  {
    src: "/weight-loss-image-menu.png",
    alt: "GLP-1 treatment kit",
    heightClass: "h-[198px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#d7f0fb]",
  },
  {
    src: "/images/home/reference/nad-cellular-energy.jpeg",
    alt: "Microscopic wellness texture",
    heightClass: "h-[236px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#edf1ff]",
  },
  {
    src: TEST_MARKETING_ASSETS.careSupportLifestyle,
    alt: "HealSend care-support member",
    heightClass: "h-[214px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#f5efe8]",
  },
  {
    src: "/images/home/reference/split-feature-product.jpg",
    alt: "Treatment options",
    heightClass: "h-[228px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#e8efff]",
  },
];

const RIGHT_MARQUEE_ITEMS = [
  {
    src: "/application-step-1.png",
    alt: "Online consultation flow",
    heightClass: "h-[214px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#dbe8ff]",
  },
  {
    src: TEST_MARKETING_ASSETS.sermorelin,
    alt: "HealSend recovery support vial",
    heightClass: "h-[194px]",
    objectClass: "object-contain object-center scale-[0.86]",
    bgClass: "bg-[#f6e6bf]",
  },
  {
    src: "/application-step-2.png",
    alt: "Patient dashboard on mobile",
    heightClass: "h-[214px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#e7edf8]",
  },
  {
    src: TEST_MARKETING_ASSETS.strengthLifestyle,
    alt: "HealSend strength and vitality member",
    heightClass: "h-[196px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#ead5bf]",
  },
  {
    src: "/application-step-3.png",
    alt: "Clinicians",
    heightClass: "h-[176px]",
    objectClass: "object-cover object-center",
    bgClass: "bg-[#eff3ff]",
  },
];

const EXPERIENCE_MARQUEE_ITEMS = [
  "FSA & HSA eligible",
  "Personalized weight-loss plans",
  "No memberships or hidden fees",
  "Free & fast shipping",
  "US-only certified pharmacies",
  "Always-on clinician support",
  "1,200,000+ prescriptions written",
  "250,000+ members",
];

const HEALSEND_POINTS = [
  "Personalized GLP-1 plans guided by licensed clinicians",
  "Built-in follow-up care that adapts with your progress",
  "Treatment recommendations matched to your goals",
  "Proactive support around side effects and expectations",
  "One private place for messaging, tracking, and refills",
  "Discreet shipping with a cleaner online care journey",
];

const OTHER_POINTS = [
  "Generic fixed plans that rarely change over time",
  "Little education or long-term care structure",
  "Basic intake followed by more fragmented steps",
  "Side effects handled more reactively than proactively",
  "Limited support after the prescription is written",
  "More friction, less clarity, and weaker continuity",
];

const MEMBER_RESULT_CARDS = [
  {
    name: "Kala",
    result: "40 lbs",
    images: [
      { src: "/kala_before.webp", alt: "Kala before treatment" },
      { src: "/kala_after.webp", alt: "Kala after treatment" },
    ],
  },
  {
    name: "Morgan",
    result: "36 lbs",
    images: [
      { src: "/morgan_before.webp", alt: "Morgan before treatment" },
      { src: "/morgan_after.webp", alt: "Morgan after treatment" },
    ],
  },
  {
    name: "Christopher",
    result: "42 lbs",
    images: [
      { src: "/christopher_before.webp", alt: "Christopher before treatment" },
      { src: "/christopher_after.webp", alt: "Christopher after treatment" },
    ],
  },
  {
    name: "Noelle",
    result: "29 lbs",
    images: [
      { src: "/noelle_before.webp", alt: "Noelle before treatment" },
      { src: "/noelle_after.webp", alt: "Noelle after treatment" },
    ],
  },
];

const MEMBER_RESULT_PAGES = Array.from(
  { length: MEMBER_RESULT_CARDS.length },
  (_, pageIndex) => {
    const startIndex = pageIndex % MEMBER_RESULT_CARDS.length;

    return Array.from({ length: 4 }, (_, offset) => {
      const cardIndex = (startIndex + offset) % MEMBER_RESULT_CARDS.length;
      return MEMBER_RESULT_CARDS[cardIndex];
    });
  },
);

const MEMBER_RESULT_LOOP_PAGES = [
  ...MEMBER_RESULT_PAGES,
  ...MEMBER_RESULT_PAGES,
  ...MEMBER_RESULT_PAGES,
];

const OUTCOME_STATS = [
  {
    label: "Faster results",
    value: "2x",
    description:
      "HealSend members on guided GLP-1 care progress faster when treatment, follow-up, and refill visibility stay in one place.",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Avg. weight loss",
    value: "-14 lbs",
    description:
      "Average member progress within the first 90 days of starting a consistent clinician-guided weight-loss program.",
    icon: TrendingDown,
  },
  {
    label: "Success rate",
    value: "94.6%",
    description:
      "Of members in active treatment, 94.6% reach a measurable improvement milestone while staying engaged in care.",
    icon: Percent,
  },
  {
    label: "Member retention",
    value: "91%",
    description:
      "Most members stay beyond the first 90 days because follow-up support, plan adjustments, and care continuity are built in.",
    icon: Users,
  },
];

const STAGE_PLAN_CARDS = [
  {
    chips: ["New to GLP-1s? Start here", "Best first step"],
    title: "Semaglutide Plan",
    subtitle: "GLP-1 receptor agonist",
    image: TEST_MARKETING_ASSETS.semaglutideInjections,
    imageClass: "object-contain object-right-bottom scale-[0.92]",
    heroClass:
      "bg-[linear-gradient(135deg,#f0d283_0%,#f2dca4_48%,#e7c670_100%)]",
    detailLabel: "Member results",
    facts: [
      "A steadier, first-line GLP-1 path for members who want a cleaner starting point.",
      "Clinician-guided appetite support with refill visibility and fewer handoff gaps.",
      "A simpler path for members who want progress without overcomplicating the start.",
    ],
    cta: "Start semaglutide",
    secondaryCta: "Why Sema?",
  },
  {
    chips: ["On GLP-1 or hit a plateau?", "Most selected"],
    title: "Tirzepatide Plan",
    subtitle: "Dual GIP + GLP-1 agonist",
    image: TEST_MARKETING_ASSETS.tirzepatideInjections,
    imageClass: "object-contain object-right-bottom scale-[0.98]",
    heroClass:
      "bg-[linear-gradient(135deg,#6fa5f4_0%,#5d8ee2_48%,#4d7ed6_100%)]",
    detailLabel: "Member results",
    facts: [
      "A stronger next step for members who need better hunger control or fresh momentum.",
      "Designed for people who have plateaued or want a more assertive GLP-1 path.",
      "Treatment adjustments stay visible instead of feeling stitched together.",
    ],
    cta: "Start tirzepatide",
    secondaryCta: "Why Tirz?",
  },
  {
    chips: ["Nervous about starting?", "Gentler ramp"],
    title: "GLP-1 Microdose Plan",
    subtitle: "Micro-titration with slower escalation",
    image: TEST_MARKETING_ASSETS.microdoseSemaglutideDrops,
    imageClass: "object-contain object-right-bottom scale-[1.02]",
    heroClass:
      "bg-[linear-gradient(135deg,#e3c69f_0%,#d7b281_48%,#c89f66_100%)]",
    detailLabel: "Why members choose microdose",
    facts: [
      "A gentler entry for members who want to ease in more gradually.",
      "Same medication, but with slower escalation and clearer expectation-setting.",
      "A softer first step before moving into a fuller plan when the time feels right.",
    ],
    cta: "Start microdose",
    secondaryCta: "Why Microdose?",
  },
  {
    chips: ["Prefer brand names?", "When available"],
    title: "Brand-name GLP-1",
    subtitle: "Wegovy and Zepbound pathways",
    image: "/images/marketing/glp1-hero-merged-tight.png",
    imageClass: "object-contain object-right-bottom scale-[0.98]",
    heroClass:
      "bg-[linear-gradient(135deg,#66a7d6_0%,#5a96c0_45%,#4d80a8_100%)]",
    detailLabel: "Retail brand-name path",
    facts: [
      "A cleaner online route for members who specifically want branded GLP-1 options.",
      "Clinician fit, supply, and goal-matching still stay part of the decision.",
      "More guided than piecing together a retail medication path on your own.",
    ],
    cta: "Start name brand",
  },
];

const STAGE_PLAN_LOOP_CARDS = [
  ...STAGE_PLAN_CARDS,
  ...STAGE_PLAN_CARDS,
  ...STAGE_PLAN_CARDS,
];

const STAGE_PLAN_PAGES = Array.from(
  { length: STAGE_PLAN_CARDS.length },
  (_, pageIndex) =>
    Array.from({ length: 4 }, (_, offset) => {
      const cardIndex = (pageIndex + offset) % STAGE_PLAN_CARDS.length;
      return STAGE_PLAN_CARDS[cardIndex];
    }),
);

const STAGE_PLAN_LOOP_PAGES = [
  ...STAGE_PLAN_PAGES,
  ...STAGE_PLAN_PAGES,
  ...STAGE_PLAN_PAGES,
];

const STAGE_PLAN_DISCLAIMER = `Results are based on self-reported data from ~300,000 HealSend members on personalized treatment plans, including compounded GLP-1 medications and clinician consultations. Members reported their weight on their initial medical intake questionnaire and every 3-4 weeks thereafter. Individual results may vary.

HealSend offers compounded GLP-1s exclusively from U.S. pharmacies. Compounded medications are regulated and compounding pharmacies are licensed and inspected by Boards of Pharmacy, but the FDA has not evaluated the medications for safety, quality, or efficacy. GLP-1 medications are prescription drugs that should be taken and monitored under the supervision of a licensed health care professional. GLP-1 medications carry serious risks, including risks of thyroid C-cell tumors (which includes thyroid cancer) and medullary thyroid carcinoma (MTC). Talk to your provider if you get a lump or swelling in your neck, hoarseness, trouble swallowing, or shortness of breath.`;

const CALCULATOR_AVATARS = [
  "/images/quiz/avatars/intro-1.jpg",
  "/images/quiz/avatars/intro-2.jpg",
  "/images/quiz/avatars/intro-3.jpg",
  "/images/quiz/avatars/intro-4.jpg",
  "/images/quiz/avatars/review-1.jpg",
  "/images/quiz/avatars/review-2.jpg",
  "/images/quiz/avatars/review-3.jpg",
];

function InfoRow({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3 text-[#4f5262]">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef1ff] text-[#6D6FFC]">
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-sm leading-6 md:text-[0.97rem]">{children}</p>
    </div>
  );
}

function VerticalLoopColumn({ items, reverse = false }) {
  const loopItems = [...items, ...items];

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="flex flex-col gap-3 lg:gap-4"
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{
          duration: 18,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {loopItems.map((item, index) => (
          <article
            key={`${item.src}-${index}`}
            className={`relative overflow-hidden rounded-[1rem] ${item.heightClass} ${item.bgClass} shadow-[0_14px_30px_rgba(17,24,39,0.08)]`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 24vw"
              className={item.objectClass}
              priority={index < 2}
            />
          </article>
        ))}
      </motion.div>
    </div>
  );
}

function ExperienceMarquee() {
  const loopItems = [...EXPERIENCE_MARQUEE_ITEMS, ...EXPERIENCE_MARQUEE_ITEMS];

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 border-y border-[#e2d79a] bg-[#f9eb94] px-3 py-2 shadow-[0_10px_24px_rgba(186,155,33,0.08)]">
      <div className="overflow-hidden">
        <motion.div
          className="flex min-w-max items-center gap-[18px]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 26,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {loopItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex shrink-0 items-center gap-3 whitespace-nowrap text-[0.76rem] font-semibold text-[#5b4d12] md:text-[0.82rem]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#c9b454] bg-white/50">
                <Check className="h-3.5 w-3.5" />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ExperienceCard({
  title,
  imageSrc,
  imageAlt,
  imageFitClass,
  points,
  inverse = false,
}) {
  return (
    <article
      className={`rounded-[1rem] border p-5 md:p-6 ${
        inverse
          ? "border-[#d8def1] bg-white text-[#1b1e28] shadow-[0_18px_34px_rgba(32,38,52,0.08)]"
          : "border-[#46527d] bg-[linear-gradient(180deg,#26345f_0%,#344167_52%,#48536f_100%)] text-white shadow-[0_20px_38px_rgba(33,40,67,0.16)]"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[0.9rem] ${
            inverse ? "bg-[#f7f8fc]" : "bg-white/10"
          }`}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="112px"
            className={imageFitClass}
          />
        </div>
        <h3 className="mt-3 font-headline text-[1.4rem] font-semibold tracking-tight md:text-[1.48rem]">
          {title}
        </h3>
      </div>

      <div className="mt-5 space-y-3 text-center">
        {points.map((point) => (
          <div key={point} className="flex flex-col items-center">
            <p
              className={`text-[0.92rem] leading-5.5 ${
                inverse ? "text-[#5f6476]" : "text-white/88"
              }`}
            >
              {point}
            </p>
            <span
              className={`mt-1.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full ${
                inverse
                  ? "bg-[#eef0f7] text-[#7a8092]"
                  : "bg-[#99e39a] text-[#1f4426]"
              }`}
            >
              {inverse ? (
                <Circle className="h-3.5 w-3.5 fill-current" />
              ) : (
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              )}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function ExperienceComparisonSection() {
  return (
    <section className="px-5 pb-18 pt-6 md:px-8 md:pb-20 md:pt-8 lg:px-10 lg:pt-9">
      <div className="mx-auto max-w-[1320px]">
        <ExperienceMarquee />

        <div className="mx-auto mt-7 max-w-[960px] px-1 md:px-2">
          <div className="mx-auto max-w-[500px] text-center">
            <p className="font-headline text-[2.05rem] font-semibold tracking-[-0.05em] text-[#1b1e28] sm:text-[2.55rem] lg:text-[3rem]">
              Same medication.
            </p>
            <p className="font-headline text-[1.8rem] italic leading-none tracking-[-0.05em] text-[#6D6FFC] sm:text-[2.2rem] lg:text-[2.65rem]">
              Very different experience.
            </p>
          </div>

          <div className="mx-auto mt-7 grid max-w-[700px] gap-3 md:grid-cols-2 md:gap-4">
            <ExperienceCard
              title="HealSend"
              imageSrc="/images/marketing/semaglutide-sermorelin.png"
              imageAlt="HealSend GLP-1 kit"
              imageFitClass="object-contain object-center scale-[0.92]"
              points={HEALSEND_POINTS}
            />
            <ExperienceCard
              title="Others"
              imageSrc="/images/marketing/weight-loss-image-menu-cutout.png"
              imageAlt="Generic medication tools"
              imageFitClass="object-contain object-center scale-[0.72]"
              points={OTHER_POINTS}
              inverse
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MemberResultsCarousel() {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (!api) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      api.scrollNext();
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, [api]);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 pb-24">
      <div className="mt-6 mb-4 flex items-center justify-start gap-3 px-5 md:mb-8 md:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e7eaf3] bg-white text-[#636a7c] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition-colors hover:bg-[#f5f7fd]"
          aria-label="Show previous member stories"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e7eaf3] bg-white text-[#636a7c] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition-colors hover:bg-[#f5f7fd]"
          aria-label="Show next member stories"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          loop: true,
          duration: 32,
        }}
        className="w-full md:hidden"
      >
        <CarouselContent className="ml-0 items-stretch">
          {MEMBER_RESULT_CARDS.map((card, cardIndex) => (
            <CarouselItem
              key={`member-mobile-${card.name}-${cardIndex}`}
              className="basis-full px-3"
            >
              <article className="flex h-full flex-col rounded-[1rem] border border-[#e9edf5] bg-white p-4 shadow-[0_16px_30px_rgba(17,24,39,0.08)]">
                <div className="grid grid-cols-2 gap-3">
                  {card.images.map((image, imageIndex) => (
                    <div
                      key={`${image.src}-${imageIndex}`}
                      className="flex flex-col gap-1.5"
                    >
                      {/* <span className="text-center text-[0.7rem] font-semibold uppercase tracking-widest text-[#7a8092]">
                        {imageIndex === 0 ? "Before" : "After"}
                      </span> */}
                      <div className="relative aspect-[2/3] overflow-hidden rounded-[1rem] bg-[#eef2fb]">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="45vw"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-2 pb-2 pt-5 text-center">
                  <p className="text-[1.05rem] font-medium tracking-[-0.03em] text-[#3a4358] sm:text-[1.12rem]">
                    {card.name} lost{" "}
                    <span className="text-[#20c997]">{card.result}</span>
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[0.74rem] font-medium text-[#7a8092]">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#20c997] text-white">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                    <span>Verified HealSend members</span>
                  </div>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel
        opts={{
          align: "center",
          containScroll: false,
          loop: true,
          duration: 32,
        }}
        className="hidden w-full md:block"
      >
        <CarouselContent className="ml-0 items-stretch">
          {MEMBER_RESULT_LOOP_PAGES.map((pageCards, pageIndex) => (
            <CarouselItem
              key={`member-page-${pageIndex}`}
              className="basis-[calc(100%-112px)] px-3"
            >
              <div className="grid grid-cols-4 gap-3">
                {pageCards.map((card, cardIndex) => (
                  <article
                    key={`${card.name}-${pageIndex}-${cardIndex}`}
                    className="flex h-full flex-col rounded-[1rem] border border-[#e9edf5] bg-white p-4 shadow-[0_16px_30px_rgba(17,24,39,0.08)]"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {card.images.map((image, imageIndex) => (
                        <div
                          key={`${image.src}-${imageIndex}`}
                          className="flex flex-col gap-1.5"
                        >
                          {/* <span className="text-center text-[0.7rem] font-semibold uppercase tracking-widest text-[#7a8092]">
                            {imageIndex === 0 ? "Before" : "After"}
                          </span> */}
                          <div className="relative aspect-[2/3] overflow-hidden rounded-[1rem] bg-[#eef2fb]">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              sizes="(max-width: 1024px) 24vw, (max-width: 1536px) 12vw, 11.5vw"
                              className="object-cover object-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-2 pb-2 pt-5 text-center">
                      <p className="text-[1.05rem] font-medium tracking-[-0.03em] text-[#3a4358] sm:text-[1.12rem]">
                        {card.name} lost{" "}
                        <span className="text-[#20c997]">{card.result}</span>
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-1.5 text-[0.74rem] font-medium text-[#7a8092]">
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#20c997] text-white">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                        <span>Verified HealSend members</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

function OutcomesStatsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-18 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/liquid-bubbles-desktop.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right-top"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(233,241,255,0.72)_0%,rgba(245,249,255,0.62)_28%,rgba(247,251,255,0.48)_56%,rgba(247,251,255,0.32)_100%)]" />

      <div className="relative mx-auto grid max-w-[1260px] gap-7 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-8">
        <div className="max-w-[26rem] pt-1">
          <h2 className="font-headline text-[2.35rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#121726] sm:text-[2.9rem] lg:text-[3.65rem]">
            Why members
            <br />
            start and stay{" "}
            <span className="italic text-[#5d62f3]">with HealSend.</span>
          </h2>

          <p className="mt-6 text-[1.02rem] font-semibold leading-7 text-[#33405a]">
            8 out of 10 members lose{" "}
            <span className="italic">14+ lbs in 90 days*</span>
          </p>
          <p className="mt-1 max-w-[25rem] text-[0.98rem] leading-6.5 text-[#41506b]">
            Join members nationwide moving through onboarding, treatment,
            check-ins, and refill care with less friction and better visibility.
          </p>
        </div>

        <div>
          {/* Tabs (desktop: all shown as 2-col grid; mobile: tab pills + single card) */}

          {/* Mobile tab pills */}
          <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 md:hidden">
            {OUTCOME_STATS.map((stat, i) => (
              <button
                key={stat.label}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`shrink-0 rounded-full px-4 py-2 text-[0.78rem] font-semibold transition-colors ${
                  activeTab === i
                    ? "bg-[#1c1a24] text-white"
                    : "bg-white/70 text-[#44506c] border border-[#d6e0f0]"
                }`}
              >
                {stat.label}
              </button>
            ))}
          </div>

          {/* Mobile: single active card */}
          <div className="md:hidden">
            {OUTCOME_STATS.map((stat, i) => {
              const Icon = stat.icon;
              if (i !== activeTab) return null;
              return (
                <article
                  key={stat.label}
                  className="rounded-[1rem] border border-[#e8eef7] bg-white p-5 shadow-[0_16px_30px_rgba(38,57,96,0.1)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[0.92rem] font-medium uppercase tracking-[0.12em] text-[#44506c]">
                      {stat.label}
                    </p>
                    <Icon className="h-6 w-6 text-[#7182a3]" />
                  </div>
                  <p className="mt-4 font-headline text-[2.9rem] font-semibold leading-none tracking-[-0.06em] text-[#0f1524]">
                    {stat.value}
                  </p>
                  <p className="mt-4 max-w-[23rem] text-[0.94rem] leading-6 text-[#5c6a84]">
                    {stat.description}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Desktop: 2-col grid */}
          <div className="hidden gap-3 md:grid md:grid-cols-2 md:gap-4">
            {OUTCOME_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <article
                  key={stat.label}
                  className="rounded-[1rem] border border-[#e8eef7] bg-white p-5 shadow-[0_16px_30px_rgba(38,57,96,0.1)] md:min-h-[208px] md:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[0.92rem] font-medium uppercase tracking-[0.12em] text-[#44506c]">
                      {stat.label}
                    </p>
                    <Icon className="h-6 w-6 text-[#7182a3]" />
                  </div>
                  <p className="mt-4 font-headline text-[2.9rem] font-semibold leading-none tracking-[-0.06em] text-[#0f1524] md:text-[3.2rem]">
                    {stat.value}
                  </p>
                  <p className="mt-4 max-w-[23rem] text-[0.94rem] leading-6 text-[#5c6a84]">
                    {stat.description}
                  </p>
                </article>
              );
            })}
          </div>

          <p className="mt-5 max-w-[64rem] text-[0.78rem] leading-6 text-[#65738d] md:text-[0.82rem]">
            Based on aggregated internal member progress snapshots and follow-up
            reporting across active weight-loss programs. Outcome timelines vary
            by protocol, adherence, and clinician adjustments, and are shown
            here only as directional prototype content for review.
          </p>
        </div>
      </div>
    </section>
  );
}

function StagePlansSection() {
  const [api, setApi] = useState(null);
  const [mobileApi, setMobileApi] = useState(null);

  useEffect(() => {
    if (!api) return undefined;
    const intervalId = window.setInterval(() => api.scrollNext(), 5200);
    return () => window.clearInterval(intervalId);
  }, [api]);

  useEffect(() => {
    if (!mobileApi) return undefined;
    const intervalId = window.setInterval(() => mobileApi.scrollNext(), 5200);
    return () => window.clearInterval(intervalId);
  }, [mobileApi]);

  return (
    <section className="bg-white py-18 md:py-20">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-10">
          <div className="max-w-[58rem]">
            <h2 className="font-headline text-[2.45rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#111621] sm:text-[3rem] lg:text-[4rem]">
              Medical weight loss treatment
              <br />
              <span className="italic text-[#5d62f3]">
                matched to your stage and goals.
              </span>
            </h2>
            <p className="mt-5 max-w-[55rem] text-[1.04rem] leading-8 text-[#4f5566]">
              Weight loss isn&apos;t one size fits all. Choose the path that
              fits your starting point, your goal, and your lifestyle without
              adding more friction than the plan already solves.
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-3 lg:justify-end">
            <div className="rounded-[1rem] border border-[#e9edf5] bg-white px-5 py-3 shadow-[0_12px_28px_rgba(18,26,42,0.06)]">
              <div className="flex items-center gap-2 text-[#24a36b]">
                <span className="text-lg">★</span>
                <span className="text-[1.02rem] font-semibold text-[#222b3b]">
                  Trustpilot
                </span>
              </div>
              <p className="mt-1 text-[0.96rem] text-[#4f586c]">
                10,000+ reviews
              </p>
              <p className="mt-1 text-[0.88rem] text-[#7a8498]">
                4.7 average rating
              </p>
            </div>
            <div className="rounded-[1rem] border border-[#e9edf5] bg-white px-5 py-3 shadow-[0_12px_28px_rgba(18,26,42,0.06)]">
              <div className="flex items-center gap-2 text-[#4b6ef5]">
                <Users className="h-4.5 w-4.5" />
                <span className="text-[1.02rem] font-semibold text-[#222b3b]">
                  HealSend community
                </span>
              </div>
              <p className="mt-1 text-[0.96rem] text-[#4f586c]">7K+ members</p>
              <div className="mt-2 flex -space-x-2">
                {CALCULATOR_AVATARS.slice(0, 6).map((src) => (
                  <span
                    key={`community-${src}`}
                    className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-[#edf1f8]"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover object-center"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              api?.scrollPrev();
              mobileApi?.scrollPrev();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e7eaf3] bg-white text-[#636a7c] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition-colors hover:bg-[#f5f7fd]"
            aria-label="Show previous weight-loss plans"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              api?.scrollNext();
              mobileApi?.scrollNext();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e7eaf3] bg-white text-[#636a7c] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition-colors hover:bg-[#f5f7fd]"
            aria-label="Show next weight-loss plans"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2">
        <Carousel
          setApi={setMobileApi}
          opts={{
            align: "start",
            containScroll: "trimSnaps",
            loop: true,
            duration: 32,
          }}
          className="w-full md:hidden"
        >
          <CarouselContent className="-ml-3 items-stretch">
            {STAGE_PLAN_LOOP_CARDS.map((card, cardIndex) => (
              <CarouselItem
                key={`stage-mobile-${card.title}-${cardIndex}`}
                className="basis-full px-3"
              >
                <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-[1rem] border border-[#e8edf5] bg-white shadow-[0_16px_30px_rgba(18,26,42,0.08)]">
                  <div
                    className={`relative h-[292px] overflow-hidden px-6 pb-6 pt-6 ${card.heroClass}`}
                  >
                    <div className="relative z-10 flex max-w-[66%] flex-col items-start gap-2">
                      {card.chips.slice(0, 2).map((chip) => (
                        <span
                          key={chip}
                          className="rounded-[0.75rem] bg-[#d9e1ea] px-3 py-1.5 text-[0.88rem] font-medium leading-[1.2] text-[#30394d]"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="relative z-10 mt-14 max-w-[65%]">
                      <h3
                        className="font-headline text-[1.68rem] font-semibold leading-[1.05] tracking-[-0.04em] text-white"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                        }}
                      >
                        {card.title}
                      </h3>
                      <p className="mt-3 text-[0.98rem] font-medium leading-6 text-white">
                        {card.subtitle}
                      </p>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-[47%]">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="47vw"
                        className={card.imageClass}
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-6 py-5">
                    <p className="text-[0.92rem] font-semibold uppercase tracking-[0.12em] text-[#1f2839]">
                      {card.detailLabel}
                    </p>
                    <div className="mt-4 flex flex-1 flex-col gap-4">
                      {card.facts.map((fact) => (
                        <div
                          key={fact}
                          className="flex items-start gap-3 text-[#4e566a]"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef1ff] text-[#5d62f3]">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </span>
                          <p className="text-[0.97rem] leading-7">{fact}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 border-t border-[#e6ebf4] pt-5">
                      <Link
                        href="/funnels/glp-1"
                        className="hs-solid-btn inline-flex min-h-[3.2rem] w-full items-center justify-center gap-2 rounded-full px-6 text-[0.98rem] font-semibold"
                      >
                        {card.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      {card.secondaryCta ? (
                        <Link
                          href="/weight-loss"
                          className="hs-outline-btn mt-3 inline-flex min-h-[3.1rem] w-full items-center justify-center rounded-full px-6 text-[0.98rem] font-semibold"
                        >
                          {card.secondaryCta}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            containScroll: false,
            loop: true,
            duration: 32,
          }}
          className="hidden w-full md:block"
        >
          <CarouselContent className="-ml-3 items-stretch md:-ml-4">
            {STAGE_PLAN_LOOP_PAGES.map((pageCards, pageIndex) => (
              <CarouselItem
                key={`stage-page-${pageIndex}`}
                className="basis-[calc(100%-112px)] px-3"
              >
                <div className="grid grid-cols-4 gap-4">
                  {pageCards.map((card, cardIndex) => (
                    <article
                      key={`${card.title}-${pageIndex}-${cardIndex}`}
                      className="flex h-full min-w-0 flex-col overflow-hidden rounded-[1rem] border border-[#e8edf5] bg-white shadow-[0_16px_30px_rgba(18,26,42,0.08)]"
                    >
                      <div
                        className={`relative h-[292px] overflow-hidden px-6 pb-6 pt-6 ${card.heroClass}`}
                      >
                        <div className="relative z-10 flex max-w-[66%] flex-col items-start gap-2">
                          {card.chips.slice(0, 2).map((chip) => (
                            <span
                              key={chip}
                              className="rounded-[0.75rem] bg-[#d9e1ea] px-3 py-1.5 text-[0.88rem] font-medium leading-[1.2] text-[#30394d]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                        <div className="relative z-10 mt-14 max-w-[65%]">
                          <h3
                            className="font-headline text-[1.68rem] font-semibold leading-[1.05] tracking-[-0.04em] text-white md:text-[1.8rem]"
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              overflow: "hidden",
                            }}
                          >
                            {card.title}
                          </h3>
                          <p className="mt-3 text-[0.98rem] font-medium leading-6 text-white">
                            {card.subtitle}
                          </p>
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-[47%]">
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            sizes="(max-width: 1536px) 24vw, 18vw"
                            className={card.imageClass}
                            priority={pageIndex === 0 && cardIndex < 2}
                          />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col px-6 py-5">
                        <p className="text-[0.92rem] font-semibold uppercase tracking-[0.12em] text-[#1f2839]">
                          {card.detailLabel}
                        </p>
                        <div className="mt-4 flex min-h-[190px] flex-1 flex-col gap-4">
                          {card.facts.map((fact) => (
                            <div
                              key={fact}
                              className="flex items-start gap-3 text-[#4e566a]"
                            >
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef1ff] text-[#5d62f3]">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </span>
                              <p className="text-[0.97rem] leading-7">{fact}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 border-t border-[#e6ebf4] pt-5">
                          <Link
                            href="/funnels/glp-1"
                            className="hs-solid-btn inline-flex min-h-[3.2rem] w-full items-center justify-center gap-2 rounded-full px-6 text-[0.98rem] font-semibold"
                          >
                            {card.cta}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          {card.secondaryCta ? (
                            <Link
                              href="/weight-loss"
                              className="hs-outline-btn mt-3 inline-flex min-h-[3.1rem] w-full items-center justify-center rounded-full px-6 text-[0.98rem] font-semibold"
                            >
                              {card.secondaryCta}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mx-auto mt-7 max-w-[1180px] px-5 text-[11px] leading-[1.65] text-[#7b8192] md:px-8 lg:px-10">
          {STAGE_PLAN_DISCLAIMER.split("\n\n").map((paragraph) => (
            <p key={paragraph} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareSupportSection() {
  return (
    <section className="bg-white px-5 pb-24 pt-4 md:px-8 lg:px-10">
      <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="overflow-hidden rounded-[1rem] bg-[#f2f5fb] shadow-[0_18px_34px_rgba(18,26,42,0.08)]">
          <div className="relative aspect-[1.08/1]">
            <Image
              src={TEST_MARKETING_ASSETS.careSupportLifestyle}
              alt="HealSend care support"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
            />
          </div>
        </div>

        <div className="max-w-[34rem] lg:justify-self-center">
          <h2 className="font-headline text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#111621] sm:text-[3rem] lg:text-[3.7rem]">
            We&apos;re here when
            <br />
            <span className="italic text-[#5d62f3]">You need us.</span>
          </h2>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7deeb] text-[#30394d]">
                <Clock3 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.98rem] font-medium text-[#626b7f]">
                  Always available
                </p>
                <p className="mt-1 text-[1.28rem] font-semibold leading-[1.22] text-[#434b5d]">
                  7 days a week · 8:00am - 8:00pm ET
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7deeb] text-[#30394d]">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.98rem] font-medium text-[#626b7f]">
                  Care-team messaging and virtual follow-up
                </p>
                <p className="mt-1 text-[1.28rem] font-semibold leading-[1.22] text-[#434b5d]">
                  Secure support inside your HealSend account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-[#d7deeb] text-[#30394d]">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.98rem] font-medium text-[#626b7f]">
                  Email us
                </p>
                <a
                  href="mailto:yourhealth@healsend.com"
                  className="mt-1 inline-block text-[1.28rem] font-semibold leading-[1.22] text-[#434b5d] underline decoration-[#aeb7ca] underline-offset-4"
                >
                  yourhealth@healsend.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const BMI_CATEGORY_ROWS = [
  {
    label: "Underweight",
    range: "<18.5",
    dotClass: "bg-[#b9c7ff]",
    panelClass: "bg-[#f4f6ff]",
  },
  {
    label: "Healthy Weight",
    range: "18.5+",
    dotClass: "bg-[#a7efc6]",
    panelClass: "bg-[#f4fff8]",
  },
  {
    label: "Overweight",
    range: "25+",
    dotClass: "bg-[#ffd79d]",
    panelClass: "bg-[#fff9ef]",
  },
  {
    label: "Obesity",
    range: "30+",
    dotClass: "bg-[#ff5b5b]",
    panelClass: "bg-[#ffe2e2]",
  },
];

function ModalShell({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <button
            type="button"
            aria-label="Close modal overlay"
            className="absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            className="relative z-[1] w-full max-w-[980px] rounded-[1rem] bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.25)] md:p-7"
            initial={{ opacity: 0, y: 24, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-[0.9rem] border-2 border-[#182133] text-[#5f6a84] transition-colors hover:bg-[#f6f7fb]"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ProjectedLossCalculatorSection() {
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("10");
  const [weight, setWeight] = useState("210");
  const [sliderWeight, setSliderWeight] = useState(334);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showProjectedModal, setShowProjectedModal] = useState(false);
  const [sliderDragging, setSliderDragging] = useState(false);

  const minWeight = 90;
  const maxWeight = 420;
  const totalInches = Math.max(
    48,
    Number.parseInt(feet || "0", 10) * 12 + Number.parseInt(inches || "0", 10),
  );
  const safeWeight = Math.min(
    maxWeight,
    Math.max(minWeight, Number.parseInt(weight || "0", 10) || 0),
  );
  const safeSliderWeight = Math.min(
    maxWeight,
    Math.max(minWeight, Number.parseInt(String(sliderWeight || 0), 10) || 0),
  );
  const bmi = Number(
    ((safeWeight / (totalInches * totalInches)) * 703 || 0).toFixed(1),
  );
  const projectedLoss = Math.max(
    8,
    Math.min(65, Math.round(safeSliderWeight * 0.15)),
  );
  const sliderProgress =
    (safeSliderWeight - minWeight) / (maxWeight - minWeight);
  const bmiProgress = Math.min(bmi / 40, 1);

  const getBmiCategory = (value) => {
    if (value < 18.5) {
      return "Underweight";
    }
    if (value < 25) {
      return "Healthy Weight";
    }
    if (value < 30) {
      return "Overweight";
    }
    return "Obesity";
  };

  const bmiCategory = getBmiCategory(bmi);
  const bmiPanelCopy =
    bmiCategory === "Obesity"
      ? {
          title: "Obesity",
          description:
            "Your BMI is in a range where medical support can help. A licensed clinician can build a personalized plan to help you feel better, move more easily, and regain confidence.",
          panelClass: "bg-[#ffc9c9]",
        }
      : bmiCategory === "Overweight"
        ? {
            title: "Overweight",
            description:
              "You may benefit from guided support, especially if weight has been difficult to manage alone. A clinician can help you understand safe next steps.",
            panelClass: "bg-[#ffe7be]",
          }
        : bmiCategory === "Healthy Weight"
          ? {
              title: "Healthy Weight",
              description:
                "Your BMI sits in a generally healthy range. A clinician can still help assess whether your goals call for treatment, nutrition support, or another path.",
              panelClass: "bg-[#dff7e8]",
            }
          : {
              title: "Underweight",
              description:
                "Your BMI is below the typical treatment range for weight-loss care. A licensed provider can help review your goals and overall health before suggesting next steps.",
              panelClass: "bg-[#e4ebff]",
            };

  const radius = 118;
  const circumference = Math.PI * radius;
  const bmiOffset = circumference * (1 - bmiProgress);

  const openProjectedModal = () => {
    setShowProjectedModal(true);
    setSliderDragging(false);
  };

  const handleSliderPointerDown = () => {
    setSliderDragging(true);
  };

  const handleSliderPointerUp = () => {
    if (sliderDragging) {
      openProjectedModal();
    }
  };

  return (
    <>
      <section className="bg-white px-5 py-24 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-[72rem]">
            <h2 className="font-headline text-[2.5rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[#101726] sm:text-[3.1rem] lg:text-[4.25rem]">
              Find out what you could lose{" "}
              <span className="italic text-[#5d62f3]">with HealSend.</span>
            </h2>
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,0.95fr)_minmax(0,0.9fr)]">
            <article className="rounded-[1rem] border border-[#edf1f7] bg-white p-6 shadow-[0_18px_34px_rgba(20,24,34,0.08)] md:p-8">
              <p className="text-center text-[1.15rem] font-medium tracking-[-0.03em] text-[#121726] md:text-[1.25rem]">
                Check your eligibility.
              </p>

              <div className="relative mx-auto mt-8 h-[210px] w-[260px]">
                <svg
                  viewBox="0 0 280 170"
                  className="h-full w-full overflow-visible"
                >
                  <path
                    d="M 25 150 A 115 115 0 0 1 255 150"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 25 150 A 115 115 0 0 1 255 150"
                    fill="none"
                    stroke="url(#bmiGradient)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={bmiOffset}
                  />
                  <defs>
                    <linearGradient
                      id="bmiGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#6db1ff" />
                      <stop offset="50%" stopColor="#91e2a8" />
                      <stop offset="78%" stopColor="#ffd34d" />
                      <stop offset="100%" stopColor="#ff845b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-x-0 bottom-6 text-center">
                  <div className="font-headline text-[4.6rem] font-semibold leading-none tracking-[-0.06em] text-[#0b1020]">
                    {bmi}
                  </div>
                  <div className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-[#7a859c]">
                    Your BMI
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-[1rem] font-medium text-[#313948]">
                    Height
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-4 py-3">
                      <input
                        value={feet}
                        onChange={(event) =>
                          setFeet(event.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="w-full bg-transparent text-[1.02rem] text-[#172030] outline-none"
                        inputMode="numeric"
                        placeholder="Feet"
                      />
                      <span className="text-[1.02rem] font-medium text-[#68748f]">
                        ft
                      </span>
                    </div>
                    <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-4 py-3">
                      <input
                        value={inches}
                        onChange={(event) =>
                          setInches(event.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="w-full bg-transparent text-[1.02rem] text-[#172030] outline-none"
                        inputMode="numeric"
                        placeholder="Inches"
                      />
                      <span className="text-[1.02rem] font-medium text-[#68748f]">
                        in
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[1rem] font-medium text-[#313948]">
                    Weight
                  </label>
                  <div className="flex items-center rounded-[0.9rem] border border-[#ccd5e4] bg-[#fbfcfe] px-4 py-3">
                    <input
                      value={weight}
                      onChange={(event) =>
                        setWeight(event.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="w-full bg-transparent text-[1.02rem] text-[#172030] outline-none"
                      inputMode="numeric"
                      placeholder="Weight (pounds)"
                    />
                    <span className="text-[1.02rem] font-medium text-[#68748f]">
                      lbs
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEligibilityModal(true)}
                className="hs-solid-btn mt-8 inline-flex min-h-[3.4rem] w-full items-center justify-center gap-2 rounded-full px-8 text-[1.02rem] font-semibold"
              >
                See my BMI eligibility
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>

            <article className="overflow-hidden rounded-[1rem] border border-[#edf1f7] bg-white shadow-[0_18px_34px_rgba(20,24,34,0.08)]">
              <div className="relative h-full min-h-[720px]">
                <Image
                  src="/photoroom-4.png"
                  alt="Happy HealSend member"
                  fill
                  sizes="(max-width: 1280px) 100vw, 32vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.88)_44%,rgba(255,255,255,1)_100%)] px-6 pb-5 pt-24">
                  <div className="flex justify-center">
                    <div className="flex -space-x-2.5">
                      {CALCULATOR_AVATARS.map((src) => (
                        <span
                          key={src}
                          className="relative h-10 w-10 overflow-hidden rounded-full border-[3px] border-white bg-[#edf1f8]"
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover object-center"
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mx-auto mt-4 max-w-[22rem] text-center text-[0.98rem] leading-7 text-[#4e5a73]">
                    Over{" "}
                    <span className="font-semibold text-[#141c2b]">
                      250,000
                    </span>{" "}
                    members treated.{" "}
                    <span className="font-semibold text-[#141c2b]">94.6%</span>{" "}
                    success backed by real HealSend member progress nationwide.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[1rem] border border-[#edf1f7] bg-white p-8 shadow-[0_18px_34px_rgba(20,24,34,0.08)]">
              <div className="text-center">
                <p className="text-[1.3rem] font-medium leading-[1.2] tracking-[-0.03em] text-[#121726]">
                  Your projected
                  <br />
                  weight loss
                </p>

                <div className="mt-10">
                  <span className="font-headline text-[5.7rem] font-semibold leading-none tracking-[-0.08em] text-[#0b1020]">
                    {projectedLoss}
                  </span>
                  <span className="ml-2 text-[3.25rem] font-medium tracking-[-0.04em] text-[#66748f]">
                    lbs
                  </span>
                </div>

                <p className="mx-auto mt-7 max-w-[19rem] text-[0.98rem] leading-7 text-[#4f5c76]">
                  Based on{" "}
                  <span className="font-semibold text-[#121726]">250,000+</span>{" "}
                  average HealSend member results in guided weight-loss care.
                </p>
              </div>

              <div className="mt-10 border-t border-[#d9e1ef] pt-9">
                <p className="text-center text-[1.02rem] font-medium text-[#20283a]">
                  Starting weight
                </p>
                <div className="mx-auto mt-4 flex max-w-[10.5rem] items-end justify-center gap-1 rounded-[0.9rem] bg-[#f2f5fa] px-5 py-4">
                  <span className="font-headline text-[3.2rem] font-semibold leading-none tracking-[-0.06em] text-[#48536b]">
                    {safeSliderWeight}
                  </span>
                  <span className="mb-1 text-[1.15rem] font-medium text-[#68748f]">
                    lbs
                  </span>
                </div>

                <div className="mt-12">
                  <div className="relative h-4 rounded-full bg-[#dfe5f4]">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[#5d62f3]"
                      style={{ width: `${Math.max(8, sliderProgress * 100)}%` }}
                    />
                    <div
                      className="absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border-2 border-[#4b55eb] bg-white shadow-[0_10px_20px_rgba(93,98,243,0.18)]"
                      style={{
                        left: `calc(${Math.max(8, sliderProgress * 100)}% - 14px)`,
                      }}
                    />
                    <input
                      type="range"
                      min={minWeight}
                      max={maxWeight}
                      step={1}
                      value={safeSliderWeight}
                      onChange={(event) =>
                        setSliderWeight(Number(event.target.value))
                      }
                      onPointerDown={handleSliderPointerDown}
                      onPointerUp={handleSliderPointerUp}
                      onMouseUp={handleSliderPointerUp}
                      onTouchEnd={handleSliderPointerUp}
                      onKeyUp={openProjectedModal}
                      aria-label="Adjust starting weight"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      <ModalShell
        open={showProjectedModal}
        onClose={() => setShowProjectedModal(false)}
      >
        <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[1rem] bg-[#f5f7fb] p-6 text-center md:p-8">
            <p className="text-[1rem] font-medium text-[#101726]">
              Lose on average:
            </p>
            <div className="mt-5 font-headline text-[5.3rem] font-semibold leading-none tracking-[-0.08em] text-[#0b1020]">
              15%
            </div>
            <p className="mt-2 text-[1rem] leading-7 text-[#4e5a73]">
              of your body weight with HealSend.
            </p>
            <button
              type="button"
              className="hs-solid-btn mt-6 inline-flex min-h-[3.35rem] w-full items-center justify-center gap-2 rounded-full px-8 text-[1rem] font-semibold"
            >
              See what&apos;s possible for you
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="mt-6 flex justify-center">
              <div className="flex -space-x-2.5">
                {CALCULATOR_AVATARS.map((src) => (
                  <span
                    key={`modal-${src}`}
                    className="relative h-10 w-10 overflow-hidden rounded-full border-[3px] border-white bg-[#edf1f8]"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover object-center"
                    />
                  </span>
                ))}
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-[22rem] text-[0.98rem] leading-7 text-[#4e5a73]">
              Over <span className="font-semibold text-[#141c2b]">250,000</span>{" "}
              members treated.
              <span className="font-semibold text-[#141c2b]"> 94.6%</span>{" "}
              success backed by real HealSend results nationwide.
            </p>
          </div>
          <div className="rounded-[1rem] bg-[#f5f7fb] p-6 text-center md:p-8">
            <p className="text-[1rem] font-medium text-[#101726]">
              You could lose
            </p>
            <div className="mt-5">
              <span className="font-headline text-[5.6rem] font-semibold leading-none tracking-[-0.08em] text-[#0b1020]">
                {projectedLoss}
              </span>
              <span className="ml-2 text-[3rem] font-medium tracking-[-0.04em] text-[#66748f]">
                lbs
              </span>
            </div>
            <p className="mt-8 text-[1rem] font-medium text-[#20283a]">
              Starting weight
            </p>
            <div className="mx-auto mt-4 flex max-w-[13rem] items-end justify-center gap-1 rounded-[0.9rem] bg-white px-5 py-4">
              <span className="font-headline text-[3.15rem] font-semibold leading-none tracking-[-0.06em] text-[#48536b]">
                {safeSliderWeight}
              </span>
              <span className="mb-1 text-[1.15rem] font-medium text-[#68748f]">
                lbs
              </span>
            </div>
          </div>
        </div>
        <p className="mt-5 text-[0.8rem] leading-6 text-[#67748d]">
          Results vary by individual. Results are based on self-reported data
          from member progress snapshots, including clinician consultations and
          follow-up reporting over time. Individual results may vary. All
          treatment decisions are made by a licensed healthcare provider.
        </p>
      </ModalShell>
      <ModalShell
        open={showEligibilityModal}
        onClose={() => setShowEligibilityModal(false)}
      >
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.98fr)_minmax(0,1.05fr)]">
          <div className="rounded-[1rem] bg-[#f5f7fb] p-6 text-center md:p-8">
            <p className="text-[1rem] font-medium text-[#101726]">
              Check your eligibility.
            </p>
            <div className="relative mx-auto mt-6 h-[220px] w-[270px]">
              <svg
                viewBox="0 0 280 170"
                className="h-full w-full overflow-visible"
              >
                <path
                  d="M 25 150 A 115 115 0 0 1 255 150"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 25 150 A 115 115 0 0 1 255 150"
                  fill="none"
                  stroke="url(#bmiModalGradient)"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={bmiOffset}
                />
                <defs>
                  <linearGradient
                    id="bmiModalGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#6db1ff" />
                    <stop offset="50%" stopColor="#91e2a8" />
                    <stop offset="78%" stopColor="#ffd34d" />
                    <stop offset="100%" stopColor="#ff845b" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-x-0 bottom-5 text-center">
                <div className="font-headline text-[4.8rem] font-semibold leading-none tracking-[-0.07em] text-[#0b1020]">
                  {bmi}
                </div>
                <div className="mt-2 text-[0.95rem] font-medium text-[#222b3d]">
                  Your BMI
                </div>
              </div>
            </div>
            <p className="mx-auto mt-5 max-w-[20rem] text-left text-[0.98rem] leading-7 text-[#33405a] md:text-center">
              Body Mass Index (BMI) is a measurement that uses your height and
              weight to estimate whether your weight is in a healthy range for
              your height.*
            </p>
          </div>
          <div>
            <div className="space-y-3">
              {BMI_CATEGORY_ROWS.map((row) => {
                const active = row.label === bmiCategory;
                return (
                  <div
                    key={row.label}
                    className={`rounded-[1rem] border border-transparent px-4 py-4 ${
                      active ? row.panelClass : "bg-[#f5f7fb]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-3 w-3 rounded-full ${row.dotClass}`}
                        />
                        <span className="text-[1rem] font-medium text-[#33405a]">
                          {row.label}
                        </span>
                      </div>
                      <span className="text-[1rem] font-semibold text-[#2c3648]">
                        {row.range}
                      </span>
                    </div>
                    {active ? (
                      <div className="mt-4">
                        <p className="text-[1rem] leading-7 text-[#253146]">
                          {bmiPanelCopy.description}
                        </p>
                        <button
                          type="button"
                          className="hs-solid-btn mt-5 inline-flex min-h-[3.35rem] w-full items-center justify-center gap-2 rounded-full px-8 text-[1rem] font-semibold"
                        >
                          Start treatment today
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-4 text-[0.8rem] leading-6 text-[#67748d]">
          <p>
            *BMI doesn&apos;t directly measure body fat and may not accurately
            reflect health for people with high muscle mass, pregnant women,
            children, older adults, certain ethnic groups, or those with medical
            conditions.
          </p>
          <p>
            The BMI calculator does not determine eligibility for weight-loss
            treatments. A licensed healthcare provider must evaluate your
            overall health and history to decide if treatment is right for you.
          </p>
        </div>
      </ModalShell>
    </>
  );
}

export function ProductPageTestSections() {
  return (
    <>
      <ExperienceComparisonSection />
      <MemberResultsCarousel />
      <OutcomesStatsSection />
      <ProjectedLossCalculatorSection />
      <StagePlansSection />
      <CareSupportSection />
    </>
  );
}

export default function TestHeroPreviewContent() {
  return (
    <main className="bg-[#f7f8fc]">
      <section className="relative h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[52%] bg-white" />
        <div className="relative mx-auto grid h-full max-w-[1500px] grid-cols-1 gap-6 px-5 md:px-8 lg:grid-cols-[minmax(0,0.93fr)_minmax(420px,0.82fr)] lg:gap-8 lg:px-10">
          <section className="flex h-full items-center">
            <div className="mx-auto w-full max-w-[34rem] py-5 lg:py-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-[1rem] bg-white px-3 py-3 shadow-[0_18px_36px_rgba(20,24,34,0.08)]">
                  <p className="font-headline text-[1.35rem] font-extrabold leading-none text-[#11151f]">
                    Forbes
                  </p>
                  <p className="mt-1 text-[0.82rem] font-semibold uppercase tracking-[0.16em] text-[#5f66d8]">
                    Health 2026
                  </p>
                  <p className="mt-2 text-[0.78rem] font-medium text-[#5c6170]">
                    GLP-1 Provider
                  </p>
                </div>

                <div className="rounded-[1rem] bg-white px-5 py-4 shadow-[0_18px_36px_rgba(20,24,34,0.08)]">
                  <p className="font-headline text-[2.2rem] font-semibold italic leading-none text-[#121622]">
                    1,200,000+
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-6">
                    <p className="text-[1.05rem] font-medium text-[#2b3040]">
                      Prescriptions written
                    </p>
                    <div className="flex -space-x-2">
                      {[
                        "/photoroom-6.png",
                        "/photoroom-4.png",
                        "/photoroom-3.png",
                      ].map((src) => (
                        <span
                          key={src}
                          className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-[#eef0f8]"
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="36px"
                            className="object-cover object-center"
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 max-w-[31rem]">
                <h1 className="font-headline text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#141722] sm:text-[3rem] lg:text-[4rem]">
                  Your weight isn&apos;t a willpower problem.
                </h1>
                <p className="mt-1.5 font-headline text-[2.15rem] italic leading-[1.02] tracking-[-0.05em] text-[#6D6FFC] sm:text-[2.55rem] lg:text-[3.55rem]">
                  It&apos;s a medical one.
                </p>
                <p className="mt-4 max-w-[29rem] text-[0.98rem] leading-6 text-[#4d5160] lg:text-[1.01rem]">
                  Personalized GLP-1 treatment. Unlimited clinician-led care.
                  Delivered to your door with a cleaner, calmer care journey
                  from intake to refill.
                </p>
              </div>

              <div className="mt-6 max-w-[32rem] space-y-3">
                <InfoRow icon={Stethoscope}>
                  Compounded Semaglutide &amp; Tirzepatide with clinician-guided
                  support and a treatment path that feels simple from day one.
                </InfoRow>
                <InfoRow icon={Clock3}>
                  Month-to-month plans, straightforward billing, and progress
                  tracking without bouncing across disconnected tools.
                </InfoRow>
                <InfoRow icon={ShieldCheck}>
                  Private onboarding, secure follow-up care, and visible next
                  steps from qualification to ongoing treatment.
                </InfoRow>
              </div>

              <div className="mt-6">
                <Link
                  href="/funnels/glp-1"
                  className="hs-solid-btn inline-flex min-h-[3.5rem] items-center justify-center gap-2 rounded-full px-8 text-base font-semibold"
                >
                  Get my personalized plan
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-3 text-sm text-[#6b7082]">
                  Takes 90 seconds · 100% private · Free
                </p>
              </div>
            </div>
          </section>

          <section className="relative h-full overflow-hidden rounded-[1rem]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[#f7f8fc] via-[#f7f8fc]/92 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#f7f8fc] via-[#f7f8fc]/92 to-transparent" />
            <div className="grid h-full grid-cols-2 gap-3 lg:gap-4">
              <VerticalLoopColumn items={LEFT_MARQUEE_ITEMS} />
              <VerticalLoopColumn items={RIGHT_MARQUEE_ITEMS} reverse />
            </div>
          </section>
        </div>
      </section>

      <ProductPageTestSections />
    </main>
  );
}
