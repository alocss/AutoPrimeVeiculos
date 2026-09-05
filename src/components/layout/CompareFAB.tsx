"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCompare } from "@/lib/compare-store";
import { cn } from "@/lib/utils";

export default function CompareFAB() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCompare();

  if (pathname?.startsWith("/admin")) return null;
  if (pathname === "/favoritos") return null;
  if (count < 2) return null;

  // Vehicle detail pages stack a mobile sticky bar + a raised WhatsApp FAB along
  // the bottom edge — sit above both there instead of the default offset.
  const hasStickyBarOnMobile = pathname?.startsWith("/veiculos/");

  return (
    <button
      type="button"
      onClick={() => router.push("/favoritos")}
      className={cn(
        "fixed right-5 z-50 flex h-12 items-center gap-2 rounded-full bg-primary-500 pl-4 pr-5 text-sm font-semibold text-white shadow-fab transition-transform duration-200 hover:scale-105 active:scale-95 sm:right-6",
        hasStickyBarOnMobile ? "bottom-[164px] sm:bottom-[172px] lg:bottom-[96px]" : "bottom-[88px] sm:bottom-[96px]",
      )}
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M8 7h9M8 12h9M8 17h9M3 7h.01M3 12h.01M3 17h.01" strokeLinecap="round" />
      </svg>
      Comparar
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-primary-600">
        {count}
      </span>
    </button>
  );
}
