"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  gameId: string;
  gameTitle: string;
  existingReview?: { id: string; content: string; rating: number; hasSpoilers: boolean };
  onSuccess?: () => void;
}

export function ReviewForm({ gameId, gameTitle, existingReview, onSuccess }: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [content, setContent] = useState(existingReview?.content ?? "");
  const [hasSpoilers, setHasSpoilers] = useState(existingReview?.hasSpoilers ?? false);
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="card p-6 text-center">
        <p className="text-gray-400 mb-3">Sign in to write a review</p>
        <a href="/login" className="btn-primary">Sign In</a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (content.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      const url = existingReview ? `/api/reviews/${existingReview.id}` : "/api/reviews";
      const method = existingReview ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, content: content.trim(), rating, hasSpoilers }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to submit review");
        return;
      }

      toast.success(existingReview ? "Review updated!" : "Review posted!");
      router.refresh();
      onSuccess?.();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Your Rating for {gameTitle}</label>
        <div className="flex items-center gap-3 mt-1">
          <StarRating value={rating} onChange={setRating} size="lg" />
          {rating > 0 && (
            <span className="text-accent-gold font-semibold">{rating.toFixed(1)}</span>
          )}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="review-content">Review</label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What did you think of ${gameTitle}? Share your thoughts…`}
          rows={6}
          className={cn(
            "input resize-none",
            content.length > 0 && content.length < 10 && "border-red-500/50"
          )}
          maxLength={5000}
        />
        <div className="flex justify-between mt-1">
          <span className={cn("text-xs", content.length < 10 ? "text-gray-500" : "text-green-400")}>
            {content.length < 10 ? `${10 - content.length} more characters required` : ""}
          </span>
          <span className="text-xs text-gray-500">{content.length}/5000</span>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={hasSpoilers}
            onChange={(e) => setHasSpoilers(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-6 bg-dark-border rounded-full peer peer-checked:bg-brand transition-colors" />
          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
        </div>
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
          Contains spoilers
        </span>
      </label>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="btn-primary w-full justify-center py-2.5"
      >
        {loading ? "Posting…" : existingReview ? "Update Review" : "Post Review"}
      </button>
    </form>
  );
}
