import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const updateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  const list = await prisma.list.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      items: {
        include: {
          game: {
            include: {
              genres: { include: { genre: true } },
              tags: { include: { tag: true } },
              platforms: { include: { platform: true } },
            },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!list) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (!list.isPublic && list.userId !== currentUser?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ list });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await prisma.list.findUnique({ where: { id: params.id } });
  if (!list) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (list.userId !== currentUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const data = updateSchema.parse(body);

  const updated = await prisma.list.update({ where: { id: params.id }, data });
  return NextResponse.json({ list: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const list = await prisma.list.findUnique({ where: { id: params.id } });
  if (!list) return NextResponse.json({ error: "List not found" }, { status: 404 });
  if (list.userId !== currentUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.list.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
