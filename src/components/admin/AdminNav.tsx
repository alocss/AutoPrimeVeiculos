"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const LINKS = [
  { href: "/admin", label: "Estoque" },
  { href: "/admin/vendas", label: "Vendas" },
  { href: "/admin/veiculos/novo", label: "Novo veículo" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-surface-border bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-sm text-white">
              AP
            </span>
            {SITE.shortName} admin
          </Link>
          <nav className="hidden items-center gap-5 sm:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-ink-600 hover:text-primary-600",
                  pathname === link.href && "text-primary-600",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-sm font-medium text-ink-600 hover:text-primary-600">
            Ver site
          </Link>
          <button onClick={logout} className="text-sm font-medium text-ink-600 hover:text-primary-600">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
