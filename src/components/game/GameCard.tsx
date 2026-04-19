import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
  showRating?: boolean;
  className?: string;
}

export function GameCard({ game, showRating = true, className }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-dark-card border border-dark-border group-hover:border-brand/40 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-brand/10 group-hover:scale-[1.02]">
        {game.coverUrl ? (
          <Image
            src={game.coverUrl}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-hover">
            <span className="text-4xl">🎮</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Rating badge */}
        {showRating && game.avgRating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
            <Star className="w-3 h-3 text-accent-gold fill-accent-gold" />
            <span className="text-xs font-semibold text-white">{game.avgRating.toFixed(1)}</span>
          </div>
        )}

        {/* Title on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <p className="text-sm font-medium text-white line-clamp-2 leading-snug">{game.title}</p>
          {game.releaseYear && (
            <p className="text-xs text-gray-400 mt-0.5">{game.releaseYear}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function GameCardLarge({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.slug}`} className="group flex gap-4 card-hover p-4">
      <div className="relative w-16 h-20 flex-shrink-0 rounded-md overflow-hidden bg-dark-hover">
        {game.coverUrl ? (
          <Image src={game.coverUrl} alt={game.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🎮</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white group-hover:text-brand transition-colors line-clamp-1">
          {game.title}
        </h3>
        <p className="text-sm text-gray-400 mt-0.5">
          {game.developer}{game.releaseYear ? ` · ${game.releaseYear}` : ""}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          {game.avgRating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent-gold fill-accent-gold" />
              <span className="text-sm text-accent-gold font-medium">{game.avgRating.toFixed(1)}</span>
            </div>
          )}
          <div className="flex gap-1 flex-wrap">
            {game.genres.slice(0, 2).map(({ genre }) => (
              <span key={genre.id} className="badge-genre text-xs">{genre.name}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
