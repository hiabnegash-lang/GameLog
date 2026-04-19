import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Globe, Trash2, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { RemoveFromListButton } from "@/components/list/RemoveFromListButton";

async function getList(id: string) {
  return prisma.list.findUnique({
    where: { id },
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
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const list = await prisma.list.findUnique({
    where: { id: params.id },
    select: { title: true, description: true },
  });
  if (!list) return { title: "List Not Found" };
  return { title: list.title, description: list.description ?? undefined };
}

export default async function ListDetailPage({ params }: { params: { id: string } }) {
  const [list, currentUser] = await Promise.all([getList(params.id), getCurrentUser()]);

  if (!list) notFound();
  if (!list.isPublic && list.userId !== currentUser?.id) notFound();

  const isOwner = currentUser?.id === list.userId;

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="card p-6 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {list.isPublic ? (
                <Globe className="w-4 h-4 text-gray-500" />
              ) : (
                <Lock className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-xs text-gray-500">{list.isPublic ? "Public" : "Private"} list</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{list.title}</h1>
            {list.description && (
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{list.description}</p>
            )}
            <div className="flex items-center gap-3">
              <Link href={`/users/${list.user.username}`} className="flex items-center gap-2 group">
                <Avatar
                  src={list.user.avatarUrl}
                  name={list.user.name ?? list.user.username}
                  size="sm"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {list.user.name ?? list.user.username}
                </span>
              </Link>
              <span className="text-gray-600">·</span>
              <span className="text-xs text-gray-500">{formatDate(list.createdAt)}</span>
              <span className="text-gray-600">·</span>
              <span className="text-xs text-gray-500">{list.items.length} games</span>
            </div>
          </div>
        </div>
      </div>

      {/* Games */}
      {list.items.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 mb-4">No games in this list yet.</p>
          {isOwner && (
            <Link href="/games" className="btn-primary">
              <Plus className="w-4 h-4" />
              Browse Games
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {list.items.map((item, index) => (
            <div key={item.id} className="card-hover p-4 flex items-center gap-4">
              {/* Rank */}
              <div className="w-8 text-center font-bold text-2xl text-gray-600 flex-shrink-0">
                {index + 1}
              </div>

              {/* Cover */}
              <Link href={`/games/${item.game.slug}`} className="flex-shrink-0">
                <div className="relative w-12 h-16 rounded overflow-hidden border border-dark-border">
                  {(item.game as any).coverUrl ? (
                    <Image
                      src={(item.game as any).coverUrl}
                      alt={item.game.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-dark-hover flex items-center justify-center text-xl">🎮</div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/games/${item.game.slug}`} className="font-semibold text-white hover:text-brand transition-colors">
                  {item.game.title}
                </Link>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(item.game as any).genres?.slice(0, 2).map(({ genre }: any) => (
                    <span key={genre.id} className="badge-genre text-xs">{genre.name}</span>
                  ))}
                </div>
                {item.notes && (
                  <p className="text-xs text-gray-400 mt-1">{item.notes}</p>
                )}
              </div>

              {/* Remove button (owner only) */}
              {isOwner && (
                <RemoveFromListButton listId={list.id} gameId={item.gameId} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
