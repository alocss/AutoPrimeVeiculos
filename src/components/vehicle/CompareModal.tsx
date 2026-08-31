"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Vehicle, VehiclePhoto } from "@prisma/client";
import {
  BODY_TYPE_LABEL,
  CONDITION_LABEL,
  TRANSMISSION_LABEL,
  FUEL_LABEL,
} from "@/lib/constants";
import { formatBRL, formatKm, vehicleTitle } from "@/lib/utils";
import { removeFromCompare } from "@/lib/compare-store";

type VehicleWithPhotos = Vehicle & { photos: VehiclePhoto[] };

const ROWS: { label: string; get: (v: VehicleWithPhotos) => string }[] = [
  { label: "Preço", get: (v) => formatBRL(v.price) },
  { label: "Ano/Modelo", get: (v) => `${v.year}/${v.modelYear}` },
  { label: "Quilometragem", get: (v) => formatKm(v.km) },
  { label: "Condição", get: (v) => CONDITION_LABEL[v.condition] },
  { label: "Tipo", get: (v) => BODY_TYPE_LABEL[v.bodyType] },
  { label: "Câmbio", get: (v) => TRANSMISSION_LABEL[v.transmission] },
  { label: "Combustível", get: (v) => FUEL_LABEL[v.fuel] },
  { label: "Cor", get: (v) => v.color },
  { label: "Portas", get: (v) => String(v.doors) },
  { label: "Opcionais", get: (v) => String(v.optionals.length) },
];

export function CompareModal({ vehicles, onClose }: { vehicles: VehicleWithPhotos[]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Comparar veículos">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-cardHover sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
          <h2 className="text-lg font-bold text-ink-900">Comparar veículos</h2>
          <button onClick={onClose} aria-label="Fechar comparação" className="text-ink-600 hover:text-ink-900">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-32 bg-white p-3 text-left text-xs font-semibold uppercase text-ink-400" />
                {vehicles.map((v) => (
                  <th key={v.id} className="min-w-[200px] p-3 text-left align-top">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-surface-muted">
                      {v.photos[0] ? (
                        <Image src={v.photos[0].url} alt={vehicleTitle(v)} fill sizes="220px" className="object-cover" />
                      ) : null}
                    </div>
                    <p className="mt-2 font-semibold text-ink-900">{vehicleTitle(v)}</p>
                    <button
                      onClick={() => removeFromCompare(v.id)}
                      className="mt-1 text-xs font-medium text-primary-600 hover:underline"
                    >
                      Remover
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "" : "bg-surface-muted"}>
                  <th className="sticky left-0 z-10 bg-inherit p-3 text-left text-xs font-semibold uppercase text-ink-400">
                    {row.label}
                  </th>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3 tabular-nums text-ink-900">
                      {row.get(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
