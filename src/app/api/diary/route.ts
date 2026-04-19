import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  gameId: z.string().min(1),
  playedDate: z.string(),
  completed: z.boolean().default(false),
  hoursPlayed: z.number().positive().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const entry = await prisma.diaryEntry.create({
      data: {
        ...data,
        playedDate: new Date(data.playedDate),
        userId: currentUser.id,
      },
      include: {
        game: { select: { id: true, title: true, slug: true, coverUrl: true } },
      },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 });
    }
    console.error("Diary create error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") ?? currentUser.id;

  // Only allow viewing other users' diary if they exist
  const entries = await prisma.diaryEntry.findMany({
    where: { userId },
    orderBy: { playedDate: "desc" },
    include: {
      game: { select: { id: true, title: true, slug: true, coverUrl: true } },
    },
  });

  return NextResponse.json({ entries });
}

export async function DELETE(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const entry = await prisma.diaryEntry.findUnique({ where: { id } });
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (entry.userId !== currentUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.diaryEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
