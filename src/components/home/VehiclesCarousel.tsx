"use client";

import { useRef } from "react";
import type { Vehicle, VehiclePhoto } from "@prisma/client";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { Button } from "@/components/ui/Button";

type Props = {
  vehicles: (Vehicle & { photos: VehiclePhoto[] })[];
};

export function VehiclesCarousel({ vehicles }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-bold tracking-tighter text-ink-900">Conheça nossos veículos</h2>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Ver veículos anteriores"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-white text-ink-900 shadow-card transition-colors hover:border-primary-500 hover:text-primary-600"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Ver mais veículos"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-white text-ink-900 shadow-card transition-colors hover:border-primary-500 hover:text-primary-600"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="w-[260px] shrink-0 snap-start sm:w-[280px]">
            <VehicleCard vehicle={vehicle} showCompare={false} />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button href="/estoque" variant="primary">
          Ver todos os veículos
        </Button>
      </div>
    </section>
  );
}
