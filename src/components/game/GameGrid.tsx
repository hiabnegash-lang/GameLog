import { GameCard } from "./GameCard";
import type { Game } from "@/types";

interface GameGridProps {
  games: Game[];
  emptyMessage?: string;
}

export function GameGrid({ games, emptyMessage = "No games found." }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🎮</span>
        <p className="text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="game-grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
