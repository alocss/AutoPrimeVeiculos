"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(values: ContactFormValues) {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "CONTACT", ...values }),
    });

    if (res.ok) {
      toast.success("Mensagem enviada! Retornaremos em breve.");
      reset();
    } else {
      toast.error("Não conseguimos enviar sua mensagem. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Nome completo</span>
        <input {...register("name")} className="form-input" placeholder="Seu nome" />
        {errors.name ? <span className="mt-1 block text-xs text-primary-600">{errors.name.message}</span> : null}
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">E-mail</span>
        <input {...register("email")} type="email" className="form-input" placeholder="voce@email.com" />
        {errors.email ? <span className="mt-1 block text-xs text-primary-600">{errors.email.message}</span> : null}
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Telefone</span>
        <input {...register("phone")} className="form-input" placeholder="(11) 99999-9999" />
        {errors.phone ? <span className="mt-1 block text-xs text-primary-600">{errors.phone.message}</span> : null}
      </label>
      <label>
        <span className="mb-1.5 block text-sm font-medium text-ink-900">Mensagem</span>
        <textarea {...register("message")} rows={4} className="form-input resize-none" placeholder="Como podemos ajudar?" />
        {errors.message ? <span className="mt-1 block text-xs text-primary-600">{errors.message.message}</span> : null}
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
