import { getAvailableSaleMonths, getSalesReport, monthLabel, type SalesPeriod } from "@/lib/sales";
import { StatTile } from "@/components/admin/StatTile";
import { RankedBarChart } from "@/components/admin/RankedBarChart";
import { SalesFilterBar } from "@/components/admin/SalesFilterBar";
import { formatBRL, formatCompactNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function VendasDashboardPage({
  searchParams,
}: {
  searchParams: { periodo?: string };
}) {
  const months = await getAvailableSaleMonths();
  const period: SalesPeriod = searchParams.periodo ?? months[0] ?? "all";
  const report = await getSalesReport(period);

  const periodDescription = period === "all" ? "em todos os períodos" : `em ${monthLabel(period)}`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tighter text-ink-900">Dashboard de vendas</h1>
          <p className="mt-1 text-sm text-ink-600">Veículos vendidos {periodDescription}.</p>
        </div>
        <SalesFilterBar months={months} selected={period} />
      </div>

      {report.totalCount === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-2 rounded-card border border-dashed border-surface-border bg-white py-20 text-center">
          <p className="text-lg font-semibold text-ink-900">Nenhuma venda registrada {periodDescription}</p>
          <p className="max-w-sm text-sm text-ink-600">
            Marque um veículo como &quot;Vendido&quot; na listagem do estoque para ele aparecer aqui.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatTile
              label="Veículos vendidos"
              value={formatCompactNumber(report.totalCount)}
              hint={periodDescription}
            />
            <StatTile
              label="Total vendido"
              value={formatBRL(report.totalRevenue)}
              hint={periodDescription}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <RankedBarChart
              title="Vendas por categoria"
              items={report.byCategory.map((c) => ({ key: c.bodyType, label: c.label, count: c.count }))}
              emptyLabel="Sem vendas no período."
              highlightMode="top"
            />
            <RankedBarChart
              title="Vendas por modelo"
              items={report.byModel.map((m) => ({ key: m.key, label: m.label, count: m.count }))}
              emptyLabel="Sem vendas no período."
              highlightMode="top-bottom"
            />
          </div>
        </>
      )}
    </div>
  );
}
