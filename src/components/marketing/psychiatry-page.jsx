import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Stethoscope } from "lucide-react";
import { buildLoginPath } from "@/lib/auth-routing";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";

const CARE_STEPS = [
  {
    title: "Start with a focused assessment",
    description:
      "Choose the medication page that matches your symptoms and complete a short intake.",
    icon: Stethoscope,
  },
  {
    title: "Get clinician review and treatment guidance",
    description:
      "A licensed provider reviews your information and helps determine the right option.",
    icon: ShieldCheck,
  },
  {
    title: "Manage care with follow-up support",
    description:
      "Stay on track with messaging, refill coordination, and continued provider oversight.",
    icon: CheckCircle2,
  },
];

export default function MarketingPsychiatryPage({ page }) {
  const previewCards = page.featuredTreatments.slice(0, 3);

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <section className="bg-[radial-gradient(circle_at_top_left,#efeaff,transparent_34%),linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] px-4 pb-16 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto grid max-w-[1340px] gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              {page.eyebrow}
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-black md:text-6xl">
              {page.title}
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-[#5f5b70] md:text-xl">
              {page.description}
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              {page.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#433f53]"
                >
                  {highlight}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#treatments"
                className="inline-flex items-center gap-2 rounded-full bg-[#17181d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Explore treatment options
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={buildLoginPath()}
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-[#17181d] transition-colors hover:bg-[#f6f6f8]"
              >
                Access your account
              </Link>
            </div>

            <div className="mt-10 rounded-[1.75rem] border border-black/5 bg-[#17181d] p-5 text-white shadow-sm">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
                Insurance friendly care
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {page.insuranceLogos.map((logo) => (
                  <div
                    key={logo}
                    className="flex h-14 min-w-[92px] items-center justify-center rounded-2xl bg-white/8 px-4"
                  >
                    <img
                      src={logo}
                      alt=""
                      className="max-h-7 max-w-[110px] object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {previewCards.map((item, index) => (
              <Link
                key={item.slug}
                href={item.href}
                className={`group grid gap-4 rounded-[1.75rem] border border-black/5 bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 md:grid-cols-[110px_minmax(0,1fr)] ${
                  index === 0 ? "md:translate-x-0" : index === 1 ? "md:translate-x-6" : "md:translate-x-12"
                }`}
              >
                <div className="overflow-hidden rounded-[1.25rem] bg-[#f6f5fb]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-28 w-full object-cover md:h-full"
                    />
                  ) : (
                    <div className="flex h-28 items-center justify-center text-[#a9acc0] md:h-full">
                      <Stethoscope className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
                    {item.label}
                  </p>
                  <h2 className="mb-2 text-xl font-bold tracking-tight text-black">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-7 text-[#5f5b70]">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="treatments" className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1340px]">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              Featured options
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-4xl">
              Explore medication pages built for clarity, not confusion.
            </h2>
            <p className="text-base leading-8 text-[#5f5b70]">
              Each page gives you a cleaner view into the medication, use cases,
              and what the HealSend treatment path looks like before you decide
              to move forward.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {page.featuredTreatments.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#f6f5fb]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#a9acc0]">
                      <Stethoscope className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
                    {item.label}
                  </p>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-black">
                    {item.title}
                  </h3>
                  <p className="mb-5 text-sm leading-7 text-[#5f5b70]">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#17181d] transition-colors group-hover:text-[#5a43d6]">
                    Explore page
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#faf8ff] px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1340px]">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              Care model
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-4xl">
              A calmer path from assessment to ongoing care.
            </h2>
            <p className="text-base leading-8 text-[#5f5b70]">
              The point of this custom rebuild is to make decision-making easier:
              fewer plugin-driven dead ends, clearer medication pages, and a more
              straightforward route into care.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CARE_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efff] text-[#7b75f0]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold tracking-tight text-black">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-[#5f5b70]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
