import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, Star, List, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ListCard } from "@/components/list/ListCard";
import { FollowButton } from "@/components/user/FollowButton";
import { formatDate, pluralize } from "@/lib/utils";

async function getUser(username: string, currentUserId?: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: { reviews: true, followers: true, following: true, lists: true },
      },
    },
  });

  if (!user) return null;

  const isFollowing = currentUserId
    ? !!(await prisma.follow.findUnique({
        where: { followerId_followingId: { followerId: currentUserId, followingId: user.id } },
      }))
    : false;

  return { ...user, isFollowing };
}

async function getUserReviews(userId: string) {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      game: { select: { id: true, title: true, slug: true, coverUrl: true } },
      _count: { select: { likes: true } },
    },
  });
}

async function getUserLists(userId: string) {
  return prisma.list.findMany({
    where: { userId, isPublic: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      items: {
        take: 4,
        include: { game: { select: { id: true, title: true, slug: true, coverUrl: true } } },
        orderBy: { position: "asc" },
      },
      _count: { select: { items: true } },
    },
  });
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const user = await prisma.user.findUnique({ where: { username: params.username } });
  if (!user) return { title: "User Not Found" };
  return { title: `${user.name ?? user.username}'s Profile` };
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const currentUser = await getCurrentUser();
  const [user, reviews, lists] = await Promise.all([
    getUser(params.username, currentUser?.id),
    getUserReviews(
      (await prisma.user.findUnique({ where: { username: params.username } }))?.id ?? ""
    ),
    getUserLists(
      (await prisma.user.findUnique({ where: { username: params.username } }))?.id ?? ""
    ),
  ]);

  if (!user) notFound();

  const isOwnProfile = currentUser?.id === user.id;

  const stats = [
    { icon: Star, label: "Reviews", value: user._count.reviews },
    { icon: Users, label: "Followers", value: user._count.followers },
    { icon: Users, label: "Following", value: user._count.following },
    { icon: List, label: "Lists", value: user._count.lists },
  ];

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar
            src={user.avatarUrl}
            name={user.name ?? user.username}
            size="xl"
          />

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.name ?? user.username}
                </h1>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>

              {!isOwnProfile && currentUser && (
                <FollowButton
                  targetUserId={user.id}
                  isFollowing={user.isFollowing}
                />
              )}
              {isOwnProfile && (
                <Link href="/profile" className="btn-secondary">
                  Edit Profile
                </Link>
              )}
            </div>

            {user.bio && (
              <p className="text-gray-300 text-sm mt-3 max-w-xl leading-relaxed">{user.bio}</p>
            )}

            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-3">
              <Calendar className="w-3.5 h-3.5" />
              Joined {formatDate(user.createdAt)}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-4">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-lg font-bold text-white">{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Reviews */}
        <div className="lg:col-span-2">
          <h2 className="section-title">
            Recent Reviews
            <span className="text-gray-500 font-normal text-sm ml-2">({reviews.length})</span>
          </h2>

          {reviews.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-400">No reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
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
          )}
        </div>

        {/* Lists */}
        <div>
          <h2 className="section-title">Lists</h2>
          {lists.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-gray-400 text-sm">No public lists yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lists.map((list) => (
                <ListCard key={list.id} list={list as any} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
