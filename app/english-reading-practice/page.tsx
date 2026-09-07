import type { Metadata } from "next";
import { JsonLd } from "@/components/landing/JsonLd";
import { EnglishReadingPractice } from "@/components/site/EnglishReadingPractice";
import { createReadingPageMetadata, createReadingSchema } from "@/lib/seo/reading-metadata";

export const metadata: Metadata = createReadingPageMetadata("en");

export default function Page() {
  return <><JsonLd data={createReadingSchema("en")} /><EnglishReadingPractice locale="en" /></>;
}
