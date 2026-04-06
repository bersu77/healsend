"use client";

import React, { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { buildSupportMailto } from "@/lib/legal-links";
import { useAuth } from "@/lib/AuthContext";
import AuthPageShell from "@/components/auth/AuthPageShell";
import {
  buildSignupPath,
  normalizeLoginRedirectPath,
} from "@/lib/auth-routing";
import { parseOAuthPopupPayload } from "@/lib/oauth-popup";

const OAUTH_ERROR_MESSAGES = {
  access_denied: "Sign-in was cancelled.",
  invalid_state: "Session expired. Please try again.",
  token_exchange_failed: "Authentication failed. Please try again.",
  userinfo_failed: "Could not retrieve your account info.",
  no_email: "Email is required to sign in.",
  oauth_failed: "Something went wrong. Please try again.",
  oauth_disabled: "That sign-in provider is not enabled right now.",
  missing_code: "Authentication was incomplete. Please try again.",
};

function openOAuthPopup(url) {
  const w = 500;
  const h = 600;
  const left = window.screenX + (window.outerWidth - w) / 2;
  const top = window.screenY + (window.outerHeight - h) / 2;
  const popup = window.open(
    url,
    "oauth_popup",
    `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`,
  );
  if (!popup) return;

  // Detect popup closed without completing OAuth → reload to reset page state
  let oauthCompleted = false;
  const onMsg = (e) => {
    if (e.origin === window.location.origin) {
      oauthCompleted = true;
      clearInterval(pollTimer);
      window.removeEventListener("message", onMsg);
    }
  };
  window.addEventListener("message", onMsg);
  const pollTimer = setInterval(() => {
    if (popup.closed) {
      clearInterval(pollTimer);
      window.removeEventListener("message", onMsg);
      if (!oauthCompleted) {
        window.location.reload();
      }
    }
  }, 500);
}

function getPostLoginDestination(role, redirectPath) {
  const normalizedRedirect = normalizeLoginRedirectPath(redirectPath);

  if (normalizedRedirect) {
    if (!normalizedRedirect.startsWith("/dashboard")) {
      return normalizedRedirect;
    }

    if (role === "ADMIN") {
      return normalizedRedirect;
    }
  }

  return role === "ADMIN" ? "/dashboard" : "/account";
}

function LoginPageContent({
  redirectPath = "",
  enableGoogleAuth = true,
  enableAppleAuth = true,
  onClose,
  onSwitchToSignup,
  overlay = false,
}) {
  const router = useRouter();
  const { login, refreshUser, user, isAuthenticated, isLoadingAuth } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const shouldStayOnCurrentPage = overlay && !redirectPath;
  const handleOAuthMessage = useCallback(
    async (e) => {
      if (e.origin !== window.location.origin) return;
      const data = parseOAuthPopupPayload(e.data);

      if (data?.type === "oauth_success") {
        setError("");
        await refreshUser();
        router.refresh();

        if (shouldStayOnCurrentPage) {
          onClose?.();
          return;
        }

        const role = data.user?.role;
        onClose?.();
        router.push(getPostLoginDestination(role, redirectPath));
      } else if (data?.type === "oauth_error") {
        setError(
          OAUTH_ERROR_MESSAGES[data.error] ||
            "Sign-in failed. Please try again.",
        );
      }
    },
    [onClose, redirectPath, refreshUser, router, shouldStayOnCurrentPage],
  );

  useEffect(() => {
    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, [handleOAuthMessage]);

  useEffect(() => {
    if (!isLoadingAuth && isAuthenticated && user?.role) {
      router.replace(getPostLoginDestination(user.role, redirectPath));
    }
  }, [isAuthenticated, isLoadingAuth, redirectPath, router, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      router.refresh();

      if (shouldStayOnCurrentPage) {
        onClose?.();
        return;
      }

      router.push(getPostLoginDestination(loggedInUser.role, redirectPath));
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Login"
      title="Your secure care account, without the back-and-forth."
      description="Sign in to review treatment progress, pick back up where you left off, and stay connected to your care team in one place."
      points={[
        "Continue medical reviews without restarting",
        "Track orders, messages, and follow-up care",
        "Use Google, Apple, or email sign-in",
      ]}
      secondaryCta={{ href: "/shop", label: "Browse treatments first" }}
      onClose={onClose}
      overlay={overlay}
    >
      <div className="w-full">
        <h2 className="mb-3 text-center font-headline text-[2.1rem] font-bold tracking-tight text-[#1c1a24] sm:text-[2.35rem]">
          Welcome back
        </h2>
        <p className="mb-8 text-center text-sm leading-6 text-[#5f5b70]">
          Continue to your account, action items, and treatment progress.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-[1.75rem] border border-[#d7d1e4] px-5 py-4 text-base transition-colors focus:border-[#5b3cdd] focus:outline-none"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-[1.75rem] border border-[#d7d1e4] px-5 py-4 pr-20 text-base transition-colors focus:border-[#5b3cdd] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#484555]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              href={buildSupportMailto("Password reset help")}
              className="text-sm text-[#5b3cdd] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error ? (
            <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="hs-solid-btn flex w-full items-center justify-center rounded-full py-4 text-base font-semibold disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#484555]">
          First time here?{" "}
          {typeof onSwitchToSignup === "function" ? (
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-semibold text-[#5b3cdd] hover:underline"
            >
              Create an account
            </button>
          ) : (
            <Link
              href={buildSignupPath(redirectPath)}
              className="font-semibold text-[#5b3cdd] hover:underline"
            >
              Create an account
            </Link>
          )}
        </p>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-[#484555]">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="space-y-3">
          {enableGoogleAuth ? (
            <button
              type="button"
              onClick={() => openOAuthPopup("/api/auth/google")}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[#d7d1e4] bg-white py-4 text-base font-medium transition-colors hover:bg-gray-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          ) : null}

          {enableAppleAuth ? (
            <button
              type="button"
              onClick={() => openOAuthPopup("/api/auth/apple")}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[#d7d1e4] bg-white py-4 text-base font-medium text-[#17181d] transition-colors hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Continue with Apple
            </button>
          ) : null}
        </div>
      </div>
    </AuthPageShell>
  );
}

function LoginPageWithSearchParams({
  redirectPathOverride = "",
  enableGoogleAuth = true,
  enableAppleAuth = true,
  onClose,
  onSwitchToSignup,
  overlay = false,
}) {
  const searchParams = useSearchParams();

  return (
    <LoginPageContent
      redirectPath={redirectPathOverride || searchParams.get("redirect") || ""}
      enableGoogleAuth={enableGoogleAuth}
      enableAppleAuth={enableAppleAuth}
      onClose={onClose}
      onSwitchToSignup={onSwitchToSignup}
      overlay={overlay}
    />
  );
}

export default function LoginPageClient({
  redirectPathOverride = "",
  enableGoogleAuth = true,
  enableAppleAuth = true,
  onClose,
  onSwitchToSignup,
  overlay = false,
}) {
  return (
    <Suspense
      fallback={
        <LoginPageContent
          redirectPath={redirectPathOverride}
          enableGoogleAuth={enableGoogleAuth}
          enableAppleAuth={enableAppleAuth}
          onClose={onClose}
          onSwitchToSignup={onSwitchToSignup}
          overlay={overlay}
        />
      }
    >
      <LoginPageWithSearchParams
        redirectPathOverride={redirectPathOverride}
        enableGoogleAuth={enableGoogleAuth}
        enableAppleAuth={enableAppleAuth}
        onClose={onClose}
        onSwitchToSignup={onSwitchToSignup}
        overlay={overlay}
      />
    </Suspense>
  );
}
