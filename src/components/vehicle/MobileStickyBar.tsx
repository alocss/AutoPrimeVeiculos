"use client";

import { SITE } from "@/lib/constants";
import { formatBRL } from "@/lib/utils";

export function MobileStickyBar({
  price,
  whatsappHref,
}: {
  price: number;
  whatsappHref: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-surface-border bg-white/95 p-3 backdrop-blur-md lg:hidden">
      <div className="flex-1">
        <p className="text-[11px] text-ink-600">Preço</p>
        <p className="text-base font-bold tabular-nums text-primary-600">{formatBRL(price)}</p>
      </div>
      <a
        href={`tel:+${SITE.whatsappNumber}`}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-900/15 text-ink-900"
        aria-label="Ligar"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4.5 4h4l2 5-2.5 1.5a11 11 0 005.5 5.5L15 13l5 2v4a2 2 0 01-2 2C9.5 21 3 14.5 3 6a2 2 0 012-2z" />
        </svg>
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-success px-4 text-sm font-semibold text-white"
      >
        Tenho interesse
      </a>
    </div>
  );
}
