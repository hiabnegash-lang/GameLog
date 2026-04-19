"use client";

import { useState, useEffect } from "react";
import { Plus, Check, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import type { GameList } from "@/types";

interface AddToListButtonProps {
  gameId: string;
  userId: string;
}

export function AddToListButton({ gameId, userId }: AddToListButtonProps) {
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<GameList[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && lists.length === 0) {
      fetch(`/api/lists?userId=${userId}`)
        .then((r) => r.json())
        .then((data) => setLists(data.lists ?? []));
    }
  }, [open, userId, lists.length]);

  const addToList = async (listId: string, listTitle: string) => {
    setLoading(true);
    const res = await fetch(`/api/lists/${listId}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    });
    setLoading(false);

    if (res.ok) {
      toast.success(`Added to "${listTitle}"`);
    } else {
      const d = await res.json();
      toast.error(d.error ?? "Failed to add game");
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add to List
        </div>
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-11 left-0 right-0 card shadow-xl shadow-black/50 py-1 z-20 max-h-48 overflow-y-auto">
          {lists.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              <a href="/lists/new" className="text-brand hover:text-brand-light">
                Create your first list
              </a>
            </div>
          ) : (
            lists.map((list) => (
              <button
                key={list.id}
                onClick={() => addToList(list.id, list.title)}
                disabled={loading}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-dark-hover transition-colors text-left"
              >
                {list.title}
              </button>
            ))
          )}
          <hr className="border-dark-border my-1" />
          <a
            href="/lists/new"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-brand hover:text-brand-light hover:bg-dark-hover transition-colors"
          >
            <Plus className="w-4 h-4" /> New list
          </a>
        </div>
      )}
    </div>
  );
}
