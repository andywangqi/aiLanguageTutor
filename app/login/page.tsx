import type { Metadata } from "next";
import { LoginPage } from "@/components/app/LoginPage";
import { HomePage } from "@/components/landing/HomePage";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: "Sign in | AI Language Tutor",
  description: "Sign in to continue your AI-guided speaking practice.",
  robots: { index: false, follow: false }
};

export default function Page() {
  return (
    <>
      <HomePage dictionary={getDictionary("en")} locale="en" />
      <LoginPage dictionary={getDictionary("en")} locale="en" />
    </>
  );
}
