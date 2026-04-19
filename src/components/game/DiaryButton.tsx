"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";

interface DiaryButtonProps {
  gameId: string;
  gameTitle: string;
}

export function DiaryButton({ gameId, gameTitle }: DiaryButtonProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    playedDate: new Date().toISOString().slice(0, 10),
    completed: false,
    hoursPlayed: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/diary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        playedDate: form.playedDate,
        completed: form.completed,
        hoursPlayed: form.hoursPlayed ? parseFloat(form.hoursPlayed) : null,
        notes: form.notes || null,
      }),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Added to diary!");
      setOpen(false);
    } else {
      const d = await res.json();
      toast.error(d.error ?? "Failed to log entry");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary w-full justify-start">
        <BookOpen className="w-4 h-4" />
        Log Play
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`Log: ${gameTitle}`} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Date Played</label>
            <input
              type="date"
              value={form.playedDate}
              onChange={(e) => setForm((f) => ({ ...f, playedDate: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Hours Played (optional)</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.hoursPlayed}
              onChange={(e) => setForm((f) => ({ ...f, hoursPlayed: e.target.value }))}
              placeholder="e.g., 12.5"
              className="input"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={(e) => setForm((f) => ({ ...f, completed: e.target.checked }))}
              className="w-4 h-4 rounded border-dark-border accent-brand"
            />
            <span className="text-sm text-gray-300">Completed this game</span>
          </label>

          <div>
            <label className="label">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Any thoughts on this session?"
              rows={3}
              className="input resize-none"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? "Logging…" : "Log Play Session"}
          </button>
        </form>
      </Modal>
    </>
  );
}
