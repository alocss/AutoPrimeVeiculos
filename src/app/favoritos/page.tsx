"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Vehicle, VehiclePhoto } from "@prisma/client";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { VehicleCardSkeleton } from "@/components/vehicle/VehicleCardSkeleton";
import { CompareModal } from "@/components/vehicle/CompareModal";
import { useFavorites } from "@/lib/favorites-store";
import { useCompare } from "@/lib/compare-store";

type VehicleWithPhotos = Vehicle & { photos: VehiclePhoto[] };

export default function FavoritosPage() {
  const { ids: favoriteIds } = useFavorites();
  const { ids: compareIds, clear: clearCompare } = useCompare();
  const [vehicles, setVehicles] = useState<VehicleWithPhotos[] | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  const allIds = Array.from(new Set([...favoriteIds, ...compareIds]));

  useEffect(() => {
    if (allIds.length === 0) {
      setVehicles([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/vehicles?ids=${allIds.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setVehicles(data.vehicles ?? []);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allIds.join(",")]);

  const favoriteVehicles = (vehicles ?? []).filter((v) => favoriteIds.includes(v.id));
  const compareVehicles = (vehicles ?? []).filter((v) => compareIds.includes(v.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter text-ink-900">Meus favoritos</h1>
          <p className="mt-2 text-ink-600">Veículos que você salvou para acompanhar.</p>
        </div>

        {compareIds.length >= 2 ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCompare(true)}
              className="rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
            >
              Comparar {compareIds.length} veículos
            </button>
            <button onClick={clearCompare} className="text-sm font-medium text-ink-600 hover:text-primary-600">
              Limpar seleção
            </button>
          </div>
        ) : null}
      </div>

      {vehicles === null ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      ) : favoriteVehicles.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-card border border-dashed border-surface-border py-20 text-center">
          <p className="text-lg font-semibold text-ink-900">Você ainda não salvou nenhum veículo</p>
          <p className="max-w-sm text-sm text-ink-600">
            Clique no coração em qualquer card do estoque para salvar aqui e comparar depois.
          </p>
          <Link href="/estoque" className="mt-2 text-sm font-semibold text-primary-600 hover:underline">
            Ver estoque completo
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {favoriteVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}

      {showCompare && compareVehicles.length >= 2 ? (
        <CompareModal vehicles={compareVehicles} onClose={() => setShowCompare(false)} />
      ) : null}
    </div>
  );
}
