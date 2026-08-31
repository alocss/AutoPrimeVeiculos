import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VehicleTable } from "@/components/admin/VehicleTable";
import { StatTile } from "@/components/admin/StatTile";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });

  const active = vehicles.filter((v) => v.status === "ACTIVE");
  const stats = {
    total: active.length,
    zeroKm: active.filter((v) => v.condition === "ZERO_KM").length,
    seminovo: active.filter((v) => v.condition === "SEMINOVO").length,
    sold: vehicles.filter((v) => v.status === "SOLD").length,
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tighter text-ink-900">Estoque</h1>
          <p className="mt-1 text-sm text-ink-600">Gerencie os veículos publicados no site.</p>
        </div>
        <Link
          href="/admin/veiculos/novo"
          className="rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
        >
          + Novo veículo
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="No estoque" value={String(stats.total)} />
        <StatTile label="0km" value={String(stats.zeroKm)} />
        <StatTile label="Seminovos" value={String(stats.seminovo)} />
        <Link href="/admin/vendas" className="block transition-opacity hover:opacity-80">
          <StatTile label="Vendidos" value={String(stats.sold)} hint="Ver dashboard de vendas →" />
        </Link>
      </div>

      <div className="mt-6">
        <VehicleTable vehicles={vehicles} />
      </div>
    </div>
  );
}
