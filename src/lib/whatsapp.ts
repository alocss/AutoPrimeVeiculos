import { SITE } from "@/lib/constants";
import { formatBRL, vehicleTitle } from "@/lib/utils";

type VehicleLike = {
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
};

export function whatsappLink(message: string): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${SITE.whatsappNumber}?${params.toString()}`;
}

export function whatsappVehicleInterestLink(vehicle: VehicleLike): string {
  const message = `Olá! Tenho interesse no ${vehicleTitle(vehicle)} ${vehicle.year} (${formatBRL(
    vehicle.price,
  )}) que vi no site da ${SITE.name}. Ainda está disponível?`;
  return whatsappLink(message);
}

export function whatsappGeneralLink(): string {
  return whatsappLink(`Olá! Vim pelo site da ${SITE.name} e gostaria de mais informações.`);
}
