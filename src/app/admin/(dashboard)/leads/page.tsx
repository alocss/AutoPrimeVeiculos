import { prisma } from "@/lib/prisma";
import { LeadTable } from "@/components/admin/LeadTable";
import { StatTile } from "@/components/admin/StatTile";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const rows = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicle: { select: { brand: true, model: true, version: true, slug: true } } },
  });

  const leads = rows.map((l) => ({
    id: l.id,
    type: l.type,
    name: l.name,
    email: l.email,
    phone: l.phone,
    message: l.message,
    payload: l.payload as Record<string, unknown> | null,
    vehicle: l.vehicle,
    createdAtLabel: l.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
  }));

  const stats = {
    total: leads.length,
    financing: leads.filter((l) => l.type === "FINANCING").length,
    sell: leads.filter((l) => l.type === "SELL").length,
    contact: leads.filter((l) => l.type === "CONTACT").length,
  };

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tighter text-ink-900">Leads</h1>
        <p className="mt-1 text-sm text-ink-600">Mensagens recebidas pelos formulários do site.</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total de leads" value={String(stats.total)} />
        <StatTile label="Financiamento" value={String(stats.financing)} />
        <StatTile label="Venda de veículo" value={String(stats.sell)} />
        <StatTile label="Contato" value={String(stats.contact)} />
      </div>

      <div className="mt-6">
        <LeadTable leads={leads} />
      </div>
    </div>
  );
}
