import Link from "next/link";
import { BRANDS } from "@/lib/constants";

export function BrandsCarousel() {
  return (
    <section className="border-y border-surface-border bg-surface-muted py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-[repeat(10,minmax(0,1fr))]">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/estoque?brand=${encodeURIComponent(brand)}`}
              className="flex h-16 min-w-0 items-center justify-center rounded-xl border border-surface-border bg-white px-2 font-display text-sm font-bold tracking-tight text-ink-600 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:text-primary-600 hover:shadow-cardHover"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
