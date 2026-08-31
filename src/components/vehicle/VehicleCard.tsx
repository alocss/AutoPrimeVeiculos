"use client";

import Image from "next/image";
import Link from "next/link";
import type { Vehicle, VehiclePhoto } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { BODY_TYPE_LABEL, CONDITION_LABEL, TRANSMISSION_LABEL } from "@/lib/constants";
import { formatBRL, formatKm, vehicleTitle } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites-store";
import { useCompare } from "@/lib/compare-store";
import { cn } from "@/lib/utils";

type Props = {
  vehicle: Vehicle & { photos: VehiclePhoto[] };
  showCompare?: boolean;
};

export function VehicleCard({ vehicle, showCompare = true }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const { isComparing, toggle: toggleCompare } = useCompare();
  const favorite = isFavorite(vehicle.id);
  const comparing = isComparing(vehicle.id);
  const cover = vehicle.photos[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-card border border-surface-border bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover">
      <Link href={`/veiculos/${vehicle.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-surface-muted">
        {cover ? (
          <Image
            src={cover.url}
            alt={`${vehicleTitle(vehicle)} — foto principal`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {vehicle.badge !== "NONE" ? (
            <Badge tone={vehicle.badge === "NOVO" ? "success" : "primary"}>
              {vehicle.badge === "NOVO" ? "Novo no estoque" : "Destaque"}
            </Badge>
          ) : null}
          <Badge tone="outline">{CONDITION_LABEL[vehicle.condition]}</Badge>
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggle(vehicle.id);
        }}
        aria-pressed={favorite}
        aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink-900 shadow-card transition-transform hover:scale-110 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          className={cn("h-[18px] w-[18px] transition-colors", favorite ? "fill-primary-500 stroke-primary-500" : "fill-none stroke-ink-900")}
          strokeWidth="1.8"
        >
          <path d="M12 20s-7.5-4.6-10-9.3C.4 7.4 2 4 5.4 4c2 0 3.4 1 4.6 2.6C11.2 5 12.6 4 14.6 4 18 4 19.6 7.4 22 10.7 19.5 15.4 12 20 12 20z" />
        </svg>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/veiculos/${vehicle.slug}`} className="flex-1">
          <h3 className="text-[15px] font-semibold leading-snug text-ink-900 line-clamp-2">
            {vehicleTitle(vehicle)}
          </h3>
          <p className="mt-1 text-sm text-ink-600">{BODY_TYPE_LABEL[vehicle.bodyType]}</p>

          <dl className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-ink-600">
            <div className="flex items-center gap-1">
              <dt className="sr-only">Ano</dt>
              <dd className="tabular-nums">{vehicle.year}</dd>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1">
              <dt className="sr-only">Quilometragem</dt>
              <dd className="tabular-nums">{formatKm(vehicle.km)}</dd>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1">
              <dt className="sr-only">Câmbio</dt>
              <dd>{TRANSMISSION_LABEL[vehicle.transmission]}</dd>
            </div>
          </dl>
        </Link>

        <div className="mt-4 flex items-end justify-between gap-2">
          <p className="text-lg font-bold tabular-nums text-primary-600">{formatBRL(vehicle.price)}</p>
          <Link
            href={`/veiculos/${vehicle.slug}`}
            className="rounded-lg border border-ink-900/15 px-3 py-2 text-[13px] font-semibold text-ink-900 transition-colors hover:border-primary-500 hover:text-primary-600"
          >
            Ver detalhes
          </Link>
        </div>

        {showCompare ? (
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-[13px] text-ink-600">
            <input
              type="checkbox"
              checked={comparing}
              onChange={() => toggleCompare(vehicle.id)}
              className="h-4 w-4 rounded border-ink-900/25 text-primary-500 focus:ring-primary-500"
            />
            Comparar
          </label>
        ) : null}
      </div>
    </div>
  );
}
