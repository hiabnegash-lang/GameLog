import Link from "next/link";
import { Gamepad2, Star, Users, List, ArrowRight, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { GameCard } from "@/components/game/GameCard";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ActivityFeed } from "@/components/feed/ActivityFeed";
import type { Game, Review, FeedItem } from "@/types";

async function getTopGames() {
  return prisma.game.findMany({
    where: { avgRating: { not: null } },
    orderBy: { avgRating: "desc" },
    take: 12,
    include: {
      genres: { include: { genre: true } },
      tags: { include: { tag: true } },
      platforms: { include: { platform: true } },
    },
  });
}

async function getRecentReviews() {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      game: { select: { id: true, title: true, slug: true, coverUrl: true } },
      _count: { select: { likes: true } },
    },
  });
}

async function getFeed(userId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      user: { followers: { some: { followerId: userId } } },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      game: { select: { id: true, title: true, slug: true, coverUrl: true } },
      _count: { select: { likes: true } },
    },
  });

  return reviews.map(
    (r): FeedItem => ({
      type: "review",
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      user: r.user,
      game: r.game,
      review: {
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      } as any,
    })
  );
}

export default async function HomePage() {
  const currentUser = await getCurrentUser();
  const [topGames, recentReviews] = await Promise.all([getTopGames(), getRecentReviews()]);
  const feed = currentUser ? await getFeed(currentUser.id) : [];

  return (
    <div>
      {/* Hero */}
      {!currentUser && (
        <section className="relative overflow-hidden bg-gradient-to-b from-brand/10 via-dark-bg to-dark-bg border-b border-dark-border">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand/40">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Your Game,{" "}
              <span className="text-gradient">Your Story</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Track every game you play, share your reviews, discover what your friends are loving,
              and build the ultimate gaming diary.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/register" className="btn-primary text-base px-8 py-3 shadow-lg shadow-brand/30">
                Start Tracking Free
              </Link>
              <Link href="/games" className="btn-secondary text-base px-8 py-3">
                Browse Games
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-16">
              {[
                { icon: Gamepad2, label: "Games", value: "1,000+" },
                { icon: Star, label: "Reviews", value: "10K+" },
                { icon: Users, label: "Gamers", value: "5K+" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="page-container">
        {/* Feed for logged-in users */}
        {currentUser && feed.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">Friends' Activity</h2>
            </div>
            <ActivityFeed items={feed} />
          </section>
        )}

        {/* Top Rated Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand" />
              <h2 className="section-title mb-0">Top Rated Games</h2>
            </div>
            <Link href="/games" className="flex items-center gap-1 text-sm text-brand hover:text-brand-light transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="game-grid">
            {(topGames as any[]).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Recent Reviews */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-accent-gold" />
              <h2 className="section-title mb-0">Recent Reviews</h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(recentReviews as any[]).map((review) => (
              <ReviewCard
                key={review.id}
                review={{
                  ...review,
                  createdAt: review.createdAt.toISOString(),
                  updatedAt: review.updatedAt.toISOString(),
                }}
                showGame
              />
            ))}
          </div>
        </section>

        {/* CTA for guests */}
        {!currentUser && (
          <section className="card p-8 text-center bg-gradient-to-r from-brand/10 to-purple-500/10 border-brand/20">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to log your journey?</h2>
            <p className="text-gray-400 mb-6">
              Join thousands of gamers tracking their adventures, writing reviews, and discovering new favorites.
            </p>
            <Link href="/register" className="btn-primary text-base px-8 py-3">
              Create Free Account
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
