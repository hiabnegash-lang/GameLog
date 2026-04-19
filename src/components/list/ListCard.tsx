import Link from "next/link";
import Image from "next/image";
import { Lock, Globe, List } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { formatRelative } from "@/lib/utils";
import type { GameList } from "@/types";

interface ListCardProps {
  list: GameList;
}

export function ListCard({ list }: ListCardProps) {
  const covers = list.items?.slice(0, 4).map((i) => i.game.coverUrl).filter(Boolean) ?? [];

  return (
    <Link href={`/lists/${list.id}`} className="group card-hover p-5 block">
      {/* Cover mosaic */}
      <div className="grid grid-cols-4 gap-1 mb-4 h-24 rounded-lg overflow-hidden">
        {covers.length > 0
          ? covers.map((url, i) => (
              <div key={i} className="relative bg-dark-hover">
                <Image src={url!} alt="" fill className="object-cover" />
              </div>
            ))
          : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-dark-hover flex items-center justify-center">
                <List className="w-4 h-4 text-gray-600" />
              </div>
            ))}
        {covers.length > 0 &&
          covers.length < 4 &&
          Array.from({ length: 4 - covers.length }).map((_, i) => (
            <div key={i} className="bg-dark-hover" />
          ))}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white group-hover:text-brand transition-colors line-clamp-1">
            {list.title}
          </h3>
          {list.isPublic ? (
            <Globe className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          ) : (
            <Lock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          )}
        </div>

        {list.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{list.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              src={list.user.avatarUrl}
              name={list.user.name ?? list.user.username}
              size="xs"
            />
            <span className="text-xs text-gray-400">{list.user.username}</span>
          </div>
          <span className="text-xs text-gray-500">
            {list._count?.items ?? list.items?.length ?? 0} games · {formatRelative(list.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
