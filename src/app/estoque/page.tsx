import type { Metadata } from "next";
import { getVehicles, getFilterFacets } from "@/lib/vehicles";
import { FiltersSidebar } from "@/components/search/FiltersSidebar";
import { EstoqueClient } from "@/app/estoque/EstoqueClient";
import type { VehicleFilters } from "@/types/vehicle";

export const metadata: Metadata = {
  title: "Estoque de veículos 0km e seminovos",
  description: "Filtre por marca, modelo, ano, preço, KM e câmbio para encontrar o veículo ideal.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toFilters(searchParams: SearchParams): VehicleFilters {
  const get = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };
  return {
    q: get("q"),
    brand: get("brand"),
    model: get("model"),
    yearMin: get("yearMin") ? Number(get("yearMin")) : undefined,
    yearMax: get("yearMax") ? Number(get("yearMax")) : undefined,
    priceMin: get("priceMin") ? Number(get("priceMin")) : undefined,
    priceMax: get("priceMax") ? Number(get("priceMax")) : undefined,
    kmMax: get("kmMax") ? Number(get("kmMax")) : undefined,
    transmission: get("transmission"),
    color: get("color"),
    fuel: get("fuel"),
    bodyType: get("bodyType"),
    condition: get("condition"),
    sort: get("sort") as VehicleFilters["sort"],
    page: get("page") ? Number(get("page")) : 1,
  };
}

export default async function EstoquePage({ searchParams }: { searchParams: SearchParams }) {
  const filters = toFilters(searchParams);
  const [{ items, total, page, totalPages }, facets] = await Promise.all([
    getVehicles(filters),
    getFilterFacets(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tighter text-ink-900">Estoque</h1>
        <p className="mt-2 text-ink-600">Veículos 0km e seminovos revisados, prontos para transferência.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <FiltersSidebar facets={facets} />
        <EstoqueClient vehicles={items} total={total} page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
