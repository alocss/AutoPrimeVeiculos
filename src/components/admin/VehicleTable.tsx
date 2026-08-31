"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Vehicle, VehiclePhoto } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { CONDITION_LABEL } from "@/lib/constants";
import { formatBRL, formatKm, vehicleTitle, cn } from "@/lib/utils";

type VehicleWithPhotos = Vehicle & { photos: VehiclePhoto[] };

const STATUS_FILTERS = [
  { value: "ALL", label: "Todos" },
  { value: "ACTIVE", label: "No estoque" },
  { value: "SOLD", label: "Vendidos" },
] as const;

export function VehicleTable({ vehicles }: { vehicles: VehicleWithPhotos[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]["value"]>("ALL");

  const filtered = useMemo(
    () => (statusFilter === "ALL" ? vehicles : vehicles.filter((v) => v.status === statusFilter)),
    [vehicles, statusFilter],
  );

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Remover "${title}" do estoque? Essa ação não pode ser desfeita.`)) return;

    setDeletingId(id);
    const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (res.ok) {
      toast.success("Veículo removido do estoque.");
      router.refresh();
    } else {
      toast.error("Não foi possível remover o veículo.");
    }
  }

  async function handleToggleStatus(v: VehicleWithPhotos) {
    const nextStatus = v.status === "SOLD" ? "ACTIVE" : "SOLD";
    if (
      nextStatus === "SOLD" &&
      !window.confirm(`Marcar "${vehicleTitle(v)}" como vendido? Ele sai do site público imediatamente.`)
    ) {
      return;
    }

    setTogglingId(v.id);
    const res = await fetch(`/api/vehicles/${v.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        soldAt: nextStatus === "SOLD" ? new Date().toISOString() : null,
      }),
    });
    setTogglingId(null);

    if (res.ok) {
      toast.success(nextStatus === "SOLD" ? "Veículo marcado como vendido." : "Veículo reativado no estoque.");
      router.refresh();
    } else {
      toast.error("Não foi possível atualizar o status.");
    }
  }

  if (vehicles.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-surface-border bg-white py-16 text-center">
        <p className="text-ink-600">Nenhum veículo cadastrado ainda.</p>
        <Link href="/admin/veiculos/novo" className="mt-2 inline-block text-sm font-semibold text-primary-600 hover:underline">
          Cadastrar o primeiro veículo
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              statusFilter === f.value
                ? "border-primary-500 bg-primary-50 text-primary-600"
                : "border-surface-border text-ink-600 hover:border-ink-900/30",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-surface-border bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-surface-border text-left text-xs font-semibold uppercase text-ink-400">
              <th className="p-3">Veículo</th>
              <th className="p-3">Status</th>
              <th className="p-3">Condição</th>
              <th className="p-3">Ano</th>
              <th className="p-3">KM</th>
              <th className="p-3">Preço</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filtered.map((v) => (
              <tr key={v.id}>
                <td className="flex items-center gap-3 p-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                    {v.photos[0] ? <Image src={v.photos[0].url} alt="" fill sizes="64px" className="object-cover" /> : null}
                  </div>
                  <span className="font-medium text-ink-900">{vehicleTitle(v)}</span>
                </td>
                <td className="p-3">
                  {v.status === "SOLD" ? (
                    <Badge tone="neutral">Vendido</Badge>
                  ) : (
                    <Badge tone="success">No estoque</Badge>
                  )}
                </td>
                <td className="p-3 text-ink-600">{CONDITION_LABEL[v.condition]}</td>
                <td className="p-3 tabular-nums text-ink-600">{v.year}</td>
                <td className="p-3 tabular-nums text-ink-600">{formatKm(v.km)}</td>
                <td className="p-3 tabular-nums font-semibold text-ink-900">{formatBRL(v.price)}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleToggleStatus(v)}
                      disabled={togglingId === v.id}
                      className="text-sm font-medium text-ink-600 hover:text-primary-600 disabled:opacity-50"
                    >
                      {togglingId === v.id ? "Salvando..." : v.status === "SOLD" ? "Reativar" : "Marcar vendido"}
                    </button>
                    <Link href={`/admin/veiculos/${v.id}`} className="text-sm font-medium text-primary-600 hover:underline">
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(v.id, vehicleTitle(v))}
                      disabled={deletingId === v.id}
                      className="text-sm font-medium text-ink-600 hover:text-primary-600 disabled:opacity-50"
                    >
                      {deletingId === v.id ? "Removendo..." : "Remover"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
