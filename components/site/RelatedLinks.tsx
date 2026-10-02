import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import { relatedCopy, relatedLinksMap } from "@/lib/seo/related-links";

// T05: 内容页底部"继续练习"互链模块。
// currentPath 为当前页路径(如 "/practice/talk"),从 relatedLinksMap 取 3 条出链。
export function RelatedLinks({ locale, currentPath }: { locale: Locale; currentPath: string }) {
  const targets = relatedLinksMap[currentPath] ?? [];
  const copy = relatedCopy[locale];
  const items = targets
    .map((href) => ({ href, ...(copy.items[href] ?? { label: href, description: "" }) }))
    .filter((item) => item.label);

  if (!items.length) return null;

  return (
    <nav className="info-related" aria-label={copy.heading}>
      <h2>{copy.heading}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={localizedPath(locale, item.href)}>
              <strong>{item.label}</strong>
              {item.description ? <span>{item.description}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
