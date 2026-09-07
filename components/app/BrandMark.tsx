import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { homeUiCopy } from "@/lib/i18n/home-ui-copy";

export function BrandMark({ href = "/", locale = "en" }: { href?: string; locale?: Locale }) {
  return (
    <Link className="app-brand" href={href} aria-label={homeUiCopy[locale].brandHome}>
      <Image src="/arno.svg" width={42} height={42} alt="" priority />
      <span>
        <strong>AI Language Tutor</strong>
      </span>
    </Link>
  );
}
