"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/utils";
import { BODY_TYPE_LABEL, TRANSMISSION_LABEL, FUEL_LABEL, CONDITION_LABEL } from "@/lib/constants";

const SORT_OPTIONS = [
  { value: "relevance", label: "Mais relevante" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "newest", label: "Mais novo no estoque" },
];

const LABEL_MAPS: Record<string, Record<string, string>> = {
  bodyType: BODY_TYPE_LABEL,
  transmission: TRANSMISSION_LABEL,
  fuel: FUEL_LABEL,
  condition: CONDITION_LABEL,
};

const FILTER_KEYS = [
  "brand",
  "model",
  "bodyType",
  "condition",
  "yearMin",
  "yearMax",
  "priceMin",
  "priceMax",
  "kmMax",
  "transmission",
  "color",
  "fuel",
];

function labelFor(key: string, value: string): string {
  if (key === "priceMin") return `A partir de ${formatBRL(Number(value))}`;
  if (key === "priceMax") return `Até ${formatBRL(Number(value))}`;
  if (key === "yearMin") return `A partir de ${value}`;
  if (key === "yearMax") return `Até ${value}`;
  if (key === "kmMax") return `Até ${Number(value).toLocaleString("pt-BR")} km`;
  return LABEL_MAPS[key]?.[value] ?? value;
}

export function EstoqueToolbar({
  total,
  view,
  onViewChange,
}: {
  total: number;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "relevance";

  const activeFilters = FILTER_KEYS.map((key) => {
    const value = searchParams.get(key);
    return value ? { key, value, label: labelFor(key, value) } : null;
  }).filter((v): v is { key: string; value: string; label: string } => Boolean(v));

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-600">
          <span className="font-semibold text-ink-900">{total}</span>{" "}
          {total === 1 ? "veículo encontrado" : "veículos encontrados"}
        </p>

        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink-900 focus:border-primary-500"
            aria-label="Ordenar por"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-surface-border p-0.5">
            <button
              type="button"
              onClick={() => onViewChange("grid")}
              aria-label="Ver em grade"
              aria-pressed={view === "grid"}
              className={cn("rounded-md p-2", view === "grid" ? "bg-ink-900 text-white" : "text-ink-600")}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <rect x="2" y="2" width="7" height="7" rx="1" />
                <rect x="11" y="2" width="7" height="7" rx="1" />
                <rect x="2" y="11" width="7" height="7" rx="1" />
                <rect x="11" y="11" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onViewChange("list")}
              aria-label="Ver em lista"
              aria-pressed={view === "list"}
              className={cn("rounded-md p-2", view === "list" ? "bg-ink-900 text-white" : "text-ink-600")}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <rect x="2" y="3" width="16" height="3" rx="1" />
                <rect x="2" y="8.5" width="16" height="3" rx="1" />
                <rect x="2" y="14" width="16" height="3" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {activeFilters.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => removeFilter(f.key)}
              className="flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:border-primary-400"
            >
              {f.label}
              <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
