"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { sellFormSchema, type SellFormValues } from "@/lib/validations";
import { BRANDS } from "@/lib/constants";

export function SellForm() {
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SellFormValues>({ resolver: zodResolver(sellFormSchema) });

  async function onSubmit(values: SellFormValues) {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "SELL",
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: `${values.brand} ${values.model} ${values.year}, ${values.km} km, estado: ${values.condition}`,
        payload: { ...values, photoCount: photoNames.length },
      }),
    });

    if (res.ok) {
      toast.success("Recebemos seu veículo! Vamos avaliar e retornar em até 24h úteis.");
      reset();
      setPhotoNames([]);
    } else {
      toast.error("Não conseguimos enviar sua avaliação. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Marca</span>
        <select {...register("brand")} className="form-input">
          <option value="">Selecione</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
          <option value="Outra">Outra</option>
        </select>
        {errors.brand ? <span className="mt-1 block text-xs text-primary-600">{errors.brand.message}</span> : null}
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Modelo</span>
        <input {...register("model")} className="form-input" placeholder="Ex: Corolla" />
        {errors.model ? <span className="mt-1 block text-xs text-primary-600">{errors.model.message}</span> : null}
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Ano</span>
        <input {...register("year")} type="number" className="form-input" placeholder="2020" />
        {errors.year ? <span className="mt-1 block text-xs text-primary-600">{errors.year.message}</span> : null}
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Quilometragem</span>
        <input {...register("km")} type="number" className="form-input" placeholder="45000" />
        {errors.km ? <span className="mt-1 block text-xs text-primary-600">{errors.km.message}</span> : null}
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Estado de conservação</span>
        <div className="flex gap-3">
          {[
            { value: "EXCELENTE", label: "Excelente" },
            { value: "BOM", label: "Bom" },
            { value: "REGULAR", label: "Regular" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-ink-900">
              <input type="radio" value={opt.value} {...register("condition")} className="text-primary-500 focus:ring-primary-500" />
              {opt.label}
            </label>
          ))}
        </div>
        {errors.condition ? <span className="mt-1 block text-xs text-primary-600">{errors.condition.message}</span> : null}
      </label>

      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Fotos do veículo (opcional)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotoNames(Array.from(e.target.files ?? []).map((f) => f.name))}
          className="form-input file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-700"
        />
        {photoNames.length > 0 ? (
          <p className="mt-1.5 text-xs text-ink-600">{photoNames.length} arquivo(s) selecionado(s)</p>
        ) : null}
      </label>

      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Nome completo</span>
        <input {...register("name")} className="form-input" placeholder="Seu nome" />
        {errors.name ? <span className="mt-1 block text-xs text-primary-600">{errors.name.message}</span> : null}
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Telefone</span>
        <input {...register("phone")} className="form-input" placeholder="(11) 99999-9999" />
        {errors.phone ? <span className="mt-1 block text-xs text-primary-600">{errors.phone.message}</span> : null}
      </label>
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-sm font-medium text-ink-900">E-mail</span>
        <input {...register("email")} type="email" className="form-input" placeholder="voce@email.com" />
        {errors.email ? <span className="mt-1 block text-xs text-primary-600">{errors.email.message}</span> : null}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-lg bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-60 sm:col-span-2"
      >
        {isSubmitting ? "Enviando..." : "Solicitar avaliação gratuita"}
      </button>
    </form>
  );
}
