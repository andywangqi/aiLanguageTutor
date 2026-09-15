import type { Metadata } from "next";
import { HomePage } from "@/components/landing/HomePage";
import { JsonLd } from "@/components/landing/JsonLd";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createFaqSchema, createOrganizationSchema, createPageMetadata, createSoftwareSchema, createWebsiteSchema } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata("en");

export default function Page() {
  const dictionary = getDictionary("en");

  return (
    <>
      <JsonLd data={createSoftwareSchema("en")} />
      <JsonLd data={createFaqSchema("en")} />
      <JsonLd data={createOrganizationSchema()} />
      <JsonLd data={createWebsiteSchema()} />
      <HomePage dictionary={dictionary} locale="en" />
    </>
  );
}
