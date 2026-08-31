"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function VehicleGallery({ photos, title }: { photos: { id: string; url: string }[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, photos.length]);

  if (photos.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        <button
          type="button"
          onClick={() => {
            setActive(0);
            setLightboxOpen(true);
          }}
          className="relative col-span-4 aspect-[4/3] overflow-hidden rounded-card bg-surface-muted sm:col-span-3 sm:row-span-2"
        >
          <Image
            src={photos[0].url}
            alt={`${title} — foto 1 de ${photos.length}`}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 60vw"
            className="object-cover"
          />
        </button>

        {photos.slice(1, 5).map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              setActive(i + 1);
              setLightboxOpen(true);
            }}
            className="relative aspect-square overflow-hidden rounded-lg bg-surface-muted sm:col-span-1"
          >
            <Image
              src={photo.url}
              alt={`${title} — foto ${i + 2} de ${photos.length}`}
              fill
              sizes="120px"
              className="object-cover"
            />
            {i === 3 && photos.length > 5 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-sm font-semibold text-white">
                +{photos.length - 5} fotos
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria de fotos — ${title}`}
        >
          <div className="flex items-center justify-between text-white">
            <span className="text-sm tabular-nums text-white/70">
              {active + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Fechar galeria"
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              src={photos[active].url}
              alt={`${title} — foto ${active + 1} de ${photos.length}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setActive((i) => (i - 1 + photos.length) % photos.length)}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.5 15L7.5 10l5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % photos.length)}
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7.5 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition-all",
                  i === active ? "ring-primary-500" : "ring-transparent opacity-60",
                )}
              >
                <Image src={photo.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
