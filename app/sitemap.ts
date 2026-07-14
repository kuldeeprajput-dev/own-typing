import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/app/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
