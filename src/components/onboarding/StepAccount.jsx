"use client";

import React, { useState } from "react";
import Link from "next/link";
import { buildLoginPath } from "@/lib/auth-routing";
import { LEGAL_ROUTE_PATHS } from "@/lib/legal-links";
import AppIcon from "@/components/ui/AppIcon";

export default function StepAccount({ email, password, onChange, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);

  const pwValid = password && password.length >= 8 && /\d/.test(password);
  const emailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailValid && pwValid;

  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-[#1c1a24] tracking-tight mb-3">
          Get Medical Care in Minutes
        </h1>
        <p className="text-[#484555] font-body text-base max-w-md mx-auto leading-relaxed">
          Join thousands of patients receiving clinical-grade treatment from the
          comfort of home.
        </p>
      </section>

      <div className="w-full bg-white rounded-xl shadow-[0_32px_64px_-12px_rgba(28,26,36,0.04)] p-8 md:p-10 border border-[#c9c4d8]/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit) onSubmit();
          }}
          className="space-y-6"
        >
          {/* Email */}
          <div>
            <label
              className="block text-xs font-semibold text-[#797587] mb-1.5 ml-1"
              htmlFor="onb-email"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="onb-email"
                type="email"
                value={email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="name@example.com"
                className="w-full bg-white border-2 border-[#c9c4d8]/20 focus:border-[#5b3cdd] focus:ring-0 rounded-xl px-4 py-3.5 font-body text-[#1c1a24] placeholder:text-[#797587]/40 transition-all outline-none"
              />
              <AppIcon
                name="mail"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#797587]/40"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-xs font-semibold text-[#797587] mb-1.5 ml-1"
              htmlFor="onb-password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="onb-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => onChange({ password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white border-2 border-[#c9c4d8]/20 focus:border-[#5b3cdd] focus:ring-0 rounded-xl px-4 py-3.5 font-body text-[#1c1a24] placeholder:text-[#797587]/40 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#797587]/40 cursor-pointer hover:text-[#5b3cdd] transition-colors"
              >
                <AppIcon
                  name={showPassword ? "visibility_off" : "visibility"}
                />
              </button>
            </div>
            <p className="text-[11px] text-[#c9c4d8] mt-2 px-1">
              Must be at least 8 characters with one number.
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 hs-gradient-btn font-headline font-bold text-lg rounded-xl transition-all mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create an Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#484555] font-body text-sm">
            Already have an account?{" "}
            <Link
              className="text-[#5b3cdd] font-bold hover:underline"
              href={buildLoginPath()}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <section className="w-full grid grid-cols-2 md:grid-cols-3 gap-6 items-center border-t border-[#c9c4d8]/20 pt-8">
        {[
          { icon: "verified_user", label: "HIPAA Compliant" },
          { icon: "lock", label: "Secure SSL Encryption" },
          { icon: "medical_services", label: "Board-Certified Care" },
        ].map(({ icon, label }) => (
          <div
            key={icon}
            className="flex flex-col items-center text-center space-y-2"
          >
            <div className="w-12 h-12 rounded-full bg-[#ebe6f3] flex items-center justify-center text-[#5b3cdd]">
              <AppIcon name={icon} />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#797587]">
              {label}
            </span>
          </div>
        ))}
      </section>

      <div className="text-center max-w-md mx-auto">
        <p className="text-[11px] leading-relaxed text-[#484555]/70 font-body">
          HealSend does not provide medical advice. Consult with a professional
          healthcare provider before starting any treatment. By creating an
          account, you agree to our{" "}
          <Link
            href={LEGAL_ROUTE_PATHS.terms}
            className="font-semibold text-[#5b3cdd] hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href={LEGAL_ROUTE_PATHS.privacy}
            className="font-semibold text-[#5b3cdd] hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
