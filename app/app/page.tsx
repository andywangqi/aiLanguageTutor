import type { Metadata } from "next";
import { WorkbenchPage } from "@/components/app/WorkbenchPage";

export const metadata: Metadata = {
  title: "Workbench | AI Language Tutor",
  description: "Practice real conversations with your AI language tutor."
};

export default function Page() {
  return <WorkbenchPage />;
}
