import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const debtSchema = z.object({
  creditorName: z.string().min(1),
  debtType: z.string().min(1),
  currentBalance: z.number().positive(),
  originalBalance: z.number().positive().optional(),
  interestRate: z.number().min(0),
  minimumPayment: z.number().min(0),
  paymentDay: z.number().int().min(1).max(31).optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const debts = await prisma.debt.findMany({
    where: { userId: session.user.id, isClosed: false },
    orderBy: { interestRate: "desc" },
  });

  return NextResponse.json(debts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = debtSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const debt = await prisma.debt.create({
    data: {
      ...parsed.data,
      userId: session.user.id,
    },
  });

  return NextResponse.json(debt, { status: 201 });
}
