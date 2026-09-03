"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { localeFromPathname } from "@/lib/i18n/config";

export function DocumentLanguage() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    document.documentElement.lang = localeFromPathname(pathname);
  }, [pathname]);

  return null;
}
