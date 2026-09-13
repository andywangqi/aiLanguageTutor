"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { InfoPage } from "@/components/site/InfoPage";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { BlogLayout, BlogListResponse, BlogPost, BlogPostSummary } from "@/lib/api/types";
import type { ContentPageCopy } from "@/lib/content-pages";

function publishedLabel(value: string | null | undefined, locale: Locale) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString(locale);
}

function layoutStyle(layout: BlogLayout | undefined) {
  return layout?.accentColor ? { "--blog-accent": layout.accentColor } as CSSProperties : undefined;
}

const blogUi: Record<Locale, { featured: string; minutes: string; emptyTitle: string; emptyBody: string }> = {
  en: { featured: "Featured", minutes: "min read", emptyTitle: "No published posts yet", emptyBody: "The latest learning articles will appear here once they are published." },
  ja: { featured: "おすすめ", minutes: "分で読めます", emptyTitle: "公開記事はまだありません", emptyBody: "記事が公開されると、ここに表示されます。" },
  th: { featured: "แนะนำ", minutes: "นาทีในการอ่าน", emptyTitle: "ยังไม่มีบทความที่เผยแพร่", emptyBody: "บทความการเรียนรู้จะแสดงที่นี่เมื่อเผยแพร่แล้ว" },
  ko: { featured: "추천", minutes: "분 읽기", emptyTitle: "게시된 글이 아직 없습니다", emptyBody: "학습 글이 게시되면 여기에 표시됩니다." },
  "zh-CN": { featured: "精选", minutes: "分钟阅读", emptyTitle: "暂无已发布文章", emptyBody: "文章发布后会显示在这里。" },
  "zh-TW": { featured: "精選", minutes: "分鐘閱讀", emptyTitle: "目前沒有已發布文章", emptyBody: "文章發布後會顯示在這裡。" },
  es: { featured: "Destacado", minutes: "min de lectura", emptyTitle: "Aún no hay artículos publicados", emptyBody: "Los artículos de aprendizaje aparecerán aquí cuando se publiquen." }
};

function BlogCard({ post, locale, layout }: { post: BlogPostSummary; locale: Locale; layout?: BlogLayout }) {
  const ui = blogUi[locale];
  return (
    <article className={`blog-card blog-card-${layout?.template || "magazine"}`}>
      <Link className="blog-card-cover" href={localizedPath(locale, `/learn/blog/${post.slug}`)} style={{ backgroundImage: post.coverImageUrl ? `url(${post.coverImageUrl})` : undefined }}>
        {!post.coverImageUrl ? <BookOpen size={28} aria-hidden="true" /> : null}
      </Link>
      <div className="blog-card-content">
        <div className="blog-card-meta">
          {post.tags?.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
          {post.featured ? <span>{ui.featured}</span> : null}
        </div>
        <h2><Link href={localizedPath(locale, `/learn/blog/${post.slug}`)}>{post.title}</Link></h2>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
        <div className="blog-card-footer">
          {post.readingTimeMinutes ? <span><Clock3 size={14} aria-hidden="true" /> {post.readingTimeMinutes} {ui.minutes}</span> : null}
          {post.authorName ? <span><UserRound size={14} aria-hidden="true" /> {post.authorName}</span> : null}
        </div>
      </div>
    </article>
  );
}

export function BlogPage({ locale, copy, data }: { locale: Locale; copy: ContentPageCopy; data: BlogListResponse }) {
  const posts = data.posts || [];
  const layout = data.layout;
  const ui = blogUi[locale];
  return (
    <InfoPage locale={locale} eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} updated={copy.updated}>
      <section className="blog-listing" style={layoutStyle(layout)}>
        <div className="blog-listing-heading">
          <div>
            <span className="info-card-label">{data.locale || locale}</span>
            <h2>{posts.length ? copy.title : ui.emptyTitle}</h2>
          </div>
          <span className="blog-listing-count">{posts.length}</span>
        </div>
        {posts.length ? (
          <div className={`blog-card-grid blog-layout-${layout?.template || "magazine"}`}>
            {posts.map((post) => <BlogCard key={post.id || post.slug} post={post} locale={locale} layout={layout} />)}
          </div>
        ) : (
          <p className="blog-empty">{ui.emptyBody}</p>
        )}
      </section>
    </InfoPage>
  );
}

