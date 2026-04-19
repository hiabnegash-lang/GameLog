import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const currentUser = await getCurrentUser();

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      _count: { select: { reviews: true, followers: true, following: true, lists: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const isFollowing = currentUser
    ? !!(await prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: currentUser.id, followingId: user.id },
        },
      }))
    : false;

  const { passwordHash, ...safeUser } = user;

  return NextResponse.json({ user: { ...safeUser, isFollowing } });
}
