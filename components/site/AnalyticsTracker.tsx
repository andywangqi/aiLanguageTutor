"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/client";

export function AnalyticsTracker() {
  useEffect(() => {
    void trackEvent("app_opened");
  }, []);

  return null;
}

