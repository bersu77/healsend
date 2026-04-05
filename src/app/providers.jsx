"use client";

import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { AuthProvider } from "@/lib/AuthContext";
import { NotificationProvider } from "@/lib/NotificationContext";
import NavigationTracker from "@/lib/NavigationTracker";

export default function Providers({ children, initialUser = null }) {
  return (
    <AuthProvider initialUser={initialUser}>
      <QueryClientProvider client={queryClientInstance}>
        <NotificationProvider>
          <NavigationTracker />
          {children}
          <Toaster />
        </NotificationProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
