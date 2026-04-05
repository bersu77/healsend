"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { flushSync } from "react-dom";
import { trackAffiliateClientEvent } from "@/lib/affiliate-tracking-client";

const INITIAL_PROGRESS = 16;
const MAX_PROGRESS = 90;
const COMPLETE_PROGRESS = 100;
const HIDE_DELAY_MS = 180;
const STALL_RESET_MS = 12000;

function buildRouteKey(pathname, searchParams) {
  const search = searchParams?.toString();
  return search ? `${pathname}?${search}` : pathname;
}

function getInternalNavigationTarget(target) {
  if (!(target instanceof Element)) {
    return null;
  }

  const anchor = target.closest("a[href]");
  if (!anchor) {
    return null;
  }

  const href = anchor.getAttribute("href");
  const targetAttr = anchor.getAttribute("target");

  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:") ||
    anchor.hasAttribute("download") ||
    (targetAttr && targetAttr !== "_self")
  ) {
    return null;
  }

  try {
    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) {
      return null;
    }

    const prefetchHref = `${url.pathname}${url.search}`;
    const currentHref = `${window.location.pathname}${window.location.search}`;

    if (!prefetchHref || prefetchHref === currentHref) {
      return null;
    }

    return {
      href: prefetchHref,
    };
  } catch {
    return null;
  }
}

export default function NavigationTracker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const stallTimerRef = useRef(null);
  const pendingHrefRef = useRef("");
  const prefetchedHrefsRef = useRef(new Set());
  const trackedRoutesRef = useRef(new Set());
  const routeKey = useMemo(
    () => buildRouteKey(pathname, searchParams),
    [pathname, searchParams],
  );

  const clearTimers = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
  };

  const finishNavigation = () => {
    clearTimers();
    pendingHrefRef.current = "";
    document.documentElement.classList.remove("hs-nav-loading");
    setProgress(COMPLETE_PROGRESS);
    hideTimerRef.current = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, HIDE_DELAY_MS);
  };

  const beginNavigation = (href) => {
    if (!href || pendingHrefRef.current === href) {
      return;
    }

    clearTimers();
    pendingHrefRef.current = href;
    document.documentElement.classList.add("hs-nav-loading");
    flushSync(() => {
      setIsNavigating(true);
      setProgress((current) =>
        current > INITIAL_PROGRESS ? current : INITIAL_PROGRESS,
      );
    });

    progressTimerRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= MAX_PROGRESS) {
          return current;
        }

        const remaining = MAX_PROGRESS - current;
        return current + Math.max(2.5, remaining * 0.14);
      });
    }, 140);

    stallTimerRef.current = setTimeout(() => {
      pendingHrefRef.current = "";
      setIsNavigating(false);
      setProgress(0);
      clearTimers();
    }, STALL_RESET_MS);
  };

  const prefetchNavigation = (href) => {
    if (!href || prefetchedHrefsRef.current.has(href)) {
      return;
    }

    prefetchedHrefsRef.current.add(href);
    router.prefetch(href);
  };

  useEffect(() => {
    if (!routeKey || trackedRoutesRef.current.has(routeKey)) {
      return;
    }

    trackedRoutesRef.current.add(routeKey);
    trackAffiliateClientEvent({
      eventType: "PAGE_VIEW",
      eventName: "page_view",
      path: routeKey,
      metadata: {
        title: typeof document !== "undefined" ? document.title : "",
      },
    });
  }, [routeKey]);

  useEffect(() => {
    if (!pendingHrefRef.current) {
      return;
    }

    finishNavigation();
  }, [routeKey]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        event.defaultPrevented ||
        event.pointerType === "mouse" && event.button !== 0
      ) {
        return;
      }

      const target = getInternalNavigationTarget(event.target);
      if (!target) {
        return;
      }

      beginNavigation(target.href);
    };

    const handleClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = getInternalNavigationTarget(event.target);
      if (!target) {
        return;
      }

      beginNavigation(target.href);
    };

    const handlePrefetch = (event) => {
      const target = getInternalNavigationTarget(event.target);
      if (!target) {
        return;
      }

      prefetchNavigation(target.href);
    };

    const handlePageShow = () => {
      clearTimers();
      pendingHrefRef.current = "";
      document.documentElement.classList.remove("hs-nav-loading");
      setIsNavigating(false);
      setProgress(0);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("mouseover", handlePrefetch, true);
    document.addEventListener("touchstart", handlePrefetch, {
      capture: true,
      passive: true,
    });
    document.addEventListener("focusin", handlePrefetch, true);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mouseover", handlePrefetch, true);
      document.removeEventListener("touchstart", handlePrefetch, true);
      document.removeEventListener("focusin", handlePrefetch, true);
      window.removeEventListener("pageshow", handlePageShow);
      clearTimers();
    };
  }, [router]);

  useEffect(() => {
    document.documentElement.classList.toggle("hs-nav-loading", isNavigating);

    return () => {
      document.documentElement.classList.remove("hs-nav-loading");
    };
  }, [isNavigating]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[3px]"
    >
      <div
        className="h-full origin-left bg-[linear-gradient(90deg,#5b3cdd_0%,#7b75f0_55%,#9fe8d7_100%)] shadow-[0_0_22px_rgba(91,60,221,0.42)] transition-[transform,opacity] duration-200 ease-out"
        style={{
          opacity: isNavigating || progress > 0 ? 1 : 0,
          transform: `scaleX(${Math.min(progress, COMPLETE_PROGRESS) / 100})`,
        }}
      />
    </div>
  );
}
