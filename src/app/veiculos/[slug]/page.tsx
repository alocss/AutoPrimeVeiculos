import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVehicleBySlug, getSimilarVehicles } from "@/lib/vehicles";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { VehicleDetailActions } from "@/components/vehicle/VehicleDetailActions";
import { FinancingCalculator } from "@/components/vehicle/FinancingCalculator";
import { SimilarVehicles } from "@/components/vehicle/SimilarVehicles";
import { MobileStickyBar } from "@/components/vehicle/MobileStickyBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BODY_TYPE_LABEL,
  CONDITION_LABEL,
  TRANSMISSION_LABEL,
  FUEL_LABEL,
  SITE,
} from "@/lib/constants";
import { formatBRL, formatKm, vehicleTitle } from "@/lib/utils";
import { whatsappVehicleInterestLink } from "@/lib/whatsapp";

// Pages render on first visit and are cached for 5 minutes (ISR), rather than being
// pre-built with generateStaticParams — that would require a live database connection
// at `docker build` time, which a CI/registry build pipeline typically doesn't have.
export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const vehicle = await getVehicleBySlug(params.slug);
  if (!vehicle) return {};

  const title = `${vehicleTitle(vehicle)} ${vehicle.year} — ${formatBRL(vehicle.price)}`;
  const description = `${vehicleTitle(vehicle)} ${vehicle.year}, ${formatKm(vehicle.km)}, ${TRANSMISSION_LABEL[vehicle.transmission]}. ${CONDITION_LABEL[vehicle.condition]} disponível na ${SITE.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: vehicle.photos[0] ? [{ url: vehicle.photos[0].url }] : undefined,
    },
  };
}

const SPEC_ROWS = (vehicle: NonNullable<Awaited<ReturnType<typeof getVehicleBySlug>>>) => [
  { label: "Marca", value: vehicle.brand },
  { label: "Modelo", value: vehicle.model },
  { label: "Versão", value: vehicle.version },
  { label: "Ano/Modelo", value: `${vehicle.year}/${vehicle.modelYear}` },
  { label: "Quilometragem", value: formatKm(vehicle.km) },
  { label: "Câmbio", value: TRANSMISSION_LABEL[vehicle.transmission] },
  { label: "Combustível", value: FUEL_LABEL[vehicle.fuel] },
  { label: "Cor", value: vehicle.color },
  { label: "Portas", value: String(vehicle.doors) },
  { label: "Final de placa", value: String(vehicle.plateEnding) },
  { label: "RENAVAM", value: vehicle.renavam },
];

export default async function VehiclePage({ params }: { params: { slug: string } }) {
  const vehicle = await getVehicleBySlug(params.slug);
  if (!vehicle) notFound();

  const similar = await getSimilarVehicles(vehicle);
  const whatsappHref = whatsappVehicleInterestLink(vehicle);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: vehicleTitle(vehicle),
    brand: vehicle.brand,
    model: vehicle.model,
    vehicleModelDate: String(vehicle.modelYear),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: vehicle.km, unitCode: "KMT" },
    vehicleTransmission: TRANSMISSION_LABEL[vehicle.transmission],
    fuelType: FUEL_LABEL[vehicle.fuel],
    color: vehicle.color,
    image: vehicle.photos.map((p) => p.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: vehicle.price,
      availability: "https://schema.org/InStock",
      itemCondition:
        vehicle.condition === "ZERO_KM" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      seller: { "@type": "AutoDealer", name: SITE.name },
    },
  };

  return (
    <div className="pb-20 lg:pb-0">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm text-ink-600">
          <a href="/estoque" className="hover:text-primary-600">
            Estoque
          </a>{" "}
          / <span className="text-ink-900">{vehicleTitle(vehicle)}</span>
        </nav>

        <VehicleGallery photos={vehicle.photos} title={vehicleTitle(vehicle)} />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap gap-2">
              {vehicle.status === "SOLD" ? <Badge tone="neutral">Vendido</Badge> : null}
              {vehicle.badge !== "NONE" ? (
                <Badge tone={vehicle.badge === "NOVO" ? "success" : "primary"}>
                  {vehicle.badge === "NOVO" ? "Novo no estoque" : "Destaque"}
                </Badge>
              ) : null}
              <Badge tone="outline">{CONDITION_LABEL[vehicle.condition]}</Badge>
              <Badge tone="outline">{BODY_TYPE_LABEL[vehicle.bodyType]}</Badge>
            </div>

            <h1 className="mt-3 font-display text-3xl font-bold tracking-tighter text-ink-900 sm:text-4xl">
              {vehicleTitle(vehicle)}
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-600">
              <span className="tabular-nums">{vehicle.year}</span>
              <span className="tabular-nums">{formatKm(vehicle.km)}</span>
              <span>{TRANSMISSION_LABEL[vehicle.transmission]}</span>
              <span>{vehicle.color}</span>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-600">{vehicle.description}</p>

            {vehicle.optionals.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Opcionais e acessórios</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {vehicle.optionals.map((opt) => (
                    <span
                      key={opt}
                      className="rounded-full border border-surface-border bg-white px-3 py-1.5 text-[13px] text-ink-900"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Ficha técnica</h2>
              <dl className="mt-3 divide-y divide-surface-border overflow-hidden rounded-card border border-surface-border">
                {SPEC_ROWS(vehicle).map((row, i) => (
                  <div
                    key={row.label}
                    className={i % 2 === 0 ? "flex justify-between px-4 py-3 text-sm" : "flex justify-between bg-surface-muted px-4 py-3 text-sm"}
                  >
                    <dt className="text-ink-600">{row.label}</dt>
                    <dd className="font-medium tabular-nums text-ink-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            {vehicle.status === "SOLD" ? (
              <div className="rounded-card border border-surface-border bg-surface-muted p-5 shadow-card">
                <p className="text-sm font-semibold text-ink-900">Este veículo já foi vendido</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Ele não está mais disponível no nosso estoque, mas temos outras opções parecidas
                  logo abaixo.
                </p>
                <Button href="/estoque" variant="outline" fullWidth className="mt-4">
                  Ver estoque disponível
                </Button>
              </div>
            ) : (
              <div className="rounded-card border border-surface-border bg-white p-5 shadow-card">
                <p className="text-sm text-ink-600">Preço à vista</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-primary-600">{formatBRL(vehicle.price)}</p>
                <div className="mt-5">
                  <VehicleDetailActions vehicleId={vehicle.id} whatsappHref={whatsappHref} />
                </div>
              </div>
            )}

            {vehicle.status === "ACTIVE" ? <FinancingCalculator price={vehicle.price} /> : null}
          </div>
        </div>
      </div>

      <SimilarVehicles vehicles={similar} />

      {vehicle.status === "ACTIVE" ? (
        <MobileStickyBar price={vehicle.price} whatsappHref={whatsappHref} />
      ) : null}
    </div>
  );
}
