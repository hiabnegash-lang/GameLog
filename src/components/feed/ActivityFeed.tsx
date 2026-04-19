import Link from "next/link";
import Image from "next/image";
import { Star, BookOpen, List as ListIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { StaticStars } from "@/components/ui/StarRating";
import { formatRelative, truncate } from "@/lib/utils";
import type { FeedItem } from "@/types";

interface ActivityFeedProps {
  items: FeedItem[];
  emptyMessage?: string;
}

export function ActivityFeed({ items, emptyMessage = "Nothing here yet." }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center card rounded-xl">
        <span className="text-5xl mb-4">🎮</span>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <FeedCard key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <div className="card-hover p-4 animate-fade-in">
      <div className="flex gap-3">
        <Link href={`/users/${item.user.username}`} className="flex-shrink-0">
          <Avatar
            src={item.user.avatarUrl}
            name={item.user.name ?? item.user.username}
            size="md"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-sm flex-wrap">
                <Link href={`/users/${item.user.username}`} className="font-semibold text-white hover:text-brand transition-colors">
                  {item.user.name ?? item.user.username}
                </Link>

                {item.type === "review" && (
                  <>
                    <span className="text-gray-500">reviewed</span>
                    {item.game && (
                      <Link href={`/games/${item.game.slug}`} className="font-medium text-brand hover:text-brand-light transition-colors">
                        {item.game.title}
                      </Link>
                    )}
                  </>
                )}

                {item.type === "diary" && (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-gray-500">logged</span>
                    {item.game && (
                      <Link href={`/games/${item.game.slug}`} className="font-medium text-brand hover:text-brand-light transition-colors">
                        {item.game.title}
                      </Link>
                    )}
                  </>
                )}

                {item.type === "list" && (
                  <>
                    <ListIcon className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-gray-500">created list</span>
                    {item.list && (
                      <Link href={`/lists/${item.list.id}`} className="font-medium text-brand hover:text-brand-light transition-colors">
                        {item.list.title}
                      </Link>
                    )}
                  </>
                )}
              </div>

              {item.type === "review" && item.review && (
                <div className="mt-1.5">
                  <StaticStars rating={item.review.rating} size="sm" />
                  {item.review.content && (
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {truncate(item.review.content, 150)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Game cover */}
            {item.game?.coverUrl && (
              <Link href={`/games/${item.game.slug}`} className="flex-shrink-0">
                <div className="relative w-10 h-14 rounded overflow-hidden border border-dark-border">
                  <Image src={item.game.coverUrl} alt={item.game.title} fill className="object-cover" />
                </div>
              </Link>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">{formatRelative(item.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
