import type { Metadata } from "next";
import { HomePage } from "@/components/landing/HomePage";
import { JsonLd } from "@/components/landing/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createFaqSchema, createPageMetadata, createSoftwareSchema } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata("en");

export default function Page() {
  const dictionary = getDictionary("en");

  return (
    <>
      <JsonLd data={createSoftwareSchema("en")} />
      <JsonLd data={createFaqSchema("en")} />
      <HomePage dictionary={dictionary} locale="en" />
    </>
  );
}
