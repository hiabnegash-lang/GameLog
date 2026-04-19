export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StaticStars } from "@/components/ui/StarRating";
import { SearchInput } from "@/components/search/SearchInput";

export const metadata: Metadata = { title: "Search Games" };

async function searchGames(query: string) {
  if (!query || query.length < 2) return [];
  return prisma.game.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { developer: { contains: query, mode: "insensitive" } },
        { publisher: { contains: query, mode: "insensitive" } },
        { genres: { some: { genre: { name: { contains: query, mode: "insensitive" } } } } },
      ],
    },
    take: 20,
    include: {
      genres: { include: { genre: true } },
      tags: { include: { tag: true } },
      platforms: { include: { platform: true } },
    },
    orderBy: { avgRating: "desc" },
  });
}

async function searchUsers(query: string) {
  if (!query || query.length < 2) return [];
  return prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 5,
    select: { id: true, username: true, name: true, avatarUrl: true },
  });
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? "";
  const [games, users] = query ? await Promise.all([searchGames(query), searchUsers(query)]) : [[], []];

  return (
    <div className="page-container max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Search</h1>
        <SearchInput initialValue={query} />
      </div>

      {!query && (
        <div className="card p-16 text-center">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Search for games, developers, or genres</p>
        </div>
      )}

      {query && games.length === 0 && users.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-gray-400">No results found for "{query}"</p>
          <Link href="/games" className="btn-secondary mt-4">Browse All Games</Link>
        </div>
      )}

      {users.length > 0 && (
        <section className="mb-8">
          <h2 className="section-title">Users</h2>
          <div className="space-y-2">
            {users.map((user) => (
              <Link key={user.id} href={`/users/${user.username}`} className="card-hover p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white text-sm font-semibold">
                  {(user.name ?? user.username)[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-white">{user.name ?? user.username}</div>
                  <div className="text-sm text-gray-400">@{user.username}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {games.length > 0 && (
        <section>
          <h2 className="section-title">Games ({games.length})</h2>
          <div className="space-y-3">
            {games.map((game) => (
              <Link key={game.id} href={`/games/${game.slug}`} className="card-hover p-4 flex items-center gap-4">
                <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden border border-dark-border">
                  {game.coverUrl ? (
                    <Image src={game.coverUrl} alt={game.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-dark-hover flex items-center justify-center text-xl">🎮</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white">{game.title}</h3>
                  <p className="text-sm text-gray-400">
                    {game.developer}{game.releaseYear ? ` · ${game.releaseYear}` : ""}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {game.avgRating && <StaticStars rating={game.avgRating} />}
                    <div className="flex gap-1">
                      {game.genres.slice(0, 2).map(({ genre }) => (
                        <span key={genre.id} className="badge-genre text-xs">{genre.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
