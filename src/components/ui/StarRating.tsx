"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function StarRating({ value = 0, onChange, readOnly = false, size = "md", showValue = false }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const starSize = sizeMap[size];
  const display = hover ?? value;

  const handleClick = (starValue: number) => {
    if (!readOnly && onChange) onChange(starValue);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = display >= star;
          const halfFilled = display >= star - 0.5 && display < star;

          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => handleClick(star)}
              onMouseEnter={() => !readOnly && setHover(star)}
              onMouseLeave={() => !readOnly && setHover(null)}
              className={cn(
                "transition-transform duration-75",
                !readOnly && "hover:scale-110 cursor-pointer",
                readOnly && "cursor-default"
              )}
            >
              <Star
                className={cn(
                  starSize,
                  "transition-colors duration-75",
                  filled ? "text-accent-gold fill-accent-gold" : "text-gray-600 fill-transparent"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && value > 0 && (
        <span className="text-sm text-accent-gold font-medium ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  );
}

export function StaticStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const starSize = sizeMap[size];
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            starSize,
            rating >= star
              ? "text-accent-gold fill-accent-gold"
              : rating >= star - 0.5
              ? "text-accent-gold fill-accent-gold/50"
              : "text-gray-600 fill-transparent"
          )}
        />
      ))}
    </div>
  );
}
