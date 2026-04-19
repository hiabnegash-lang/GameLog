import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Gamepad2, Building2, Users, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ReviewForm } from "@/components/review/ReviewForm";
import { StaticStars } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";
import { AddToListButton } from "@/components/game/AddToListButton";
import { DiaryButton } from "@/components/game/DiaryButton";

async function getGame(slug: string) {
  return prisma.game.findUnique({
    where: { slug },
    include: {
      genres: { include: { genre: true } },
      tags: { include: { tag: true } },
      platforms: { include: { platform: true } },
      reviews: {
        include: {
          user: { select: { id: true, username: true, name: true, avatarUrl: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const game = await getGame(params.id);
  if (!game) return { title: "Game Not Found" };
  return {
    title: game.title,
    description: game.description?.slice(0, 160) ?? `Reviews and ratings for ${game.title}`,
  };
}

export default async function GamePage({ params }: { params: { id: string } }) {
  const [game, currentUser] = await Promise.all([getGame(params.id), getCurrentUser()]);

  if (!game) notFound();

  const userReview = currentUser
    ? game.reviews.find((r) => r.userId === currentUser.id)
    : null;

  const reviewsWithMeta = await Promise.all(
    game.reviews.map(async (review) => {
      const liked = currentUser
        ? !!(await prisma.reviewLike.findUnique({
            where: { userId_reviewId: { userId: currentUser.id, reviewId: review.id } },
          }))
        : false;
      return { ...review, likedByMe: liked };
    })
  );

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: game.reviews.filter((r) => Math.round(r.rating) === star).length,
    pct:
      game.reviews.length > 0
        ? (game.reviews.filter((r) => Math.round(r.rating) === star).length / game.reviews.length) * 100
        : 0,
  }));

  return (
    <div>
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {game.bannerUrl || game.coverUrl ? (
          <>
            <Image
              src={game.bannerUrl ?? game.coverUrl!}
              alt={game.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-brand/20 to-dark-bg" />
        )}
      </div>

      <div className="page-container -mt-32 relative">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover Art */}
          <div className="flex-shrink-0">
            <div className="relative w-40 md:w-52 aspect-[3/4] rounded-xl overflow-hidden border-2 border-dark-border shadow-2xl shadow-black/60">
              {game.coverUrl ? (
                <Image src={game.coverUrl} alt={game.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-dark-card flex items-center justify-center text-6xl">🎮</div>
              )}
            </div>

            {/* Action Buttons */}
            {currentUser && (
              <div className="mt-4 space-y-2 w-40 md:w-52">
                <AddToListButton gameId={game.id} userId={currentUser.id} />
                <DiaryButton gameId={game.id} gameTitle={game.title} />
              </div>
            )}
          </div>

          {/* Game Info */}
          <div className="flex-1 pt-4 md:pt-24">
            <div className="flex flex-wrap gap-2 mb-2">
              {game.genres.map(({ genre }) => (
                <Link key={genre.id} href={`/games?genre=${genre.slug}`} className="badge-genre">
                  {genre.name}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{game.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 flex-wrap">
              {game.developer && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> {game.developer}
                </span>
              )}
              {game.releaseYear && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {game.releaseYear}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {game.ratingCount} ratings
              </span>
            </div>

            {/* Rating */}
            {game.avgRating && (
              <div className="flex items-center gap-3 mb-4 p-4 bg-dark-card rounded-xl border border-dark-border w-fit">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-gold">{game.avgRating.toFixed(1)}</div>
                  <div className="text-xs text-gray-500 mt-0.5">avg rating</div>
                </div>
                <div className="h-10 w-px bg-dark-border" />
                <div className="space-y-1">
                  {ratingDistribution.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 w-10 justify-end">
                        <span className="text-xs text-gray-400">{star}</span>
                        <Star className="w-3 h-3 text-accent-gold fill-accent-gold" />
                      </div>
                      <div className="w-24 h-1.5 bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent-gold rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-6">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {game.description && (
              <p className="prose-dark text-base max-w-2xl">{game.description}</p>
            )}

            {/* Tags */}
            {game.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {game.tags.map(({ tag }) => (
                  <Link key={tag.id} href={`/games?tag=${tag.slug}`} className="badge-tag hover:text-gray-200 transition-colors">
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Platforms */}
            {game.platforms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {game.platforms.map(({ platform }) => (
                  <span key={platform.id} className="badge bg-dark-hover text-gray-400 text-xs border border-dark-border">
                    {platform.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="section-title">
              Reviews{" "}
              <span className="text-gray-500 font-normal text-base">({game.reviews.length})</span>
            </h2>

            {reviewsWithMeta.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-400">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewsWithMeta.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={{
                      ...review,
                      createdAt: review.createdAt.toISOString(),
                      updatedAt: review.updatedAt.toISOString(),
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Write Review */}
          <div className="lg:col-span-1">
            <h2 className="section-title">
              {userReview ? "Your Review" : "Write a Review"}
            </h2>
            <div className="card p-5">
              <ReviewForm
                gameId={game.id}
                gameTitle={game.title}
                existingReview={
                  userReview
                    ? {
                        id: userReview.id,
                        content: userReview.content,
                        rating: userReview.rating,
                        hasSpoilers: userReview.hasSpoilers,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
