import type { MetadataRoute } from "next";
import { getPublicBlogPosts } from "@/lib/blog";
import { localizedPath, locales, localeUrl, type Locale } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/seo/metadata";

// 有搜索意图、值得被收录的白名单路径
const LIST_PATHS = [
  "",                           // 首页
  "/pricing",
  "/english-reading-practice",
  "/learn/conversation-topics",
  "/learn/learning-tips",
  "/learn/practice-guide",
  "/learn/blog",
  "/practice/talk",
  "/practice/get-help",
  "/practice/pronunciation",
  "/practice/vocabulary",
  "/learn/ielts-speaking",
  "/learn/english-job-interview",
  "/learn/english-travel-conversation",
] as const;

// 仅英文版、无本地化版本的路径
const EN_ONLY = new Set([
  "/learn/ielts-speaking",
  "/learn/english-job-interview",
  "/learn/english-travel-conversation",
]);

function entryUrl(locale: Locale | "", path: string): string {
  // 与 metadata canonical 保持一致：本地化首页无尾斜杠
  if (path === "") return locale ? localeUrl(siteUrl, locale) : `${siteUrl}/`;
  return `${siteUrl}${locale ? localizedPath(locale, path) : path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];

  // 白名单列表页
  for (const path of LIST_PATHS) {
    const enOnly = EN_ONLY.has(path);
    const targetLocales: readonly (Locale | "")[] = enOnly ? [""] : ["", ...locales.filter((l) => l !== "en")];

    for (const locale of targetLocales) {
      out.push({
        url: entryUrl(locale, path),
        lastModified: now,
      });
    }
  }

  // 博客文章 —— 先保留英文版详情页(T02 再处理翻译状态与本地化 hreflang)
  const blog = await getPublicBlogPosts("en");
  const posts = blog?.posts ?? [];
  for (const post of posts) {
    out.push({
      url: `${siteUrl}/learn/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || now,
    });
  }

  return out;
}
