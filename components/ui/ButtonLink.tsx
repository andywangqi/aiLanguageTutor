"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/client";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  eventName?: string;
  eventProperties?: Record<string, unknown>;
};

export function ButtonLink({ href, children, variant = "primary", className = "", eventName, eventProperties }: ButtonLinkProps) {
  return (
    <Link
      className={`button button-${variant} ${className}`}
      href={href}
      onClick={() => {
        if (eventName) void trackEvent(eventName, eventProperties);
      }}
    >
      {children}
    </Link>
  );
}
