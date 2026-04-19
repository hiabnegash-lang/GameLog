export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ListCard } from "@/components/list/ListCard";

export const metadata: Metadata = { title: "Lists" };

async function getLists() {
  return prisma.list.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
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

export default async function ListsPage() {
  const [lists, currentUser] = await Promise.all([getLists(), getCurrentUser()]);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Game Lists</h1>
          <p className="text-gray-400 mt-1">Curated collections from the GameLog community</p>
        </div>
        {currentUser && (
          <Link href="/lists/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            New List
          </Link>
        )}
      </div>

      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4">📋</span>
          <h2 className="text-xl font-semibold text-white mb-2">No lists yet</h2>
          <p className="text-gray-400 mb-6">Be the first to create a curated game list!</p>
          {currentUser ? (
            <Link href="/lists/new" className="btn-primary">Create First List</Link>
          ) : (
            <Link href="/register" className="btn-primary">Sign Up Free</Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <ListCard key={list.id} list={list as any} />
          ))}
        </div>
      )}
    </div>
  );
}
