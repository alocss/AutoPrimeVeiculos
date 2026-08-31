"use client";

import { usePathname } from "next/navigation";
import { whatsappGeneralLink } from "@/lib/whatsapp";

export default function WhatsAppFAB() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappGeneralLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-fab transition-transform duration-200 hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.5 0-10 4.5-10 10 0 1.77.46 3.44 1.28 4.9L2 22l5.25-1.28A9.96 9.96 0 0012.04 22c5.5 0 10-4.5 10-10s-4.5-10-10-10zm0 18.2c-1.6 0-3.1-.45-4.4-1.24l-.32-.19-3.11.76.76-3.03-.2-.32A8.16 8.16 0 013.84 12c0-4.53 3.68-8.2 8.2-8.2s8.2 3.67 8.2 8.2-3.68 8.2-8.2 8.2zm4.5-6.13c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.13-.17.24-.65.8-.8.96-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.07-.12-.56-1.36-.77-1.86-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.24-.87.85-.87 2.08 0 1.22.89 2.4 1.02 2.57.13.16 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28z" />
      </svg>
      <span className="absolute right-16 hidden whitespace-nowrap rounded-lg bg-ink-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-card transition-opacity group-hover:opacity-100 sm:block">
        Fale conosco no WhatsApp
      </span>
    </a>
  );
}
