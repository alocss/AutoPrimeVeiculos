"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { financingFormSchema, type FinancingFormValues } from "@/lib/validations";
import { FINANCING } from "@/lib/constants";

export function FinancingForm({ defaultVehicle }: { defaultVehicle?: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FinancingFormValues>({
    resolver: zodResolver(financingFormSchema),
    defaultValues: {
      vehicleInterest: defaultVehicle ?? "",
      termMonths: 48,
      downPayment: 0,
    },
  });

  async function onSubmit(values: FinancingFormValues) {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "FINANCING",
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: `Simulação: entrada ${values.downPayment}, prazo ${values.termMonths}x`,
        payload: values,
      }),
    });

    if (res.ok) {
      toast.success("Simulação enviada! Nossa equipe vai te retornar em breve.");
      reset();
    } else {
      toast.error("Não conseguimos enviar seu pedido. Tente novamente em instantes.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Nome completo" error={errors.name?.message}>
        <input {...register("name")} className="form-input" placeholder="Seu nome" />
      </Field>
      <Field label="CPF" error={errors.cpf?.message}>
        <input {...register("cpf")} className="form-input" placeholder="000.000.000-00" />
      </Field>
      <Field label="E-mail" error={errors.email?.message}>
        <input {...register("email")} type="email" className="form-input" placeholder="voce@email.com" />
      </Field>
      <Field label="Telefone" error={errors.phone?.message}>
        <input {...register("phone")} className="form-input" placeholder="(11) 99999-9999" />
      </Field>
      <Field label="Veículo de interesse" error={errors.vehicleInterest?.message} className="sm:col-span-2">
        <input {...register("vehicleInterest")} className="form-input" placeholder="Ex: Toyota Corolla XEi" />
      </Field>
      <Field label="Valor de entrada (R$)" error={errors.downPayment?.message}>
        <input {...register("downPayment")} type="number" min={0} className="form-input" placeholder="30000" />
      </Field>
      <Field label="Prazo desejado (meses)" error={errors.termMonths?.message}>
        <select {...register("termMonths")} className="form-input">
          {Array.from({ length: (FINANCING.maxTermMonths - FINANCING.minTermMonths) / 12 + 1 }, (_, i) => FINANCING.minTermMonths + i * 12).map(
            (m) => (
              <option key={m} value={m}>
                {m}x
              </option>
            ),
          )}
        </select>
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded-lg bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-60 sm:col-span-2"
      >
        {isSubmitting ? "Enviando..." : "Enviar simulação para um consultor"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-sm font-medium text-ink-900">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-primary-600">{error}</span> : null}
    </label>
  );
}
