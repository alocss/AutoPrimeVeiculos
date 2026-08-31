import { prisma } from "@/lib/prisma";
import { BODY_TYPE_LABEL } from "@/lib/constants";

export type SalesPeriod = string | "all";

const MONTH_LABELS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return `${MONTH_LABELS[month - 1]} de ${year}`;
}

function periodRange(period: SalesPeriod): { gte?: Date; lt?: Date } {
  if (period === "all") return {};
  const [year, month] = period.split("-").map(Number);
  const gte = new Date(Date.UTC(year, month - 1, 1));
  const lt = new Date(Date.UTC(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1));
  return { gte, lt };
}

export async function getAvailableSaleMonths(): Promise<string[]> {
  const sold = await prisma.vehicle.findMany({
    where: { status: "SOLD", soldAt: { not: null } },
    select: { soldAt: true },
  });
  const months = new Set(sold.map((v) => monthKey(v.soldAt as Date)));
  return Array.from(months).sort().reverse();
}

export type SalesReport = {
  period: SalesPeriod;
  totalCount: number;
  totalRevenue: number;
  byCategory: { bodyType: string; label: string; count: number }[];
  byModel: { key: string; label: string; count: number; revenue: number }[];
  topModel: { label: string; count: number } | null;
  bottomModel: { label: string; count: number } | null;
  topCategory: { label: string; count: number } | null;
};

export async function getSalesReport(period: SalesPeriod): Promise<SalesReport> {
  const range = periodRange(period);
  const where = {
    status: "SOLD" as const,
    ...(range.gte || range.lt
      ? { soldAt: { ...(range.gte ? { gte: range.gte } : {}), ...(range.lt ? { lt: range.lt } : {}) } }
      : {}),
  };

  const sold = await prisma.vehicle.findMany({
    where,
    select: { brand: true, model: true, bodyType: true, price: true },
  });

  const totalCount = sold.length;
  const totalRevenue = sold.reduce((sum, v) => sum + v.price, 0);

  const categoryMap = new Map<string, number>();
  const modelMap = new Map<string, { label: string; count: number; revenue: number }>();

  for (const v of sold) {
    categoryMap.set(v.bodyType, (categoryMap.get(v.bodyType) ?? 0) + 1);

    const modelKey = `${v.brand} ${v.model}`;
    const current = modelMap.get(modelKey) ?? { label: modelKey, count: 0, revenue: 0 };
    current.count += 1;
    current.revenue += v.price;
    modelMap.set(modelKey, current);
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([bodyType, count]) => ({ bodyType, label: BODY_TYPE_LABEL[bodyType] ?? bodyType, count }))
    .sort((a, b) => b.count - a.count);

  const byModel = Array.from(modelMap.entries())
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => b.count - a.count);

  return {
    period,
    totalCount,
    totalRevenue,
    byCategory,
    byModel,
    topModel: byModel[0] ? { label: byModel[0].label, count: byModel[0].count } : null,
    bottomModel: byModel.length > 0 ? { label: byModel[byModel.length - 1].label, count: byModel[byModel.length - 1].count } : null,
    topCategory: byCategory[0] ? { label: byCategory[0].label, count: byCategory[0].count } : null,
  };
}
