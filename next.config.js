/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ["@prisma/client", "prisma"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/quiz",
        destination: "/funnels/glp-1-eligibility",
        permanent: true,
      },
      {
        source: "/onboarding/:slug",
        destination: "/funnels/:slug",
        permanent: true,
      },
      {
        source: "/dashboard/onboarding",
        destination: "/dashboard/funnels",
        permanent: true,
      },
      {
        source: "/get-started",
        destination: "/",
        permanent: true,
      },
      {
        source: "/glp-1",
        destination: "/weight-loss",
        permanent: true,
      },
      {
        source: "/glp-1-form",
        destination: "/weight-loss",
        permanent: true,
      },
      {
        source: "/glp-1-weight-loss",
        destination: "/weight-loss",
        permanent: true,
      },
      {
        source: "/product",
        destination: "/nad",
        permanent: true,
      },
      {
        source: "/nad-therapy",
        destination: "/nad",
        permanent: true,
      },
      {
        source: "/nad-injections",
        destination: "/nad",
        permanent: true,
      },
      {
        source: "/pt-141",
        destination: "/pt-141-nasal-spray",
        permanent: true,
      },
      {
        source: "/sildefanil",
        destination: "/viagra-sildenafil",
        permanent: true,
      },
      {
        source: "/sildenafil",
        destination: "/viagra-sildenafil",
        permanent: true,
      },
      {
        source: "/generic-viagra",
        destination: "/viagra-sildenafil",
        permanent: true,
      },
      {
        source: "/oxytocin",
        destination: "/oxytocin-nasal-spray",
        permanent: true,
      },
      {
        source: "/oxytocin-prefunnel",
        destination: "/oxytocin-nasal-spray",
        permanent: true,
      },
      {
        source: "/nadglutathione",
        destination: "/nad",
        permanent: true,
      },
      {
        source: "/enclomiphene-2",
        destination: "/enclomiphene",
        permanent: true,
      },
      {
        source: "/enclomiphene-3",
        destination: "/enclomiphene",
        permanent: true,
      },
      {
        source: "/sleep-2",
        destination: "/glutathione-low-dose-naltrexone-ldn",
        permanent: true,
      },
      {
        source: "/glp-1-2",
        destination: "/weight-loss",
        permanent: true,
      },
      {
        source: "/vitality-core",
        destination: "/weight-loss",
        permanent: true,
      },
      {
        source: "/hrtlite",
        destination: "/strength-recovery",
        permanent: true,
      },
      {
        source: "/pt-141-prefunnel",
        destination: "/pt-141-nasal-spray",
        permanent: true,
      },
      {
        source: "/pt-141-oxytocin-questionnaire",
        destination: "/pt-141-oxytocin-nasal-sprays",
        permanent: true,
      },
      {
        source: "/trt-prefunnel",
        destination: "/strength-recovery",
        permanent: true,
      },
      {
        source: "/tirzepatide-injection",
        destination: "/tirzepatide-injections",
        permanent: true,
      },
      {
        source: "/patient-login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/log-in-to-your-account",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/admin-login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/patient-signup",
        destination: "/signup",
        permanent: true,
      },
      {
        source: "/my-account",
        destination: "/account",
        permanent: true,
      },
      {
        source: "/sermorelin",
        destination: "/strength-recovery",
        permanent: true,
      },
      {
        source: "/sermorelin-therapy",
        destination: "/strength-recovery",
        permanent: true,
      },
      {
        source: "/adhd/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/birth-control/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/psychiatry/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/recovery/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/resume-fluent-form-where-you-left/:step/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/category/anxiety",
        destination: "/psychiatry",
        permanent: true,
      },
      {
        source: "/category/depression",
        destination: "/psychiatry",
        permanent: true,
      },
      {
        source: "/category/hormone-health",
        destination: "/strength-recovery",
        permanent: true,
      },
      {
        source: "/category/insomnia",
        destination: "/sleep",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/product-category/249",
        destination: "/weight-loss",
        permanent: true,
      },
      {
        source: "/product-category/250",
        destination: "/weight-loss",
        permanent: true,
      },
      {
        source: "/product-category/medication",
        destination: "/weight-loss",
        permanent: true,
      },
      {
        source: "/product-category/pt_141",
        destination: "/pt-141-nasal-spray",
        permanent: true,
      },
      {
        source: "/product-category/sermorelin-therapy",
        destination: "/strength-recovery",
        permanent: true,
      },
      {
        source: "/product-category/hrt-lite",
        destination: "/strength-recovery",
        permanent: true,
      },
      {
        source: "/product-category/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/weight-loss/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/sexual-health/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/energy-recovery-longevity/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/anti-aging/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/strength-recovery/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/sleep/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/treatments/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "healsend.com",
      },
      {
        protocol: "https",
        hostname: "www.healsend.com",
      },
    ],
  },
};

module.exports = nextConfig;
