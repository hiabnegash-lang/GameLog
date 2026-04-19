import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await prisma.list.findUnique({ where: { id: params.id } });
  if (!list) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (list.userId !== currentUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { gameId } = await req.json();
  if (!gameId) return NextResponse.json({ error: "gameId required" }, { status: 400 });

  const existing = await prisma.listItem.findUnique({
    where: { listId_gameId: { listId: params.id, gameId } },
  });
  if (existing) return NextResponse.json({ error: "Game already in list" }, { status: 409 });

  const maxPos = await prisma.listItem.aggregate({
    where: { listId: params.id },
    _max: { position: true },
  });

  const item = await prisma.listItem.create({
    data: { listId: params.id, gameId, position: (maxPos._max.position ?? 0) + 1 },
  });

  return NextResponse.json({ item }, { status: 201 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await prisma.list.findUnique({ where: { id: params.id } });
  if (!list) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (list.userId !== currentUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { gameId } = await req.json();
  if (!gameId) return NextResponse.json({ error: "gameId required" }, { status: 400 });

  await prisma.listItem.delete({
    where: { listId_gameId: { listId: params.id, gameId } },
  });

  return NextResponse.json({ success: true });
}
