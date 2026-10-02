"use client";

import { useEffect } from "react";
import type { EventName, PetType } from "@/lib/types";

const SESSION_KEY = "mmn_session_id";

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
