"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MoreHorizontal, Trash2, Edit2, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { StaticStars } from "@/components/ui/StarRating";
import { formatRelative, truncate } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  showGame?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (review: Review) => void;
}

export function ReviewCard({ review, showGame = false, onDelete, onUpdate }: ReviewCardProps) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isOwner = user?.id === review.userId;

  const [liked, setLiked] = useState(review.likedByMe ?? false);
  const [likeCount, setLikeCount] = useState(review._count?.likes ?? 0);
  const [showFull, setShowFull] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [spoilerVisible, setSpoilerVisible] = useState(!review.hasSpoilers);

  const handleLike = async () => {
    if (!session) {
      toast.error("Sign in to like reviews");
      return;
    }
    const prev = liked;
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));

    const res = await fetch(`/api/reviews/${review.id}/like`, { method: "POST" });
    if (!res.ok) {
      setLiked(prev);
      setLikeCount((c) => (prev ? c + 1 : c - 1));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Review deleted");
      onDelete?.(review.id);
    } else {
      toast.error("Failed to delete review");
    }
    setMenuOpen(false);
  };

  const content = review.content;
  const isLong = content.length > 300;
  const displayContent = !spoilerVisible
    ? null
    : !showFull && isLong
    ? truncate(content, 300)
    : content;

  return (
    <div className="card-hover p-5 animate-fade-in">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link href={`/users/${review.user.username}`} className="flex-shrink-0">
          <Avatar
            src={review.user.avatarUrl}
            name={review.user.name ?? review.user.username}
            size="md"
          />
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/users/${review.user.username}`}
                  className="font-semibold text-white hover:text-brand transition-colors"
                >
                  {review.user.name ?? review.user.username}
                </Link>
                <span className="text-gray-500 text-sm">reviewed</span>
                {showGame && review.game && (
                  <Link
                    href={`/games/${review.game.slug}`}
                    className="font-semibold text-brand hover:text-brand-light transition-colors text-sm"
                  >
                    {review.game.title}
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <StaticStars rating={review.rating} size="sm" />
                <span className="text-xs text-gray-500">{formatRelative(review.createdAt)}</span>
              </div>
            </div>

            {/* Game cover (when showing game) */}
            {showGame && review.game?.coverUrl && (
              <Link href={`/games/${review.game.slug}`} className="flex-shrink-0">
                <div className="relative w-10 h-14 rounded overflow-hidden">
                  <Image src={review.game.coverUrl} alt={review.game.title} fill className="object-cover" />
                </div>
              </Link>
            )}
          </div>

          {/* Spoiler warning */}
          {review.hasSpoilers && !spoilerVisible && (
            <div
              className="mt-3 flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 cursor-pointer hover:bg-yellow-500/15 transition-colors"
              onClick={() => setSpoilerVisible(true)}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>This review contains spoilers. Click to reveal.</span>
            </div>
          )}

          {/* Content */}
          {spoilerVisible && (
            <div className="mt-3">
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {displayContent}
              </p>
              {isLong && (
                <button
                  onClick={() => setShowFull(!showFull)}
                  className="text-brand text-sm mt-1 hover:text-brand-light transition-colors"
                >
                  {showFull ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? "text-red-400" : "text-gray-500 hover:text-red-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-red-400" : ""}`} />
              <span>{likeCount > 0 ? likeCount : ""}</span>
            </button>

            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="btn-ghost p-1.5 rounded-lg"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 bottom-8 w-36 card shadow-xl py-1 z-10">
                    <button
                      onClick={handleDelete}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-dark-hover transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
