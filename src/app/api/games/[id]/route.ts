import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const game = await prisma.game.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: {
      genres: { include: { genre: true } },
      tags: { include: { tag: true } },
      platforms: { include: { platform: true } },
      reviews: {
        include: {
          user: { select: { id: true, username: true, name: true, avatarUrl: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });
  return NextResponse.json({ game });
}
