export const dynamic = "force-dynamic";

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Avatar } from "@/components/ui/Avatar";
import { Save } from "lucide-react";

export default function ProfileSettingsPage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  const [form, setForm] = useState({
    name: "",
    bio: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        bio: "",
        avatarUrl: user.avatarUrl ?? "",
      });
      // Load full profile
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            setForm({
              name: data.user.name ?? "",
              bio: data.user.bio ?? "",
              avatarUrl: data.user.avatarUrl ?? "",
            });
          }
        });
    }
  }, [user?.id]);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (status === "loading") {
    return <div className="page-container text-gray-400">Loading…</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      toast.success("Profile updated!");
      await update({ name: form.name, avatarUrl: form.avatarUrl });
      router.refresh();
    } else {
      const d = await res.json();
      toast.error(d.error ?? "Failed to update profile");
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

      <div className="card p-8">
        {/* Avatar preview */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-dark-border">
          <Avatar
            src={form.avatarUrl || null}
            name={form.name || user?.username || "U"}
            size="xl"
          />
          <div>
            <p className="text-white font-semibold">{user?.username}</p>
            <p className="text-sm text-gray-400 mt-0.5">@{user?.username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label" htmlFor="name">Display Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Your display name"
              className="input"
              maxLength={50}
            />
          </div>

          <div>
            <label className="label" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Tell the community about yourself, your gaming taste…"
              rows={4}
              className="input resize-none"
              maxLength={300}
            />
            <p className="text-xs text-gray-500 mt-1">{form.bio.length}/300</p>
          </div>

          <div>
            <label className="label" htmlFor="avatarUrl">Avatar URL</label>
            <input
              id="avatarUrl"
              type="url"
              value={form.avatarUrl}
              onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
              placeholder="https://example.com/avatar.jpg"
              className="input"
            />
            <p className="text-xs text-gray-500 mt-1">Paste a direct link to an image</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-2.5"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="card p-6 mt-6">
        <h2 className="font-semibold text-white mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Email</span>
            <span className="text-gray-300">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Username</span>
            <span className="text-gray-300">@{user?.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
