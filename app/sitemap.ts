import type { MetadataRoute } from "next";
import { localeUrl, locales, localizedPath } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/seo/metadata";

const informationPaths = ["contact", "privacy", "terms"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...locales.map((locale) => ({
      url: localeUrl(siteUrl, locale),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: locale === "en" ? 1 : 0.8
    })),
    ...locales.map((locale) => ({
      url: `${siteUrl}${localizedPath(locale, "/pricing")}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: locale === "en" ? 0.7 : 0.55
    })),
    ...informationPaths.flatMap((path) =>
      locales.map((locale) => ({
        url: `${siteUrl}${localizedPath(locale, `/${path}`)}`,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: path === "contact" ? 0.4 : 0.3
      }))
    )
  ];
}