function renderBlock(block: Record<string, unknown>, index: number) {
  const type = typeof block.type === "string" ? block.type : "paragraph";
  const text = typeof block.text === "string" ? block.text : "";
  if (type === "heading") {
    const level = typeof block.level === "number" && block.level <= 2 ? 2 : 3;
    return level === 2 ? <h2 key={index}>{text}</h2> : <h3 key={index}>{text}</h3>;
  }
  if (type === "quote") return <blockquote key={index}>{text}</blockquote>;
  if (type === "callout") return <aside className={`blog-block-callout blog-callout-${typeof block.tone === "string" ? block.tone : "info"}`} key={index}><strong>{typeof block.title === "string" ? block.title : ""}</strong><p>{text}</p></aside>;
  if (type === "card") return <article className="blog-block-card" key={index}><span>{typeof block.eyebrow === "string" ? block.eyebrow : ""}</span><h3>{typeof block.title === "string" ? block.title : ""}</h3><p>{text}</p></article>;
  if (type === "cta") return <aside className="blog-block-cta" key={index}><div><strong>{typeof block.title === "string" ? block.title : text}</strong>{typeof block.body === "string" ? <p>{block.body}</p> : null}</div>{typeof block.href === "string" ? <Link href={block.href}>{typeof block.label === "string" ? block.label : "Learn more"} <ArrowRight size={15} aria-hidden="true" /></Link> : null}</aside>;
  if (type === "steps" && Array.isArray(block.items)) return <ol className="blog-block-steps" key={index}>{block.items.map((item, itemIndex) => { const value = item && typeof item === "object" ? item as Record<string, unknown> : { text: String(item) }; return <li key={itemIndex}><span>{itemIndex + 1}</span><div><h3>{typeof value.title === "string" ? value.title : `Step ${itemIndex + 1}`}</h3><p>{typeof value.text === "string" ? value.text : ""}</p></div></li>; })}</ol>;
  if (type === "image" && typeof block.url === "string") return <figure key={index}><img src={block.url} alt={typeof block.alt === "string" ? block.alt : ""} /><figcaption>{typeof block.alt === "string" ? block.alt : ""}</figcaption></figure>;
  if (type === "list" && Array.isArray(block.items)) return <ul key={index}>{block.items.filter((item): item is string => typeof item === "string").map((item) => <li key={item}>{item}</li>)}</ul>;
  if (type === "feature_cards" && Array.isArray(block.items)) return <div className="blog-feature-cards" key={index}>{block.items.map((item, itemIndex) => { const value = item && typeof item === "object" ? item as Record<string, unknown> : { title: String(item) }; return <article className="blog-block-card" key={itemIndex}><h3>{typeof value.title === "string" ? value.title : ""}</h3><p>{typeof value.text === "string" ? value.text : typeof value.description === "string" ? value.description : ""}</p></article>; })}</div>;
  if (type === "internal_link" && typeof block.href === "string") return <p className="blog-internal-link" key={index}><Link href={block.href}>{typeof block.text === "string" ? block.text : typeof block.title === "string" ? block.title : block.href} <ArrowRight size={15} aria-hidden="true" /></Link></p>;
  if (type === "divider") return <hr className="blog-divider" key={index} />;
  return <p key={index}>{text}</p>;
}

function blockAnchor(block: Record<string, unknown>, index: number) {
  const explicit = typeof block.anchor === "string" ? block.anchor : "";
  const text = typeof block.text === "string" ? block.text : typeof block.title === "string" ? block.title : "";
  return explicit || `${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section"}-${index}`;
}

