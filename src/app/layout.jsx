import "@/index.css";
import Providers from "./providers";
import { getCurrentUser } from "@/lib/auth";
import { getSiteUrl } from "@/lib/seo";
import ReferralTracker from "@/components/affiliate/ReferralTracker";

const siteUrl = getSiteUrl();

export const metadata = {
  title: "HealSend",
  description:
    "Clinician-guided treatment, onboarding, and ongoing care through the custom HealSend experience.",
  metadataBase: siteUrl,
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    siteName: "HealSend",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const currentUser = await getCurrentUser();
  const initialUser = currentUser
    ? {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role,
      }
    : null;

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body suppressHydrationWarning>
        <Providers initialUser={initialUser}>
          <ReferralTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
