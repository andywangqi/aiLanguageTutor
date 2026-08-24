import type { MetadataRoute } from "next";
import { localeUrl, locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...locales.map((locale) => ({
      url: localeUrl(siteUrl, locale),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: locale === "en" ? 1 : 0.8
    })),
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3
    }
  ];
}
