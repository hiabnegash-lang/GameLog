export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;

  // Get reviews from users the current user follows
  const reviews = await prisma.review.findMany({
    where: {
      user: { followers: { some: { followerId: currentUser.id } } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      game: { select: { id: true, title: true, slug: true, coverUrl: true } },
      _count: { select: { likes: true } },
    },
  });

  const feed = reviews.map((r) => ({
    type: "review" as const,
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    user: r.user,
    game: r.game,
    review: {
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    },
  }));

  return NextResponse.json({ feed });
}
