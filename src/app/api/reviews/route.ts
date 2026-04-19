import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  gameId: z.string().min(1),
  content: z.string().min(10).max(5000),
  rating: z.number().min(0.5).max(5),
  hasSpoilers: z.boolean().default(false),
});

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.review.findUnique({
      where: { userId_gameId: { userId: currentUser.id, gameId: data.gameId } },
    });
    if (existing) {
      return NextResponse.json({ error: "You have already reviewed this game" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: { ...data, userId: currentUser.id },
      include: {
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        game: { select: { id: true, title: true, slug: true, coverUrl: true } },
        _count: { select: { likes: true } },
      },
    });

    // Upsert rating and update game's avg rating
    await prisma.rating.upsert({
      where: { userId_gameId: { userId: currentUser.id, gameId: data.gameId } },
      update: { value: data.rating },
      create: { userId: currentUser.id, gameId: data.gameId, value: data.rating },
    });

    await updateGameRating(data.gameId);

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error("Create review error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");
  const userId = searchParams.get("userId");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  const where: any = {};
  if (gameId) where.gameId = gameId;
  if (userId) where.userId = userId;

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      game: { select: { id: true, title: true, slug: true, coverUrl: true } },
      _count: { select: { likes: true } },
    },
  });

  return NextResponse.json({ reviews });
}

async function updateGameRating(gameId: string) {
  const ratings = await prisma.rating.findMany({ where: { gameId } });
  if (ratings.length === 0) return;

  const avg = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
  await prisma.game.update({
    where: { id: gameId },
    data: { avgRating: Math.round(avg * 10) / 10, ratingCount: ratings.length },
  });
}
