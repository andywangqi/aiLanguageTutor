import Link from "next/link";
import { ArrowLeft, BookOpen, Clock3, UserRound } from "lucide-react";
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
  if (type === "image" && typeof block.url === "string") return <figure key={index}><img src={block.url} alt={typeof block.alt === "string" ? block.alt : ""} /><figcaption>{typeof block.alt === "string" ? block.alt : ""}</figcaption></figure>;
  if (type === "list" && Array.isArray(block.items)) return <ul key={index}>{block.items.filter((item): item is string => typeof item === "string").map((item) => <li key={item}>{item}</li>)}</ul>;
  return <p key={index}>{text}</p>;
}

export function BlogArticlePage({ locale, copy, post }: { locale: Locale; copy: ContentPageCopy; post: BlogPost }) {
  const blocks = post.contentBlocks?.length ? post.contentBlocks : [{ type: "paragraph", text: post.contentMarkdown || post.excerpt || "" }];
  const published = publishedLabel(post.publishedAt, locale);
  const layout = post.layout;
  const ui = blogUi[locale];
  return (
    <InfoPage locale={locale} eyebrow={copy.eyebrow} title={post.title} lead={post.excerpt || copy.lead} updated={published || copy.updated}>
      <article className="blog-article" style={layoutStyle(layout)}>
        <div className="blog-article-meta">
          {post.authorName ? <span><UserRound size={15} aria-hidden="true" /> {post.authorName}</span> : null}
          {post.readingTimeMinutes ? <span><Clock3 size={15} aria-hidden="true" /> {post.readingTimeMinutes} {ui.minutes}</span> : null}
          <Link href={localizedPath(locale, "/learn/blog")}><ArrowLeft size={15} aria-hidden="true" /> {copy.title}</Link>
        </div>
        {post.coverImageUrl ? <img className="blog-article-cover" src={post.coverImageUrl} alt="" /> : null}
        <div className="blog-article-content">
          {blocks.map((block, index) => renderBlock(block, index))}
        </div>
      </article>
    </InfoPage>
  );
}
