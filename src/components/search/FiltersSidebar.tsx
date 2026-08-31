"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/utils";
import { TRANSMISSION_LABEL, FUEL_LABEL, BODY_TYPE_LABEL } from "@/lib/constants";

type Facets = {
  brands: string[];
  models: string[];
  colors: string[];
  yearRange: [number, number];
  priceRange: [number, number];
};

export function FiltersSidebar({ facets, className }: { facets: Facets; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const brand = searchParams.get("brand") ?? "";
  const model = searchParams.get("model") ?? "";
  const yearMin = searchParams.get("yearMin") ?? "";
  const yearMax = searchParams.get("yearMax") ?? "";
  const priceMin = searchParams.get("priceMin") ?? "";
  const priceMax = searchParams.get("priceMax") ?? "";
  const kmMax = searchParams.get("kmMax") ?? "";
  const transmission = searchParams.get("transmission") ?? "";
  const color = searchParams.get("color") ?? "";
  const fuel = searchParams.get("fuel") ?? "";
  const bodyType = searchParams.get("bodyType") ?? "";
  const condition = searchParams.get("condition") ?? "";

  const content = (
    <div className="flex flex-col gap-6">
      <FilterGroup label="Marca">
        <select value={brand} onChange={(e) => update("brand", e.target.value || null)} className="filter-select">
          <option value="">Todas as marcas</option>
          {facets.brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Modelo">
        <select value={model} onChange={(e) => update("model", e.target.value || null)} className="filter-select">
          <option value="">Todos os modelos</option>
          {facets.models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Tipo de veículo">
        <select value={bodyType} onChange={(e) => update("bodyType", e.target.value || null)} className="filter-select">
          <option value="">Todos os tipos</option>
          {Object.entries(BODY_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Condição">
        <div className="flex gap-2">
          {[
            { value: "", label: "Todas" },
            { value: "ZERO_KM", label: "0km" },
            { value: "SEMINOVO", label: "Seminovo" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update("condition", opt.value || null)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                condition === opt.value
                  ? "border-primary-500 bg-primary-50 text-primary-600"
                  : "border-surface-border text-ink-600 hover:border-ink-900/30",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Ano">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={String(facets.yearRange[0])}
            value={yearMin}
            onChange={(e) => update("yearMin", e.target.value || null)}
            className="filter-input"
          />
          <span className="text-ink-400">–</span>
          <input
            type="number"
            placeholder={String(facets.yearRange[1])}
            value={yearMax}
            onChange={(e) => update("yearMax", e.target.value || null)}
            className="filter-input"
          />
        </div>
      </FilterGroup>

      <FilterGroup label={`Preço (até ${formatBRL(Number(priceMax) || facets.priceRange[1])})`}>
        <input
          type="range"
          min={facets.priceRange[0]}
          max={facets.priceRange[1]}
          step={5000}
          value={priceMax || facets.priceRange[1]}
          onChange={(e) => update("priceMax", e.target.value)}
          className="w-full accent-primary-500"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mínimo"
            value={priceMin}
            onChange={(e) => update("priceMin", e.target.value || null)}
            className="filter-input"
          />
          <span className="text-ink-400">–</span>
          <input
            type="number"
            placeholder="Máximo"
            value={priceMax}
            onChange={(e) => update("priceMax", e.target.value || null)}
            className="filter-input"
          />
        </div>
      </FilterGroup>

      <FilterGroup label="KM máxima">
        <input
          type="number"
          placeholder="Ex: 50000"
          value={kmMax}
          onChange={(e) => update("kmMax", e.target.value || null)}
          className="filter-input w-full"
        />
      </FilterGroup>

      <FilterGroup label="Câmbio">
        <select value={transmission} onChange={(e) => update("transmission", e.target.value || null)} className="filter-select">
          <option value="">Todos</option>
          {Object.entries(TRANSMISSION_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Combustível">
        <select value={fuel} onChange={(e) => update("fuel", e.target.value || null)} className="filter-select">
          <option value="">Todos</option>
          {Object.entries(FUEL_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Cor">
        <select value={color} onChange={(e) => update("color", e.target.value || null)} className="filter-select">
          <option value="">Todas</option>
          {facets.colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FilterGroup>

      <button
        type="button"
        onClick={() => router.push(pathname)}
        className="rounded-lg border border-ink-900/15 py-2.5 text-sm font-semibold text-ink-600 transition-colors hover:border-primary-500 hover:text-primary-600"
      >
        Limpar filtros
      </button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-lg border border-surface-border px-4 py-2.5 text-sm font-semibold text-ink-900 lg:hidden"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 5h14M6 10h8M8 15h4" strokeLinecap="round" />
        </svg>
        Filtros
      </button>

      <aside className={cn("hidden lg:block", className)}>{content}</aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm overflow-y-auto bg-white p-5 shadow-cardHover">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">Filtros</h2>
              <button onClick={() => setOpen(false)} aria-label="Fechar filtros" className="text-ink-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            {content}
          </div>
        </div>
      ) : null}
    </>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-tight text-ink-400">{label}</span>
      {children}
    </div>
  );
}
