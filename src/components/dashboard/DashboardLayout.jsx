"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import AppIcon from "@/components/ui/AppIcon";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { buildLoginPath } from "@/lib/auth-routing";
import { useAuth } from "@/lib/AuthContext";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Homepage", href: "/dashboard/homepage", icon: "home" },
  { label: "Products", href: "/dashboard/products", icon: "inventory_2" },
  {
    label: "Product Detail Pages",
    href: "/dashboard/product-pages",
    icon: "view_carousel",
  },
  { label: "Categories", href: "/dashboard/categories", icon: "category" },
  { label: "Brands", href: "/dashboard/brands", icon: "branding_watermark" },
  {
    label: "Affiliate Partners",
    href: "/dashboard/affiliate-partners",
    icon: "group_add",
  },
  { label: "Orders", href: "/dashboard/orders", icon: "shopping_bag" },
  {
    label: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: "autorenew",
  },
  { label: "Payments", href: "/dashboard/payments", icon: "payments" },
  { label: "Navigation", href: "/dashboard/navigation", icon: "menu_open" },
  { label: "Forms", href: "/dashboard/forms", icon: "dynamic_form" },
  { label: "Funnels", href: "/dashboard/funnels", icon: "route" },
  { label: "Users", href: "/dashboard/users", icon: "group" },
  {
    label: "Integration Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("Not authenticated");
        return r.json();
      })
      .then((data) => {
        if (data.user.role !== "ADMIN") {
          router.push(buildLoginPath(pathname || "/dashboard"));
          return;
        }
        setAdmin(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push(buildLoginPath(pathname || "/dashboard"));
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    await logout();
    setAdmin(null);
    setMobileNavOpen(false);
    router.replace(buildLoginPath());
  };

  const activeNavLabel =
    NAV.find(
      (n) =>
        n.href === pathname ||
        (n.href !== "/dashboard" && pathname.startsWith(n.href)),
    )?.label || "Dashboard";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf8ff]">
        <div className="animate-spin w-8 h-8 border-2 border-[#5b3cdd] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#fdf8ff]">
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent
          side="left"
          className="w-[18rem] border-r border-[#c9c4d8]/20 bg-white p-0 text-[#1c1a24] [&>button]:hidden"
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-[#c9c4d8]/20 p-6">
              <SheetTitle className="sr-only">Admin navigation</SheetTitle>
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileNavOpen(false)}
              >
                <Image
                  src="/logo.png"
                  alt="HealSend"
                  width={124}
                  height={26}
                  className="h-6 w-auto"
                  priority
                />
              </Link>
              <p className="mt-1 text-xs text-[#484555]">Admin Dashboard</p>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {NAV.map(({ label, href, icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(href));

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#e5deff] text-[#5b3cdd]"
                        : "text-[#484555] hover:bg-[#f1ecf9] hover:text-[#5b3cdd]"
                    }`}
                  >
                    <AppIcon name={icon} className="h-5 w-5" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-2 border-t border-[#c9c4d8]/20 p-4">
              {admin ? (
                <div className="px-4 py-2 text-xs text-[#484555]">
                  <p className="font-semibold text-[#1c1a24]">
                    {admin.name || admin.email}
                  </p>
                  <p>{admin.email}</p>
                </div>
              ) : null}
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 px-4 text-sm text-[#484555] transition-colors hover:text-[#5b3cdd]"
              >
                <AppIcon name="storefront" className="h-[18px] w-[18px]" />
                Visit Store
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 text-sm text-red-500 transition-colors hover:text-red-700"
              >
                <AppIcon name="logout" className="h-[18px] w-[18px]" />
                Logout
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-[#c9c4d8]/20 bg-white lg:flex">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="HealSend"
              width={124}
              height={26}
              className="h-6 w-auto"
              priority
            />
          </Link>
          <p className="text-xs text-[#484555] mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(({ label, href, icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#e5deff] text-[#5b3cdd]"
                    : "text-[#484555] hover:bg-[#f1ecf9] hover:text-[#5b3cdd]"
                }`}
              >
                <AppIcon name={icon} className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#c9c4d8]/20 space-y-2">
          {admin && (
            <div className="px-4 py-2 text-xs text-[#484555]">
              <p className="font-semibold text-[#1c1a24]">
                {admin.name || admin.email}
              </p>
              <p>{admin.email}</p>
            </div>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 text-sm text-[#484555] hover:text-[#5b3cdd] transition-colors"
          >
            <AppIcon name="storefront" className="h-[18px] w-[18px]" />
            Visit Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            <AppIcon name="logout" className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#c9c4d8]/20 bg-white px-6 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c9c4d8]/30 bg-[#faf9fe] text-[#484555] transition-colors hover:bg-white hover:text-[#5b3cdd] lg:hidden"
              aria-label="Open admin navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="font-headline text-lg font-bold text-[#1c1a24]">
              {activeNavLabel}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <AppIcon
              name="notifications"
              className="h-5 w-5 cursor-pointer text-[#484555] hover:text-[#5b3cdd]"
            />
            <div className="w-8 h-8 rounded-full bg-[#5b3cdd] flex items-center justify-center text-white text-sm font-bold">
              {(admin?.name || admin?.email || "A")[0].toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
