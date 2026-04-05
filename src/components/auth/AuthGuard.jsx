"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { buildLoginPath } from "@/lib/auth-routing";

/** @param {{ children: React.ReactNode }} props */
export default function AuthGuard({ children }) {
  const { isLoadingAuth, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push(buildLoginPath(pathname || "/account"));
    return null;
  }

  return <>{children}</>;
}
