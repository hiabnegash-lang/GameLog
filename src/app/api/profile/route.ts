export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().max(50).optional(),
  bio: z.string().max(300).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      _count: { select: { reviews: true, followers: true, following: true, lists: true } },
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: data.name || null,
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
      },
      select: { id: true, username: true, name: true, bio: true, avatarUrl: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
