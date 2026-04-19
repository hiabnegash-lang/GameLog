export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reviewId = params.id;
  const userId = currentUser.id;

  const existing = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId, reviewId } },
  });

  if (existing) {
    await prisma.reviewLike.delete({ where: { userId_reviewId: { userId, reviewId } } });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.reviewLike.create({ data: { userId, reviewId } });

    // Notify review author
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, gameId: true, game: { select: { title: true } } },
    });
    if (review && review.userId !== userId) {
      await prisma.notification.create({
        data: {
          type: "review_like",
          message: `Someone liked your review of ${review.game.title}`,
          recipientId: review.userId,
          data: { reviewId, gameId: review.gameId },
        },
      });
    }

    return NextResponse.json({ liked: true });
  }
}
