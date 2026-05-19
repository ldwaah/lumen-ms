"use client";

import posthog from "posthog-js";

let initialized = false;

export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
}

export function initAnalytics(): void {
  if (initialized) return;
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host:
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    capture_pageview: false,
    persistence: "localStorage",
    autocapture: false,
    disable_session_recording: true,
  });
  initialized = true;
}

export function isInitialized(): boolean {
  return initialized;
}

export function identifyUser(userId: string): void {
  if (!initialized) return;
  posthog.identify(userId);
}

export function resetUser(): void {
  if (!initialized) return;
  posthog.reset();
}

export function capturePageview(pathname: string): void {
  if (!initialized) return;
  posthog.capture("$pageview", { $pathname: pathname });
}

export type AnalyticsEvent =
  | "check_in_saved"
  | "coach_message_sent"
  | "coach_safety_triggered"
  | "program_step_started"
  | "program_step_completed"
  | "pdf_export_downloaded";

export function captureEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | null | undefined>,
): void {
  if (!initialized) return;
  posthog.capture(event, properties);
}
