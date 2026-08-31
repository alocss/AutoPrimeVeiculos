export function VehicleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-surface-border bg-white shadow-card">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="flex flex-col gap-3 p-4">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="mt-2 flex items-center justify-between">
          <div className="skeleton h-6 w-24 rounded" />
          <div className="skeleton h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
