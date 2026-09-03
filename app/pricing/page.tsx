import type { Metadata } from "next";
import { PricingPage } from "@/components/app/PricingPage";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createLocalizedPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createLocalizedPageMetadata("en", "/pricing", "Pricing | AI Language Tutor", "Try your first AI language conversation for free, then choose Pro monthly or save with Pro Annual.");

export default function Page() {
  return <PricingPage dictionary={getDictionary("en")} locale="en" />;
}
