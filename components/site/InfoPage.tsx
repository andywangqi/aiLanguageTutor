import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { BrandMark } from "@/components/app/BrandMark";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  updated?: string;
  children: ReactNode;
};

export function InfoPage({ eyebrow, title, lead, updated = "August 24, 2026", children }: InfoPageProps) {
  return (
    <div className="info-page">
      <header className="info-header">
        <div className="container info-header-inner">
          <BrandMark />
          <Link className="info-home-link" href="/">
            <ArrowLeft aria-hidden="true" size={16} />
            Back to AI Language Tutor
          </Link>
        </div>
      </header>

      <main className="info-main">
        <div className="container info-layout">
          <header className="info-intro">
            <p className="info-eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="info-lead">{lead}</p>
            <p className="info-updated">Last updated: {updated}</p>
          </header>

          <article className="info-article">{children}</article>
        </div>
      </main>

      <footer className="info-footer">
        <div className="container info-footer-inner">
          <span>AI Language Tutor by Arno</span>
          <nav aria-label="Policy navigation">
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
