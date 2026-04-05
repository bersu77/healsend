import Link from "next/link";
import {
  MarketingFooter,
  MarketingNavbar,
} from "@/components/marketing/shared";

export const dynamic = "force-dynamic";

export default async function LocalDevConsultationPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams?.orderId || "unknown";

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#7b75f0] selection:text-white">
      <MarketingNavbar />

      <main className="bg-[radial-gradient(circle_at_top_left,#efeaff,transparent_34%),linear-gradient(180deg,#ffffff_0%,#fbf9ff_100%)] px-4 pb-16 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm md:p-10">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#7b75f0]">
              Development Consultation
            </p>
            <h1 className="mb-5 text-4xl font-bold tracking-tight text-black md:text-5xl">
              Consultation fallback is active in local development.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#5f5b70]">
              The medical provider integration is not fully configured for this
              local environment, so HealSend is showing the development-safe
              consultation view instead of the live provider session.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-[#dcd4ff] bg-[#f6f2ff] px-5 py-4 text-sm font-semibold text-[#3c2e88]">
              Order ID: <span className="font-bold">{orderId}</span>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7b75f0]">
                Next steps
              </p>
              <div className="space-y-3 text-sm leading-7 text-[#5f5b70]">
                <p>Use your account to keep the rest of your HealSend care flow moving.</p>
                <p>This screen is only intended for local development and QA.</p>
              </div>
              <div className="mt-6 space-y-3">
                <Link
                  href="/account"
                  className="inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#25242a]"
                >
                  Open account
                </Link>
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold text-[#17181d] transition-colors hover:bg-[#f6f6f8]"
                >
                  Back to homepage
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
