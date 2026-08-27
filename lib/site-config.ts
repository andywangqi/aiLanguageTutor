const defaultCentralEndpoint = "https://zhyadmin.vercel.app";
const defaultSiteUrl = "https://www.ailanguagetutor.com";

function removeTrailingSlashes(value: string) {
  return value.replace(/\/+$/, "");
}

export function getCentralEndpoint() {
  return removeTrailingSlashes(process.env.NEXT_PUBLIC_ZHYADMIN_ENDPOINT?.trim() || defaultCentralEndpoint);
}

export function getProductSiteUrl() {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!candidate) return defaultSiteUrl;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return defaultSiteUrl;
    return removeTrailingSlashes(candidate);
  } catch {
    return defaultSiteUrl;
  }
}

