"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, type AdminLoginValues } from "@/lib/validations";
import { SITE } from "@/lib/constants";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({ resolver: zodResolver(adminLoginSchema) });

  async function onSubmit(values: AdminLoginValues) {
    setServerError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      router.push(searchParams.get("next") ?? "/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setServerError(data.error ?? "Não foi possível entrar.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-card border border-surface-border bg-white p-8 shadow-cardHover">
        <div className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-base text-white">
            AP
          </span>
          {SITE.shortName}
        </div>
        <h1 className="mt-6 text-lg font-bold text-ink-900">Área do lojista</h1>
        <p className="mt-1 text-sm text-ink-600">Entre para gerenciar o estoque de veículos.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <label>
            <span className="mb-1.5 block text-sm font-medium text-ink-900">E-mail</span>
            <input {...register("email")} type="email" className="form-input" placeholder="admin@autoprimeveiculos.com.br" />
            {errors.email ? <span className="mt-1 block text-xs text-primary-600">{errors.email.message}</span> : null}
          </label>
          <label>
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Senha</span>
            <input {...register("password")} type="password" className="form-input" placeholder="••••••••" />
            {errors.password ? <span className="mt-1 block text-xs text-primary-600">{errors.password.message}</span> : null}
          </label>

          {serverError ? <p className="text-sm text-primary-600">{serverError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
