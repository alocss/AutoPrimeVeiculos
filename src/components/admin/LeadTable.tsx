"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import type { LeadType } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { LEAD_TYPE_LABEL } from "@/lib/constants";
import { vehicleTitle, cn } from "@/lib/utils";
import { whatsappReplyToLeadLink } from "@/lib/whatsapp";

type LeadRow = {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  payload: Record<string, unknown> | null;
  vehicle: { brand: string; model: string; version: string; slug: string } | null;
  createdAtLabel: string;
};

const TYPE_TONE: Record<LeadType, "primary" | "success" | "outline" | "neutral"> = {
  FINANCING: "primary",
  SELL: "success",
  CONTACT: "outline",
  INTEREST: "neutral",
};

const PAYLOAD_FIELD_LABEL: Record<string, string> = {
  cpf: "CPF",
  vehicleInterest: "Veículo de interesse",
  downPayment: "Entrada",
  termMonths: "Prazo (meses)",
  brand: "Marca",
  model: "Modelo",
  year: "Ano",
  km: "Quilometragem",
  condition: "Estado de conservação",
  photoCount: "Fotos anexadas",
};

const FILTERS: { value: "ALL" | LeadType; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "FINANCING", label: "Financiamento" },
  { value: "SELL", label: "Venda de veículo" },
  { value: "CONTACT", label: "Contato" },
];

export function LeadTable({ leads }: { leads: LeadRow[] }) {
  const [filter, setFilter] = useState<"ALL" | LeadType>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "ALL" ? leads : leads.filter((l) => l.type === filter)),
    [leads, filter],
  );

  if (leads.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-surface-border bg-white py-16 text-center">
        <p className="text-ink-600">Nenhum lead recebido ainda.</p>
        <p className="mt-1 text-sm text-ink-400">
          Mensagens dos formulários de contato, financiamento e venda de veículo aparecem aqui.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-primary-500 bg-primary-50 text-primary-600"
                : "border-surface-border text-ink-600 hover:border-ink-900/30",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-surface-border bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-surface-border text-left text-xs font-semibold uppercase text-ink-400">
              <th className="p-3">Recebido em</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Nome</th>
              <th className="p-3">Contato</th>
              <th className="p-3">Mensagem</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filtered.map((lead) => {
              const expanded = expandedId === lead.id;
              const hasDetails = lead.payload && Object.keys(lead.payload).length > 0;

              return (
                <Fragment key={lead.id}>
                  <tr>
                    <td className="whitespace-nowrap p-3 tabular-nums text-ink-600">{lead.createdAtLabel}</td>
                    <td className="p-3">
                      <Badge tone={TYPE_TONE[lead.type]}>{LEAD_TYPE_LABEL[lead.type]}</Badge>
                    </td>
                    <td className="p-3 font-medium text-ink-900">{lead.name}</td>
                    <td className="p-3 text-ink-600">
                      <div>{lead.phone}</div>
                      <div className="text-xs text-ink-400">{lead.email}</div>
                    </td>
                    <td className="max-w-xs p-3 text-ink-600">
                      <p className="line-clamp-2">{lead.message || "—"}</p>
                      {lead.vehicle ? (
                        <Link
                          href={`/veiculos/${lead.vehicle.slug}`}
                          target="_blank"
                          className="mt-1 inline-block text-xs font-medium text-primary-600 hover:underline"
                        >
                          {vehicleTitle(lead.vehicle)}
                        </Link>
                      ) : null}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-3">
                        <a
                          href={whatsappReplyToLeadLink(lead.name, lead.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-success hover:underline"
                        >
                          WhatsApp
                        </a>
                        {hasDetails ? (
                          <button
                            type="button"
                            onClick={() => setExpandedId(expanded ? null : lead.id)}
                            className="text-sm font-medium text-ink-600 hover:text-primary-600"
                          >
                            {expanded ? "Ocultar" : "Detalhes"}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  {expanded && lead.payload ? (
                    <tr>
                      <td colSpan={6} className="bg-surface-muted p-4">
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                          {Object.entries(lead.payload).map(([key, value]) => (
                            <div key={key}>
                              <dt className="text-xs font-semibold uppercase text-ink-400">
                                {PAYLOAD_FIELD_LABEL[key] ?? key}
                              </dt>
                              <dd className="text-sm text-ink-900">{String(value)}</dd>
                            </div>
                          ))}
                        </dl>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
