"use client";

import { Button } from "@/components/ui/Button";
import { useFavorites } from "@/lib/favorites-store";
import { useCompare } from "@/lib/compare-store";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export function VehicleDetailActions({
  vehicleId,
  whatsappHref,
}: {
  vehicleId: string;
  whatsappHref: string;
}) {
  const { isFavorite, toggle } = useFavorites();
  const { isComparing, toggle: toggleCompare } = useCompare();
  const favorite = isFavorite(vehicleId);
  const comparing = isComparing(vehicleId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <Button href={whatsappHref} variant="whatsapp" size="lg" className="flex-1 sm:flex-none">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12.04 2c-5.5 0-10 4.5-10 10 0 1.77.46 3.44 1.28 4.9L2 22l5.25-1.28A9.96 9.96 0 0012.04 22c5.5 0 10-4.5 10-10s-4.5-10-10-10zm0 18.2c-1.6 0-3.1-.45-4.4-1.24l-.32-.19-3.11.76.76-3.03-.2-.32A8.16 8.16 0 013.84 12c0-4.53 3.68-8.2 8.2-8.2s8.2 3.67 8.2 8.2-3.68 8.2-8.2 8.2zm4.5-6.13c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.13-.17.24-.65.8-.8.96-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.07-.12-.56-1.36-.77-1.86-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.24-.87.85-.87 2.08 0 1.22.89 2.4 1.02 2.57.13.16 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28z" />
          </svg>
          Tenho interesse
        </Button>

        <a
          href={`tel:+${SITE.whatsappNumber}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-900/15 px-5 py-4 text-base font-semibold text-ink-900 transition-colors hover:border-primary-500 hover:text-primary-600"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4.5 4h4l2 5-2.5 1.5a11 11 0 005.5 5.5L15 13l5 2v4a2 2 0 01-2 2C9.5 21 3 14.5 3 6a2 2 0 012-2z" />
          </svg>
          Ligar
        </a>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <button
          type="button"
          onClick={() => toggle(vehicleId)}
          className={cn("flex items-center gap-1.5 font-medium", favorite ? "text-primary-600" : "text-ink-600 hover:text-ink-900")}
        >
          <svg viewBox="0 0 24 24" className={cn("h-4 w-4", favorite ? "fill-primary-500 stroke-primary-500" : "fill-none stroke-current")} strokeWidth="1.8">
            <path d="M12 20s-7.5-4.6-10-9.3C.4 7.4 2 4 5.4 4c2 0 3.4 1 4.6 2.6C11.2 5 12.6 4 14.6 4 18 4 19.6 7.4 22 10.7 19.5 15.4 12 20 12 20z" />
          </svg>
          {favorite ? "Nos favoritos" : "Salvar nos favoritos"}
        </button>

        <button
          type="button"
          onClick={() => toggleCompare(vehicleId)}
          className={cn("flex items-center gap-1.5 font-medium", comparing ? "text-primary-600" : "text-ink-600 hover:text-ink-900")}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 7h13M8 12h13M8 17h13M3 7h.01M3 12h.01M3 17h.01" strokeLinecap="round" />
          </svg>
          {comparing ? "Comparando" : "Comparar"}
        </button>
      </div>
    </div>
  );
}
