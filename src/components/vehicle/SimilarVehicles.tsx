import type { Vehicle, VehiclePhoto } from "@prisma/client";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { ScrollCarousel } from "@/components/ui/ScrollCarousel";

export function SimilarVehicles({ vehicles }: { vehicles: (Vehicle & { photos: VehiclePhoto[] })[] }) {
  if (vehicles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="font-display text-2xl font-bold tracking-tighter text-ink-900">Veículos similares</h2>
      <ScrollCarousel className="mt-6" itemClassName="w-[280px] shrink-0 sm:w-[300px]">
        {vehicles.map((v) => (
          <VehicleCard key={v.id} vehicle={v} showCompare={false} />
        ))}
      </ScrollCarousel>
    </section>
  );
}
