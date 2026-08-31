"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRANDS } from "@/lib/constants";

const YEAR_RANGES = [
  { label: "Qualquer ano", value: "" },
  { label: "2024 em diante", value: "2024-2026" },
  { label: "2021 – 2023", value: "2021-2023" },
  { label: "2018 – 2020", value: "2018-2020" },
  { label: "Até 2017", value: "1990-2017" },
];

const PRICE_RANGES = [
  { label: "Qualquer preço", value: "" },
  { label: "Até R$ 80.000", value: "0-80000" },
  { label: "R$ 80.000 – R$ 150.000", value: "80000-150000" },
  { label: "R$ 150.000 – R$ 250.000", value: "150000-250000" },
  { label: "Acima de R$ 250.000", value: "250000-999999" },
];

export function SearchBar({
  variant = "hero",
  models = [],
}: {
  variant?: "hero" | "compact";
  models?: string[];
}) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [yearRange, setYearRange] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [condition, setCondition] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (model) params.set("q", model);
    if (condition) params.set("condition", condition);
    if (yearRange) {
      const [min, max] = yearRange.split("-");
      params.set("yearMin", min);
      params.set("yearMax", max);
    }
    if (priceRange) {
      const [min, max] = priceRange.split("-");
      params.set("priceMin", min);
      params.set("priceMax", max);
    }
    router.push(`/estoque?${params.toString()}`);
  }

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSubmit}
      className={
        isHero
          ? "grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-cardHover sm:grid-cols-2 lg:grid-cols-6 lg:gap-2 lg:p-3"
          : "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
      }
    >
      <label className="flex flex-col gap-1 lg:col-span-1">
        <span className="text-xs font-medium text-ink-600">Marca</span>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-primary-500"
        >
          <option value="">Todas</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 lg:col-span-1">
        <span className="text-xs font-medium text-ink-600">Modelo</span>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Ex: Corolla"
          list="search-model-options"
          autoComplete="off"
          className="rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-primary-500"
        />
        <datalist id="search-model-options">
          {models.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </label>

      <label className="flex flex-col gap-1 lg:col-span-1">
        <span className="text-xs font-medium text-ink-600">Ano</span>
        <select
          value={yearRange}
          onChange={(e) => setYearRange(e.target.value)}
          className="rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-primary-500"
        >
          {YEAR_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 lg:col-span-1">
        <span className="text-xs font-medium text-ink-600">Faixa de preço</span>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-primary-500"
        >
          {PRICE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 lg:col-span-1">
        <span className="text-xs font-medium text-ink-600">Tipo</span>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-primary-500"
        >
          <option value="">0km ou Seminovo</option>
          <option value="ZERO_KM">0km</option>
          <option value="SEMINOVO">Seminovo</option>
        </select>
      </label>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 lg:col-span-1"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="9" r="6" />
          <path d="M17 17l-3.5-3.5" strokeLinecap="round" />
        </svg>
        Buscar
      </button>
    </form>
  );
}
