import type { MetadataRoute } from "next";
import { localeUrl, locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: localeUrl(siteUrl, locale),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === "en" ? 1 : 0.8
  }));
}
