import type { Vehicle, VehiclePhoto } from "@prisma/client";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { Button } from "@/components/ui/Button";

export function FeaturedGrid({ vehicles }: { vehicles: (Vehicle & { photos: VehiclePhoto[] })[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-ink-900">Veículos em destaque</h2>
          <p className="mt-2 text-ink-600">Selecionados pela nossa equipe entre os mais procurados da semana.</p>
        </div>
        <Button href="/estoque" variant="outline">
          Ver estoque completo
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </section>
  );
}
