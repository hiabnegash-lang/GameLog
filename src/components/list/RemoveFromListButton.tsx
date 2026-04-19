"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function RemoveFromListButton({ listId, gameId }: { listId: string; gameId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    if (!confirm("Remove this game from the list?")) return;
    setLoading(true);

    const res = await fetch(`/api/lists/${listId}/games`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Removed from list");
      router.refresh();
    } else {
      toast.error("Failed to remove game");
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="btn-ghost p-2 text-gray-500 hover:text-red-400 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
