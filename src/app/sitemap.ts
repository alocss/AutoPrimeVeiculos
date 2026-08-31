import type { MetadataRoute } from "next";
import { getAllVehicleSlugs } from "@/lib/vehicles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// No live database at `docker build` time by design (see Dockerfile / README) — this
// route renders on request instead of being frozen into the build output.
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "",
  "/estoque",
  "/financiamento",
  "/venda-seu-veiculo",
  "/sobre-nos",
  "/contato",
  "/favoritos",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await getAllVehicleSlugs();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const vehicleEntries: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${siteUrl}/veiculos/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...vehicleEntries];
}
