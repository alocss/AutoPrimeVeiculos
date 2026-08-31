import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vehicleFormSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!vehicle) return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 });
  return NextResponse.json({ vehicle });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = vehicleFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { soldAt, photos, ...data } = parsed.data;

  const existing = await prisma.vehicle.findUnique({
    where: { id: params.id },
    select: { status: true, soldAt: true },
  });
  if (!existing) return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 });

  const nextSoldAt =
    data.status === "SOLD"
      ? new Date(soldAt ?? existing.soldAt ?? Date.now())
      : null;

  await prisma.vehiclePhoto.deleteMany({ where: { vehicleId: params.id } });
  const vehicle = await prisma.vehicle.update({
    where: { id: params.id },
    data: {
      ...data,
      soldAt: nextSoldAt,
      photos: { create: photos.map((url, index) => ({ url, order: index })) },
    },
  });

  return NextResponse.json({ id: vehicle.id, slug: vehicle.slug });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  await prisma.vehicle.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
