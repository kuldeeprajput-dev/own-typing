const LOCAL_SITE_URL = "http://localhost:3000";

function resolveSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelHost = (
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  )?.trim();
  const configuredUrl = explicitUrl || (vercelHost ? `https://${vercelHost}` : "");

  if (!configuredUrl) {
    return new URL(LOCAL_SITE_URL);
  }

  try {
    const url = new URL(configuredUrl);

    if (url.protocol === "http:" || url.protocol === "https:") {
      return url;
    }
  } catch {
    // Fall through to the local URL when the environment value is malformed.
  }

  return new URL(LOCAL_SITE_URL);
}

export const siteConfig = {
  name: "OwnType",
  title: "OwnType — Free Online Typing Test",
  description:
    "Take a free online typing test, measure your words per minute and accuracy, and build speed with focused 15, 30, or 60 second practice sessions.",
  creator: "OwnType",
  locale: "en_US",
  url: resolveSiteUrl(),
  keywords: [
    "typing test",
    "typing speed test",
    "words per minute",
    "WPM test",
    "typing practice",
    "typing accuracy",
    "free typing test",
  ],
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
