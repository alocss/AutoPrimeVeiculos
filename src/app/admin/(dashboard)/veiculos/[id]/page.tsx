import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { vehicleTitle } from "@/lib/utils";

export default async function EditarVeiculoPage({ params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!vehicle) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tighter text-ink-900">
        Editar {vehicleTitle(vehicle)}
      </h1>
      <p className="mt-1 text-sm text-ink-600">Atualize os dados e salve para publicar as mudanças.</p>

      <div className="mt-6 rounded-card border border-surface-border bg-white p-6">
        <VehicleForm
          vehicleId={vehicle.id}
          defaultValues={{
            brand: vehicle.brand,
            model: vehicle.model,
            version: vehicle.version,
            year: vehicle.year,
            modelYear: vehicle.modelYear,
            km: vehicle.km,
            price: vehicle.price,
            condition: vehicle.condition,
            transmission: vehicle.transmission,
            fuel: vehicle.fuel,
            bodyType: vehicle.bodyType,
            color: vehicle.color,
            doors: vehicle.doors,
            plateEnding: vehicle.plateEnding,
            renavam: vehicle.renavam,
            badge: vehicle.badge,
            featured: vehicle.featured,
            status: vehicle.status,
            soldAt: (vehicle.soldAt ?? new Date()).toISOString().slice(0, 10),
            description: vehicle.description,
            optionals: vehicle.optionals,
            photos: vehicle.photos.map((p) => p.url),
          }}
        />
      </div>
    </div>
  );
}
