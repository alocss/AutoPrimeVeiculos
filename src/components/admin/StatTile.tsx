export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-card border border-surface-border bg-white p-5">
      <p className="text-sm text-ink-600">{label}</p>
      <p className="mt-1.5 text-3xl font-bold text-ink-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}
