import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Check, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Game Diary" };

export default async function DiaryPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?callbackUrl=/diary");

  const entries = await prisma.diaryEntry.findMany({
    where: { userId: currentUser.id },
    orderBy: { playedDate: "desc" },
    include: {
      game: { select: { id: true, title: true, slug: true, coverUrl: true } },
    },
  });

  // Group by month
  const grouped = entries.reduce(
    (acc, entry) => {
      const key = new Date(entry.playedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {} as Record<string, typeof entries>
  );

  return (
    <div className="page-container max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-brand" />
            Game Diary
          </h1>
          <p className="text-gray-400 mt-1">{entries.length} play sessions logged</p>
        </div>
        <Link href="/games" className="btn-primary">
          Log a Game
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="card p-16 text-center">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Your diary is empty</h2>
          <p className="text-gray-400 mb-6">Start tracking your gaming sessions</p>
          <Link href="/games" className="btn-primary">Browse Games</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, monthEntries]) => (
            <section key={month}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-dark-border pb-2">
                {month}
              </h2>
              <div className="space-y-3">
                {monthEntries.map((entry) => (
                  <div key={entry.id} className="card-hover p-4 flex items-center gap-4">
                    <Link href={`/games/${entry.game.slug}`} className="flex-shrink-0">
                      <div className="relative w-12 h-16 rounded overflow-hidden border border-dark-border">
                        {entry.game.coverUrl ? (
                          <Image src={entry.game.coverUrl} alt={entry.game.title} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-dark-hover flex items-center justify-center text-xl">🎮</div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/games/${entry.game.slug}`} className="font-semibold text-white hover:text-brand transition-colors">
                        {entry.game.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500">{formatDate(entry.playedDate)}</span>
                        {entry.completed && (
                          <span className="flex items-center gap-1 text-xs text-green-400">
                            <Check className="w-3 h-3" /> Completed
                          </span>
                        )}
                        {entry.hoursPlayed && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" /> {entry.hoursPlayed}h
                          </span>
                        )}
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
