import { VehicleForm } from "@/components/admin/VehicleForm";

export default function NovoVeiculoPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tighter text-ink-900">Novo veículo</h1>
      <p className="mt-1 text-sm text-ink-600">Preencha os dados para publicar no estoque.</p>

      <div className="mt-6 rounded-card border border-surface-border bg-white p-6">
        <VehicleForm />
      </div>
    </div>
  );
}
