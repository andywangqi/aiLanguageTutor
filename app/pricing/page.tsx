import type { Metadata } from "next";
import { PricingPage } from "@/components/app/PricingPage";

export const metadata: Metadata = {
  title: "Pricing | AI Language Tutor",
  description: "Try your first AI language conversation for free, then choose Pro monthly or save with Pro Annual."
};

export default function Page() {
  return <PricingPage />;
}
