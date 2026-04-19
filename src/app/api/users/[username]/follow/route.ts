import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: { username: string } }) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const target = await prisma.user.findUnique({ where: { username: params.username } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.id === currentUser.id) {
    return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: currentUser.id, followingId: target.id } },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId: currentUser.id, followingId: target.id } },
    });
    return NextResponse.json({ following: false });
  } else {
    await prisma.follow.create({
      data: { followerId: currentUser.id, followingId: target.id },
    });

    // Notify the user being followed
    await prisma.notification.create({
      data: {
        type: "follow",
        message: `${currentUser.username} started following you`,
        recipientId: target.id,
        data: { followerId: currentUser.id, followerUsername: currentUser.username },
      },
    });

    return NextResponse.json({ following: true });
  }
}
