export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
});

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const list = await prisma.list.create({
      data: { ...data, userId: currentUser.id },
      include: {
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        _count: { select: { items: true } },
      },
    });

    return NextResponse.json({ list }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const currentUser = await getCurrentUser();

  const where: any = {};
  if (userId) {
    where.userId = userId;
    // Only show private lists to the owner
    if (userId !== currentUser?.id) where.isPublic = true;
  } else {
    where.isPublic = true;
  }

  const lists = await prisma.list.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      items: {
        take: 4,
        include: { game: { select: { id: true, title: true, slug: true, coverUrl: true } } },
        orderBy: { position: "asc" },
      },
      _count: { select: { items: true } },
    },
  });

  return NextResponse.json({ lists });
}
