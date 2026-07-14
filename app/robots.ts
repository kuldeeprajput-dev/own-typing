import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/app/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: siteConfig.url.origin,
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
