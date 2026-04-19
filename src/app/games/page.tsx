import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GameGrid } from "@/components/game/GameGrid";
import { Filter, SortAsc } from "lucide-react";

export const metadata: Metadata = { title: "Browse Games" };

interface SearchParams {
  genre?: string;
  tag?: string;
  platform?: string;
  sort?: string;
  q?: string;
}

async function getGames(params: SearchParams) {
  const where: any = {};

  if (params.q) {
    where.title = { contains: params.q, mode: "insensitive" };
  }
  if (params.genre) {
    where.genres = { some: { genre: { slug: params.genre } } };
  }
  if (params.tag) {
    where.tags = { some: { tag: { slug: params.tag } } };
  }
  if (params.platform) {
    where.platforms = { some: { platform: { slug: params.platform } } };
  }

  const orderBy: any =
    params.sort === "title"
      ? { title: "asc" }
      : params.sort === "year"
      ? { releaseYear: "desc" }
      : { avgRating: "desc" };

  return prisma.game.findMany({
    where,
    orderBy: [{ avgRating: "desc" }, { title: "asc" }],
    include: {
      genres: { include: { genre: true } },
      tags: { include: { tag: true } },
      platforms: { include: { platform: true } },
    },
  });
}

async function getFilters() {
  const [genres, tags, platforms] = await Promise.all([
    prisma.genre.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.platform.findMany({ orderBy: { name: "asc" } }),
  ]);
  return { genres, tags, platforms };
}

export default async function GamesPage({ searchParams }: { searchParams: SearchParams }) {
  const [games, filters] = await Promise.all([getGames(searchParams), getFilters()]);
  const { genres, tags, platforms } = filters;

  const activeGenre = searchParams.genre;
  const activeTag = searchParams.tag;

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          {searchParams.q
            ? `Results for "${searchParams.q}"`
            : searchParams.genre
            ? `${genres.find((g) => g.slug === searchParams.genre)?.name ?? ""} Games`
            : "Browse Games"}
        </h1>
        <span className="text-gray-400 text-sm">{games.length} games</span>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
          {/* Genres */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
              <Filter className="w-4 h-4" /> Genre
            </h3>
            <div className="space-y-1">
              <a
                href="/games"
                className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  !activeGenre
                    ? "bg-brand text-white font-medium"
                    : "text-gray-400 hover:text-white hover:bg-dark-hover"
                }`}
              >
                All Genres
              </a>
              {genres.map((genre) => (
                <a
                  key={genre.id}
                  href={`/games?genre=${genre.slug}`}
                  className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeGenre === genre.slug
                      ? "bg-brand text-white font-medium"
                      : "text-gray-400 hover:text-white hover:bg-dark-hover"
                  }`}
                >
                  {genre.name}
                </a>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <a
                  key={tag.id}
                  href={`/games?tag=${tag.slug}`}
                  className={`badge transition-colors ${
                    activeTag === tag.slug
                      ? "bg-brand/30 text-brand border-brand/40"
                      : "badge-tag hover:bg-dark-hover hover:text-gray-300"
                  }`}
                >
                  {tag.name}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Game Grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filters */}
          <div className="flex gap-2 mb-6 flex-wrap lg:hidden">
            {genres.map((genre) => (
              <a
                key={genre.id}
                href={`/games?genre=${genre.slug}`}
                className={`badge transition-colors ${
                  activeGenre === genre.slug ? "badge-genre" : "badge-tag hover:badge-genre"
                }`}
              >
                {genre.name}
              </a>
            ))}
          </div>

          <GameGrid games={games as any} />
        </div>
      </div>
    </div>
  );
}
