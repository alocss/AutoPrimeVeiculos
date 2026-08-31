type Item = {
  key: string;
  label: string;
  count: number;
};

export function RankedBarChart({
  title,
  items,
  emptyLabel,
  highlightMode = "top",
  valueSuffix = "venda",
}: {
  title: string;
  items: Item[];
  emptyLabel: string;
  /** "top" highlights only the leader; "top-bottom" also marks the last item */
  highlightMode?: "top" | "top-bottom";
  valueSuffix?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-card border border-surface-border bg-white p-5">
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        <p className="mt-6 py-6 text-center text-sm text-ink-400">{emptyLabel}</p>
      </div>
    );
  }

  const max = Math.max(...items.map((i) => i.count));
  const lastIndex = items.length - 1;

  return (
    <div className="rounded-card border border-surface-border bg-white p-5">
      <h3 className="text-sm font-semibold text-ink-900">{title}</h3>

      <ul className="mt-5 flex flex-col gap-2.5" role="list">
        {items.map((item, i) => {
          const isTop = i === 0;
          const isBottom = highlightMode === "top-bottom" && i === lastIndex && lastIndex > 0;
          const widthPct = Math.max(6, Math.round((item.count / max) * 100));

          return (
            <li key={item.key} className="group" title={`${item.label}: ${item.count} ${valueSuffix}${item.count === 1 ? "" : "s"}`}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-ink-900">{item.label}</span>
                {isTop ? (
                  <span className="shrink-0 text-xs font-semibold text-primary-600">
                    {highlightMode === "top-bottom" ? "Mais vendido" : "Líder"}
                  </span>
                ) : isBottom ? (
                  <span className="shrink-0 text-xs font-semibold text-ink-900">Menos vendido</span>
                ) : null}
              </div>
              <div className="flex h-6 items-center gap-2">
                <div className="h-full flex-1 overflow-hidden rounded-sm bg-surface-muted">
                  <div
                    className={
                      "h-full rounded-r-sm transition-[width] " +
                      (isTop ? "bg-primary-500" : isBottom ? "bg-ink-900" : "bg-ink-900/15")
                    }
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-sm font-semibold tabular-nums text-ink-900">
                  {item.count}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
