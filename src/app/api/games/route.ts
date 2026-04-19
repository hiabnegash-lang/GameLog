import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const genre = searchParams.get("genre");
  const tag = searchParams.get("tag");
  const platform = searchParams.get("platform");
  const sort = searchParams.get("sort") ?? "rating";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where: any = {};
  if (q) where.title = { contains: q, mode: "insensitive" };
  if (genre) where.genres = { some: { genre: { slug: genre } } };
  if (tag) where.tags = { some: { tag: { slug: tag } } };
  if (platform) where.platforms = { some: { platform: { slug: platform } } };

  const orderBy: any =
    sort === "title" ? [{ title: "asc" }] : sort === "year" ? [{ releaseYear: "desc" }] : [{ avgRating: "desc" }, { ratingCount: "desc" }];

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        genres: { include: { genre: true } },
        tags: { include: { tag: true } },
        platforms: { include: { platform: true } },
      },
    }),
    prisma.game.count({ where }),
  ]);

  return NextResponse.json({ games, total, page, totalPages: Math.ceil(total / limit) });
}
