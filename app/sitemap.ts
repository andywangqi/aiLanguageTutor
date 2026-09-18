import type { MetadataRoute } from "next";
import { getPublicBlogPosts } from "@/lib/blog";
import { contentRoutes, getContentPagePath, type ContentCategory, type ContentSlug } from "@/lib/content-pages";
import { localeUrl, locales, localizedPath } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/seo/metadata";
import { scenarios } from "@/lib/scenarios";

const informationPaths = ["contact", "privacy", "terms"] as const;
const contentPaths = Object.entries(contentRoutes).flatMap(([category, slugs]) =>
  slugs.map((slug) => getContentPagePath(category as ContentCategory, slug as ContentSlug))
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blog = await getPublicBlogPosts("en");
  const blogPaths = (blog?.posts ?? []).flatMap((post) =>
    locales.map((locale) => ({
      url: `${siteUrl}${localizedPath(locale, `/learn/blog/${post.slug}`)}`,
      lastModified: post.updatedAt || post.publishedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: locale === "en" ? 0.65 : 0.55
    }))
  );

  return [
    ...scenarios.map((scenario) => ({
      url: `${siteUrl}/learn/${scenario.slug}`,
      lastModified: "2026-09-17",
      changeFrequency: "monthly" as const,
      priority: 0.65
    })),
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
    ...locales.map((locale) => ({
      url: `${siteUrl}${localizedPath(locale, "/english-reading-practice")}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: locale === "en" ? 0.8 : 0.7
    })),
    ...contentPaths.flatMap((path) =>
      locales.map((locale) => ({
        url: `${siteUrl}${localizedPath(locale, path)}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: path.startsWith("/legal/") ? 0.3 : 0.55
      }))
    ),
    ...blogPaths,
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
