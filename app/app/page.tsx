import type { Metadata } from "next";
import { WorkbenchPage } from "@/components/app/WorkbenchPage";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Workbench | AI Language Tutor",
  description: "Practice real conversations with your AI language tutor.",
  robots: { index: false, follow: false }
};

export default function Page() {
  return <WorkbenchPage dictionary={getDictionary("en")} locale="en" />;
}
