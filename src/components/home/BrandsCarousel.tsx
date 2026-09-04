"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRANDS } from "@/lib/constants";

const BRAND_COLORS: Record<string, string> = {
  Toyota: "#EB0A1E",
  Honda: "#E40521",
  Volkswagen: "#001E50",
  Jeep: "#425563",
  Nissan: "#C3002F",
  Hyundai: "#002C5F",
  Fiat: "#8B0000",
  Chevrolet: "#D4AF37",
  Volvo: "#003057",
  Peugeot: "#0A0A0A",
  Ford: "#00274E",
};

function BrandLogo({ brand }: { brand: string }) {
  const [failed, setFailed] = useState(false);
  const slug = brand.toLowerCase();

  if (failed) {
    return (
      <span
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white font-display text-xl font-bold text-white shadow-card"
        style={{ backgroundColor: BRAND_COLORS[brand] ?? "#111111" }}
      >
        {brand.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-card">
      <Image
        src={`/brands/${slug}.png`}
        alt={brand}
        fill
        sizes="64px"
        className="rounded-full object-contain p-2.5"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export function BrandsCarousel() {
  const track = [...BRANDS, ...BRANDS];

  return (
    <section className="border-y border-surface-border bg-surface-muted py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-center font-display text-sm font-bold uppercase tracking-widest text-ink-400">
          Marcas que trabalhamos
        </h2>
      </div>
      <div
        className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div className="flex w-max animate-marquee gap-10 py-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {track.map((brand, index) => (
            <Link
              key={`${brand}-${index}`}
              href={`/estoque?brand=${encodeURIComponent(brand)}`}
              className="flex w-24 flex-col items-center gap-2 text-center"
              aria-hidden={index >= BRANDS.length ? true : undefined}
              tabIndex={index >= BRANDS.length ? -1 : undefined}
            >
              <span className="transition-transform hover:-translate-y-1">
                <BrandLogo brand={brand} />
              </span>
              <span className="font-display text-xs font-bold tracking-tight text-ink-600">
                {brand}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
