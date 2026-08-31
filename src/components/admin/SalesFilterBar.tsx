"use client";

import { useRouter, usePathname } from "next/navigation";
import { monthLabel } from "@/lib/sales";

export function SalesFilterBar({
  months,
  selected,
}: {
  months: string[];
  selected: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(value: string) {
    router.push(`${pathname}?periodo=${value}`);
  }

  return (
    <label className="flex items-center gap-2">
      <span className="text-sm font-medium text-ink-600">Período</span>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-ink-900 focus:border-primary-500"
      >
        <option value="all">Todos os períodos</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {monthLabel(m)}
          </option>
        ))}
      </select>
    </label>
  );
}
