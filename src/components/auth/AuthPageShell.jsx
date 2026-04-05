"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

const DEFAULT_POINTS = [
  "Licensed clinician review",
  "Private, secure account access",
  "Discreet delivery and follow-up care",
];

export default function AuthPageShell({
  eyebrow,
  description,
  points = DEFAULT_POINTS,
  children,
  secondaryCta,
  onClose,
  overlay = false,
}) {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(overlay ? false : true);
  const closeTimerRef = React.useRef(null);

  React.useEffect(() => {
    if (!overlay) {
      setIsVisible(true);
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frameId);
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [overlay]);

  const finishClose = React.useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
      return;
    }

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  }, [onClose, router]);

  const handleClose = React.useCallback(() => {
    if (!overlay) {
      finishClose();
      return;
    }

    setIsVisible(false);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      finishClose();
    }, 240);
  }, [finishClose, overlay]);

  return (
    <div
      className={`font-sans text-black selection:bg-[#7b75f0] selection:text-white ${
        overlay
          ? `fixed inset-0 z-[220] overflow-hidden bg-[rgba(15,23,42,0.26)] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`
          : "min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#efeaff,transparent_34%),linear-gradient(180deg,#f7f5ff_0%,#f1eff8_100%)]"
      }`}
      onClick={overlay ? handleClose : undefined}
    >
      <div className={`flex justify-end ${overlay ? "h-full" : "min-h-screen"}`}>
        <section
          onClick={overlay ? (event) => event.stopPropagation() : undefined}
          style={
            overlay
              ? { transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }
              : undefined
          }
          className={`relative w-full bg-white shadow-[0_26px_80px_rgba(15,23,42,0.14)] ${
            overlay
              ? `h-full overflow-y-auto overscroll-contain rounded-l-[2rem] transition-transform duration-300 ${
                  isVisible
                    ? "translate-x-0"
                    : "translate-x-[8%]"
                } w-[90vw] max-w-[32rem] sm:w-[78vw] sm:max-w-[34rem] lg:w-[58vw] lg:max-w-[44rem] xl:w-[52vw] xl:max-w-[48rem] 2xl:w-[46vw] 2xl:max-w-[50rem]`
              : "min-h-screen sm:max-w-[540px] lg:w-[60vw] lg:max-w-[1120px] lg:rounded-l-[2.5rem]"
          }`}
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close auth panel"
            className="absolute left-4 top-4 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f7fb] text-[#1c1a24] shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition-transform hover:scale-[1.02] md:left-6 md:top-6"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className={`mx-auto flex w-full flex-col px-5 pb-8 pt-6 sm:px-8 lg:px-10 xl:px-12 ${
              overlay
                ? "min-h-full max-w-[32rem] lg:max-w-[34rem] xl:max-w-[35rem]"
                : "min-h-screen max-w-[560px] lg:max-w-[640px]"
            }`}
          >
            <div className="mb-4 flex items-center justify-center pt-1">
              <p className="text-[1.8rem] font-semibold tracking-tight text-[#17181d]">
                {eyebrow}
              </p>
            </div>

            <div
              className={`mx-auto flex w-full max-w-[420px] flex-1 flex-col lg:max-w-[460px] ${
                overlay ? "justify-start pt-4" : "justify-center"
              }`}
            >
              {children}

              <div
                className={`overflow-hidden rounded-[2rem] border border-[#ece8ff] bg-[radial-gradient(circle_at_top_left,rgba(109,111,252,0.18),transparent_42%),linear-gradient(135deg,#ffffff_0%,#f7f2ff_45%,#fff8fc_100%)] shadow-[0_20px_40px_rgba(109,111,252,0.12)] ${
                  overlay ? "mt-5 p-4" : "mt-7 p-5"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-semibold leading-tight tracking-tight text-[#5b3cdd] ${
                        overlay ? "text-[1.45rem]" : "text-[1.75rem]"
                      }`}
                    >
                      Stay close to your care
                    </p>
                    <p className={`mt-2 leading-6 text-[#5f5b70] ${overlay ? "text-[13px]" : "text-sm"}`}>
                      {description}
                    </p>
                    <ul className={`text-[#292631] ${overlay ? "mt-3 space-y-2 text-[13px]" : "mt-4 space-y-3 text-sm"}`}>
                      {points.map((item) => (
                        <li key={item} className="flex items-center gap-2.5">
                          <CheckCircle2
                            className={`shrink-0 text-[#111111] ${overlay ? "h-4 w-4" : "h-5 w-5"}`}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {secondaryCta ? (
                      <div className="mt-5">
                        <Link
                          href={secondaryCta.href}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#17181d] transition-colors hover:text-[#5a43d6]"
                        >
                          <span>{secondaryCta.label}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={`relative mt-1 hidden shrink-0 overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/80 shadow-[0_14px_30px_rgba(15,23,42,0.1)] sm:block ${
                      overlay ? "h-24 w-20" : "h-28 w-24"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(109,111,252,0.18),transparent_46%),linear-gradient(180deg,#fff_0%,#f7f6ff_100%)]" />
                    <div className="relative flex h-full items-center justify-center p-4">
                      <Image
                        src="/logo.png"
                        alt="HealSend"
                        width={72}
                        height={72}
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
