"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  capturePageview,
  identifyUser,
  initAnalytics,
  isAnalyticsEnabled,
} from "@/lib/analytics";

function PostHogIdentify() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "authenticated" && userId) {
      identifyUser(userId);
    }
  }, [status, userId]);

  return null;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    capturePageview(pathname);
    // Re-run when query params change; only pathname is sent (no tokens).
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  if (!isAnalyticsEnabled()) {
    return <>{children}</>;
  }

  return (
    <>
      <PostHogIdentify />
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
