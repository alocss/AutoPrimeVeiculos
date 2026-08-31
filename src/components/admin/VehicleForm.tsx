"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { vehicleFormSchema, type VehicleFormValues } from "@/lib/validations";
import {
  BRANDS,
  BODY_TYPE_LABEL,
  TRANSMISSION_LABEL,
  FUEL_LABEL,
} from "@/lib/constants";
import { PhotoUploader } from "@/components/admin/PhotoUploader";

type Props = {
  vehicleId?: string;
  defaultValues?: Partial<VehicleFormValues>;
};

const currentYear = new Date().getFullYear();

export function VehicleForm({ vehicleId, defaultValues }: Props) {
  const router = useRouter();
  const [optionalsText, setOptionalsText] = useState((defaultValues?.optionals ?? []).join(", "));

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      condition: "SEMINOVO",
      transmission: "AUTOMATICO",
      fuel: "FLEX",
      bodyType: "SEDAN",
      badge: "NONE",
      featured: false,
      status: "ACTIVE",
      soldAt: new Date().toISOString().slice(0, 10),
      doors: 4,
      plateEnding: 0,
      photos: [],
      optionals: [],
      year: currentYear,
      modelYear: currentYear,
      ...defaultValues,
    },
  });

  const status = watch("status");

  async function onSubmit(values: VehicleFormValues) {
    const payload: VehicleFormValues = {
      ...values,
      optionals: optionalsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await fetch(vehicleId ? `/api/vehicles/${vehicleId}` : "/api/vehicles", {
      method: vehicleId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(vehicleId ? "Veículo atualizado." : "Veículo cadastrado.");
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Não foi possível salvar o veículo.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Identificação</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Marca" error={errors.brand?.message}>
            <select {...register("brand")} className="form-input">
              <option value="">Selecione</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Modelo" error={errors.model?.message}>
            <input {...register("model")} className="form-input" placeholder="Corolla" />
          </Field>
          <Field label="Versão" error={errors.version?.message}>
            <input {...register("version")} className="form-input" placeholder="XEi 2.0" />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Especificações</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Ano fabricação" error={errors.year?.message}>
            <input {...register("year")} type="number" className="form-input" />
          </Field>
          <Field label="Ano modelo" error={errors.modelYear?.message}>
            <input {...register("modelYear")} type="number" className="form-input" />
          </Field>
          <Field label="KM" error={errors.km?.message}>
            <input {...register("km")} type="number" className="form-input" />
          </Field>
          <Field label="Preço (R$)" error={errors.price?.message}>
            <input {...register("price")} type="number" className="form-input" />
          </Field>
          <Field label="Condição" error={errors.condition?.message}>
            <select {...register("condition")} className="form-input">
              <option value="ZERO_KM">0km</option>
              <option value="SEMINOVO">Seminovo</option>
            </select>
          </Field>
          <Field label="Tipo" error={errors.bodyType?.message}>
            <select {...register("bodyType")} className="form-input">
              {Object.entries(BODY_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Câmbio" error={errors.transmission?.message}>
            <select {...register("transmission")} className="form-input">
              {Object.entries(TRANSMISSION_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Combustível" error={errors.fuel?.message}>
            <select {...register("fuel")} className="form-input">
              {Object.entries(FUEL_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cor" error={errors.color?.message}>
            <input {...register("color")} className="form-input" placeholder="Branco" />
          </Field>
          <Field label="Portas" error={errors.doors?.message}>
            <input {...register("doors")} type="number" min={2} max={5} className="form-input" />
          </Field>
          <Field label="Final de placa" error={errors.plateEnding?.message}>
            <input {...register("plateEnding")} type="number" min={0} max={9} className="form-input" />
          </Field>
          <Field label="RENAVAM" error={errors.renavam?.message}>
            <input {...register("renavam")} className="form-input" placeholder="00000000000" />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Vitrine</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Badge" error={errors.badge?.message}>
            <select {...register("badge")} className="form-input">
              <option value="NONE">Nenhum</option>
              <option value="DESTAQUE">Destaque</option>
              <option value="NOVO">Novo no estoque</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-ink-900">
            <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-ink-900/25 text-primary-500" />
            Exibir na Home (destaque)
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Status de venda</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status" error={errors.status?.message}>
            <select {...register("status")} className="form-input">
              <option value="ACTIVE">Ativo no estoque</option>
              <option value="SOLD">Vendido</option>
            </select>
          </Field>
          {status === "SOLD" ? (
            <Field label="Data da venda" error={errors.soldAt?.message}>
              <input {...register("soldAt")} type="date" className="form-input" />
            </Field>
          ) : null}
        </div>
        {status === "SOLD" ? (
          <p className="mt-2 text-xs text-ink-400">
            Veículos vendidos saem do site público (estoque, Home e busca), mas continuam contados
            no dashboard de vendas.
          </p>
        ) : null}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Descrição e opcionais</h2>
        <div className="mt-3 flex flex-col gap-4">
          <Field label="Descrição" error={errors.description?.message}>
            <textarea {...register("description")} rows={4} className="form-input resize-none" />
          </Field>
          <label>
            <span className="mb-1.5 block text-sm font-medium text-ink-900">Opcionais (separados por vírgula)</span>
            <input
              value={optionalsText}
              onChange={(e) => setOptionalsText(e.target.value)}
              className="form-input"
              placeholder="Ar-condicionado, Teto solar, Bancos em couro"
            />
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Fotos</h2>
        <div className="mt-3">
          <Controller
            control={control}
            name="photos"
            render={({ field }) => <PhotoUploader photos={field.value} onChange={field.onChange} />}
          />
        </div>
      </section>

      <div className="flex items-center gap-3 border-t border-surface-border pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60"
        >
          {isSubmitting ? "Salvando..." : vehicleId ? "Salvar alterações" : "Cadastrar veículo"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-lg border border-surface-border px-6 py-3 text-sm font-semibold text-ink-600 hover:border-ink-900/30"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="mb-1.5 block text-sm font-medium text-ink-900">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-primary-600">{error}</span> : null}
    </label>
  );
}
