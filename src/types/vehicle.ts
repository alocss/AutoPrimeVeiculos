import type { Vehicle, VehiclePhoto } from "@prisma/client";

export type VehicleWithPhotos = Vehicle & { photos: VehiclePhoto[] };

export type VehicleFilters = {
  q?: string;
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  kmMax?: number;
  transmission?: string;
  color?: string;
  fuel?: string;
  bodyType?: string;
  condition?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "relevance";
  page?: number;
};
