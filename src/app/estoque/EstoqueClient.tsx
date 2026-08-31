"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Vehicle, VehiclePhoto } from "@prisma/client";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { VehicleListRow } from "@/components/vehicle/VehicleListRow";
import { EstoqueToolbar } from "@/app/estoque/EstoqueToolbar";

type VehicleWithPhotos = Vehicle & { photos: VehiclePhoto[] };

export function EstoqueClient({
  vehicles,
  total,
  page,
  totalPages,
}: {
  vehicles: VehicleWithPhotos[];
  total: number;
  page: number;
  totalPages: number;
}) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <EstoqueToolbar total={total} view={view} onViewChange={setView} />

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-surface-border py-20 text-center">
          <p className="text-lg font-semibold text-ink-900">Nenhum veículo encontrado</p>
          <p className="max-w-sm text-sm text-ink-600">
            Tente ampliar sua faixa de preço ou remover alguns filtros para ver mais opções.
          </p>
          <Link href="/estoque" className="mt-2 text-sm font-semibold text-primary-600 hover:underline">
            Limpar todos os filtros
          </Link>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {vehicles.map((v) => (
            <VehicleListRow key={v.id} vehicle={v} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Paginação">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="rounded-lg border border-surface-border px-3 py-2 text-sm font-medium text-ink-900 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="px-3 text-sm text-ink-600">
            Página <span className="font-semibold text-ink-900">{page}</span> de {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="rounded-lg border border-surface-border px-3 py-2 text-sm font-medium text-ink-900 disabled:opacity-40"
          >
            Próxima
          </button>
        </nav>
      ) : null}
    </div>
  );
}
