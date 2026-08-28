import type { Locale } from "./config";

export type InfoSectionCopy = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type InfoCardCopy = {
  label: string;
  title: string;
  body: string;
  email: string;
};

export type InfoCopy = {
  locale: Locale;
  shell: {
    back: string;
    updatedLabel: string;
    footerBrand: string;
    policyNavigation: string;
    navigation: { contact: string; privacy: string; terms: string };
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    updated: string;
    chooseTitle: string;
    cards: InfoCardCopy[];
    supportTitle: string;
    supportLead: string;
    supportBullets: string[];
    calloutTitle: string;
    calloutBody: string;
    privacyNote: string;
    privacyLink: string;
  };
  privacy: {
    eyebrow: string;
    title: string;
    lead: string;
    updated: string;
    sections: InfoSectionCopy[];
  };
  terms: {
    eyebrow: string;
    title: string;
    lead: string;
    updated: string;
    sections: InfoSectionCopy[];
  };
};
