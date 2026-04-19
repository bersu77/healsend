import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isGuestCartEnabled, LOCAL_CART_EMAIL } from "@/lib/cart";
import AppIcon from "@/components/ui/AppIcon";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order Confirmed | HealSend",
  robots: {
    index: false,
    follow: false,
  },
};

const FEATURES = [
  {
    title: "Unlimited Video Calls With Clinicians",
    points: [
      "See a licensed clinician same-day",
      "Unlimited visits, all online",
    ],
    image: "/images/marketing/bundle/care-support-lifestyle.webp",
    imageClass:
      "absolute bottom-0 right-0 h-full w-2/5 object-cover object-top rounded-tr-[1.5rem]",
  },
  {
    title: "Always On Medical Assistance via Phone",
    points: [
      "Questions about side effects? Call our medical hotline",
      "Fast, clear support from U.S. agents only — no offshore centers",
    ],
    image: null,
    imageClass: null,
  },
  {
    title: "On-Time Refills Guaranteed",
    points: [
      "Fast, reliable delivery for every refill",
      "Refills arrive before you ever run out",
    ],
    image: "/images/marketing/bundle/tirzepatide-injections-product.png",
    imageClass:
      "absolute bottom-2 right-3 w-36 object-contain mix-blend-multiply md:w-44",
  },
  {
    title: "Real-Time Access to Member Community & Platform",
    points: [
      "Share tips, advice, and progress with other members",
      "Win rewards, get expert help, and more",
    ],
    image: null,
    imageClass: null,
  },
];

function canViewOrder(order, user) {
  if (!order) {
    return false;
  }

  if (user?.role === "ADMIN" || user?.id === order.userId) {
    return true;
  }

  return (
    !user && isGuestCartEnabled() && order.user?.email === LOCAL_CART_EMAIL
  );
}

export default async function OrderConfirmationPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const orderId =
    typeof resolvedSearchParams.orderId === "string"
      ? resolvedSearchParams.orderId
      : "";
  const user = await getCurrentUser();

  let order = null;

  if (orderId) {
    const candidateOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true, variant: true } },
        user: { select: { id: true, email: true, name: true } },
        address: true,
      },
    });

    if (canViewOrder(candidateOrder, user)) {
      order = JSON.parse(JSON.stringify(candidateOrder));
    }
  }

  const consultationHref = order?.items?.some(
    (item) => item?.product?.telehealthProvider === "OLA",
  )
    ? `/consultation/ola/${order.id}`
    : order
      ? `/consultation/${order.id}`
      : "/account";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1 bg-[#f9f9f9] py-16">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          {/* Order confirmed badge */}
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <AppIcon name="check_circle" className="text-base" />
              {orderId
                ? `Order Confirmed — #${orderId.slice(0, 8).toUpperCase()}`
                : "Order Confirmed"}
            </span>
          </div>

          {/* Section heading */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-[#7b75f0] md:text-5xl lg:text-6xl">
              The most comprehensive GLP-1 care program online.
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 md:text-xl">
              Most GLP-1 programs stop at medications. We deliver expert-led
              care &amp; clinician support for faster, safer results.
            </p>
          </div>

          {/* White card */}
          <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-10 lg:p-12">
            {/* Logo + intro */}
            <div className="mb-10 text-center">
              <div className="mb-5 flex items-center justify-center gap-2">
                <Image
                  src="/logo.png"
                  alt="HealSend"
                  width={34}
                  height={34}
                  className="object-contain"
                />
                <span className="text-2xl font-bold text-[#5b3cdd]">
                  HealSend
                </span>
              </div>
              <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
                You&apos;re not just getting medication. You&apos;re getting
                full care on demand to keep you motivated, safe, &amp; reaching
                your weight-loss goals.
              </p>
            </div>

            {/* 2×2 feature grid */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="relative flex min-h-[280px] flex-col overflow-hidden rounded-[1.5rem] bg-[#f4f5f9] shadow-sm"
                >
                  {/* "included" badge */}
                  <div className="flex items-center justify-center gap-1.5 bg-[#7b75f0] py-2 text-xs font-bold uppercase tracking-widest text-white">
                    included <AppIcon name="check_circle" className="text-sm" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-1 flex-col p-6 md:p-8 md:pr-40">
                    <h3 className="mb-4 text-xl font-bold leading-snug text-[#7b75f0] md:max-w-[65%]">
                      {feature.title}
                    </h3>
                    <ul className="space-y-2.5 md:max-w-[65%]">
                      {feature.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <AppIcon
                            name="check"
                            className="mt-0.5 shrink-0 text-[14px] text-[#7b75f0]"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Image / illustration */}
                  {feature.image ? (
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className={`hidden md:block ${feature.imageClass}`}
                    />
                  ) : feature.title.includes("Phone") ? (
                    /* Phone support — styled badge */
                    <div className="absolute bottom-5 right-5 hidden h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#eef1ff] shadow-xl md:flex">
                      <AppIcon
                        name="headset_mic"
                        className="text-4xl text-[#7b75f0]"
                      />
                    </div>
                  ) : (
                    /* Community — overlapping avatar circles */
                    <div className="absolute bottom-6 right-5 hidden md:flex">
                      {[
                        { initials: "SM", bg: "#7b75f0" },
                        { initials: "MT", bg: "#5b3cdd" },
                        { initials: "JR", bg: "#474fd7" },
                      ].map(({ initials, bg }, i) => (
                        <div
                          key={initials}
                          className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-sm font-bold text-white shadow"
                          style={{
                            backgroundColor: bg,
                            marginLeft: i === 0 ? 0 : -16,
                            zIndex: 3 - i,
                          }}
                        >
                          {initials}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={consultationHref}
              className="hs-solid-btn mx-auto block w-full max-w-2xl rounded-full py-4 text-center text-lg font-bold md:py-5 md:text-xl"
            >
              Start Your Weight Loss Journey
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
