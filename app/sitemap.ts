import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE = "https://stockflowapp.fun";
const ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/app/", priority: 0.9 },
  { path: "/app/psm/", priority: 0.8 },
  { path: "/app/borrow/", priority: 0.8 },
  { path: "/app/vaults/", priority: 0.8 },
  { path: "/app/sf/", priority: 0.7 },
  { path: "/app/stats/", priority: 0.7 },
  { path: "/app/risk/", priority: 0.7 },
  { path: "/app/season/", priority: 0.6 },
  { path: "/docs/", priority: 0.8 },
  { path: "/roadmap/", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
}
