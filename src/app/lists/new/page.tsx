export const dynamic = "force-dynamic";

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default function NewListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", isPublic: true });
  const [loading, setLoading] = useState(false);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("List title is required");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      toast.success("List created!");
      router.push(`/lists/${data.list.id}`);
    } else {
      const d = await res.json();
      toast.error(d.error ?? "Failed to create list");
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-8">Create New List</h1>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label" htmlFor="title">List Title *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Top 10 RPGs of All Time"
              className="input"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="label" htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What's this list about?"
              rows={4}
              className="input resize-none"
              maxLength={500}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-dark-border rounded-full peer peer-checked:bg-brand transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-300">Public list</span>
              <p className="text-xs text-gray-500">
                {form.isPublic ? "Visible to everyone" : "Only you can see this"}
              </p>
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1 justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 justify-center"
            >
              {loading ? "Creating…" : "Create List"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
