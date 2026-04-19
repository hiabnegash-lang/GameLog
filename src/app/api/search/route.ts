import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ games: [], users: [] });
  }

  const [games, users] = await Promise.all([
    prisma.game.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { developer: { contains: q, mode: "insensitive" } },
          { genres: { some: { genre: { name: { contains: q, mode: "insensitive" } } } } },
        ],
      },
      take: 10,
      orderBy: { avgRating: "desc" },
      include: {
        genres: { include: { genre: true }, take: 2 },
        tags: { include: { tag: true }, take: 2 },
        platforms: { include: { platform: true } },
      },
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5,
      select: { id: true, username: true, name: true, avatarUrl: true },
    }),
  ]);

  return NextResponse.json({ games, users });
}