function BlogArticleJsonLd({ locale, post }: { locale: Locale; post: BlogPost }) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://ailanguagetutor.online";
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    inLanguage: locale,
    author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}${localizedPath(locale, `/learn/blog/${post.slug}`)}` }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function BlogArticlePage({ locale, copy, post }: { locale: Locale; copy: ContentPageCopy; post: BlogPost }) {
  const blocks = post.contentBlocks?.length ? post.contentBlocks : [{ type: "paragraph", text: post.contentMarkdown || post.excerpt || "" }];
  const published = publishedLabel(post.publishedAt, locale);
  const layout = post.layout;
  const ui = blogUi[locale];
  const generatedToc = blocks.filter((block) => block.type === "heading").map((block, index) => ({ text: typeof block.text === "string" ? block.text : "", level: typeof block.level === "number" ? block.level : 2, anchor: blockAnchor(block, index) }));
  const toc = post.tableOfContents?.length ? post.tableOfContents.map((item, index) => ({ ...item, anchor: item.anchor || blockAnchor({ text: item.text }, index) })) : generatedToc;
  const headingAnchors = toc.filter((item) => item.text).map((item) => item.anchor || "");
  const [tocOpen, setTocOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return (
    <InfoPage showIntro={false} locale={locale} eyebrow={copy.eyebrow} title={post.title} lead={post.excerpt || copy.lead} updated={published || copy.updated}>
      <BlogArticleJsonLd locale={locale} post={post} />
      <div className="blog-reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <nav className="blog-breadcrumbs" aria-label="Breadcrumb"><Link href={localizedPath(locale, "/")}>AI Language Tutor</Link><span>/</span><Link href={localizedPath(locale, "/learn/blog")}>{copy.title}</Link><span>/</span><strong>{post.title}</strong></nav>
      <article className="blog-article" style={layoutStyle(layout)}>
        <header className="blog-article-hero">
          <div className="blog-article-kicker">{post.tags?.slice(0, 2).join(" · ") || copy.eyebrow}</div>
          <h1>{post.title}</h1>
          {post.excerpt ? <p>{post.excerpt}</p> : null}
          <div className="blog-article-byline">{post.authorName ? <span><UserRound size={15} aria-hidden="true" /> {post.authorName}</span> : null}{published ? <span>{published}</span> : null}{post.readingTimeMinutes ? <span><Clock3 size={15} aria-hidden="true" /> {post.readingTimeMinutes} {ui.minutes}</span> : null}</div>
          {post.coverImageUrl ? <img className="blog-article-cover" src={post.coverImageUrl} alt="" /> : null}
        </header>
        <div className="blog-article-layout">
          {toc.length ? <aside className={`blog-article-toc${tocOpen ? " is-open" : ""}`}><button type="button" onClick={() => setTocOpen((value) => !value)} aria-expanded={tocOpen}>On this page <span>⌄</span></button><ol>{toc.map((item, index) => <li key={`${item.anchor || item.text}-${index}`}><a href={`#${item.anchor || blockAnchor({ text: item.text }, index)}`} onClick={() => setTocOpen(false)}>{item.text}</a></li>)}</ol></aside> : null}
          <div className="blog-article-content">
            {blocks.map((block, index) => {
              const rendered = renderBlock(block, index);
              const headingIndex = block.type === "heading" ? blocks.slice(0, index + 1).filter((item) => item.type === "heading").length - 1 : -1;
              return block.type === "heading" ? <div id={headingAnchors[headingIndex] || blockAnchor(block, index)} key={index}>{rendered}</div> : rendered;
            })}
            {post.relatedArticles?.length ? <section className="blog-related" aria-labelledby="blog-related-title"><h2 id="blog-related-title">{locale === "zh-CN" ? "相关文章" : "Related articles"}</h2><div className="blog-related-grid">{post.relatedArticles.map((article) => <BlogCard key={article.id || article.slug} post={article} locale={locale} layout={article.layout || layout} />)}</div></section> : null}
          </div>
        </div>
      </article>
    </InfoPage>
  );
}
