import type { Metadata } from "next";
import { LoginPage } from "@/components/app/LoginPage";

export const metadata: Metadata = {
  title: "Sign in | AI Language Tutor",
  description: "Sign in to continue your AI-guided speaking practice."
};

export default function Page() {
  return <LoginPage />;
}
