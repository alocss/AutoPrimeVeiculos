"use client";

import Image from "next/image";
import Link from "next/link";
import type { Vehicle, VehiclePhoto } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { BODY_TYPE_LABEL, CONDITION_LABEL, TRANSMISSION_LABEL, FUEL_LABEL } from "@/lib/constants";
import { formatBRL, formatKm, vehicleTitle, cn } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites-store";

export function VehicleListRow({ vehicle }: { vehicle: Vehicle & { photos: VehiclePhoto[] } }) {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(vehicle.id);
  const cover = vehicle.photos[0];

  return (
    <Link
      href={`/veiculos/${vehicle.slug}`}
      className="group flex flex-col gap-4 rounded-card border border-surface-border bg-white p-3 shadow-card transition-all hover:shadow-cardHover sm:flex-row sm:items-center sm:p-4"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-surface-muted sm:w-56">
        {cover ? (
          <Image
            src={cover.url}
            alt={`${vehicleTitle(vehicle)} — foto principal`}
            fill
            sizes="224px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        {vehicle.badge !== "NONE" ? (
          <div className="absolute left-2 top-2">
            <Badge tone={vehicle.badge === "NOVO" ? "success" : "primary"}>
              {vehicle.badge === "NOVO" ? "Novo" : "Destaque"}
            </Badge>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-ink-900">{vehicleTitle(vehicle)}</h3>
            <p className="text-sm text-ink-600">
              {BODY_TYPE_LABEL[vehicle.bodyType]} · {CONDITION_LABEL[vehicle.condition]}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggle(vehicle.id);
            }}
            aria-pressed={favorite}
            aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-900 transition-transform hover:scale-110"
          >
            <svg
              viewBox="0 0 24 24"
              className={cn("h-[18px] w-[18px]", favorite ? "fill-primary-500 stroke-primary-500" : "fill-none stroke-ink-900")}
              strokeWidth="1.8"
            >
              <path d="M12 20s-7.5-4.6-10-9.3C.4 7.4 2 4 5.4 4c2 0 3.4 1 4.6 2.6C11.2 5 12.6 4 14.6 4 18 4 19.6 7.4 22 10.7 19.5 15.4 12 20 12 20z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-ink-600">
          <span className="tabular-nums">{vehicle.year}</span>
          <span className="tabular-nums">{formatKm(vehicle.km)}</span>
          <span>{TRANSMISSION_LABEL[vehicle.transmission]}</span>
          <span>{FUEL_LABEL[vehicle.fuel]}</span>
          <span>{vehicle.color}</span>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-xl font-bold tabular-nums text-primary-600">{formatBRL(vehicle.price)}</p>
          <span className="hidden rounded-lg border border-ink-900/15 px-3 py-2 text-sm font-semibold text-ink-900 sm:inline-block">
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  );
}
