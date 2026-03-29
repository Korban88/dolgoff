import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  creditorName: z.string().min(1).optional(),
  debtType: z.string().min(1).optional(),
  currentBalance: z.number().positive().optional(),
  originalBalance: z.number().positive().optional().nullable(),
  interestRate: z.number().min(0).optional(),
  minimumPayment: z.number().min(0).optional(),
  paymentDay: z.number().int().min(1).max(31).optional().nullable(),
  isClosed: z.boolean().optional(),
});

async function getDebt(id: string, userId: string) {
  return prisma.debt.findFirst({ where: { id, userId } });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const debt = await getDebt(id, session.user.id);
  if (!debt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(debt);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getDebt(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const debt = await prisma.debt.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(debt);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getDebt(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.debt.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
