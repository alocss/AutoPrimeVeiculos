import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { vehicleStatusSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = vehicleStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { status, soldAt } = parsed.data;

  const vehicle = await prisma.vehicle.update({
    where: { id: params.id },
    data: {
      status,
      soldAt: status === "SOLD" ? new Date(soldAt ?? Date.now()) : null,
    },
  });

  return NextResponse.json({ id: vehicle.id, status: vehicle.status, soldAt: vehicle.soldAt });
}
