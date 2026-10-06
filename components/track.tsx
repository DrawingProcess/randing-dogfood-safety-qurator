"use client";

import { useEffect } from "react";
import { SKIP_TRACK_COOKIE, SKIP_TRACK_VALUE } from "@/lib/gate-cookies";
import type { EventName, PetType } from "@/lib/types";

const SESSION_KEY = "mmn_session_id";

function shouldSkipTracking() {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => {
    const [name, ...rest] = part.trim().split("=");
    return name === SKIP_TRACK_COOKIE && rest.join("=") === SKIP_TRACK_VALUE;
  });
}

export type TrackInput = {
  event_name: EventName;
  page?: string;
  product_id?: string | null;
  pet_type?: PetType | null;
  metadata?: Record<string, string | number | boolean | string[] | null>;
};

export function getSessionId() {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, created);
  return created;
}

export function trackEvent(input: TrackInput) {
  if (shouldSkipTracking()) return;
  const payload = JSON.stringify({
    session_id: getSessionId(),
    page: window.location.pathname,
    ...input,
  });
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

export function TrackOnMount(input: TrackInput) {
  const key = JSON.stringify(input);
  useEffect(() => {
    trackEvent(JSON.parse(key) as TrackInput);
  }, [key]);
  return null;
}
