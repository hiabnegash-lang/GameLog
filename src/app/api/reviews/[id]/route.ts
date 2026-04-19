import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const updateSchema = z.object({
  content: z.string().min(10).max(5000).optional(),
  rating: z.number().min(0.5).max(5).optional(),
  hasSpoilers: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const review = await prisma.review.findUnique({ where: { id: params.id } });
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  if (review.userId !== currentUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.review.update({
      where: { id: params.id },
      data,
      include: {
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        game: { select: { id: true, title: true, slug: true, coverUrl: true } },
        _count: { select: { likes: true } },
      },
    });

    if (data.rating !== undefined) {
      await prisma.rating.upsert({
        where: { userId_gameId: { userId: currentUser.id, gameId: review.gameId } },
        update: { value: data.rating },
        create: { userId: currentUser.id, gameId: review.gameId, value: data.rating },
      });
      await updateGameRating(review.gameId);
    }

    return NextResponse.json({ review: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const review = await prisma.review.findUnique({ where: { id: params.id } });
  if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  if (review.userId !== currentUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.review.delete({ where: { id: params.id } });
  await updateGameRating(review.gameId);

  return NextResponse.json({ success: true });
}

async function updateGameRating(gameId: string) {
  const ratings = await prisma.rating.findMany({ where: { gameId } });
  const avg = ratings.length > 0 ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length : null;
  await prisma.game.update({
    where: { id: gameId },
    data: {
      avgRating: avg !== null ? Math.round(avg * 10) / 10 : null,
      ratingCount: ratings.length,
    },
  });
}
