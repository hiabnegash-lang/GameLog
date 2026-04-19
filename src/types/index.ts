export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  username: string;
  avatarUrl?: string | null;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  name?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
  _count: {
    reviews: number;
    followers: number;
    following: number;
    lists: number;
  };
  isFollowing?: boolean;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverUrl?: string | null;
  bannerUrl?: string | null;
  developer?: string | null;
  publisher?: string | null;
  releaseYear?: number | null;
  avgRating?: number | null;
  ratingCount: number;
  genres: { genre: { id: string; name: string; slug: string } }[];
  tags: { tag: { id: string; name: string; slug: string } }[];
  platforms: { platform: { id: string; name: string; slug: string } }[];
}

export interface Review {
  id: string;
  content: string;
  rating: number;
  hasSpoilers: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  gameId: string;
  user: {
    id: string;
    username: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
  game?: {
    id: string;
    title: string;
    slug: string;
    coverUrl?: string | null;
  };
  _count?: { likes: number };
  likedByMe?: boolean;
}

export interface DiaryEntry {
  id: string;
  playedDate: string;
  completed: boolean;
  notes?: string | null;
  hoursPlayed?: number | null;
  createdAt: string;
  userId: string;
  gameId: string;
  game: {
    id: string;
    title: string;
    slug: string;
    coverUrl?: string | null;
  };
}

export interface GameList {
  id: string;
  title: string;
  description?: string | null;
  isPublic: boolean;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    username: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
  items?: ListItem[];
  _count?: { items: number };
}

export interface ListItem {
  id: string;
  position: number;
  notes?: string | null;
  gameId: string;
  game: {
    id: string;
    title: string;
    slug: string;
    coverUrl?: string | null;
  };
}

export interface FeedItem {
  type: "review" | "diary" | "list";
  id: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name?: string | null;
    avatarUrl?: string | null;
  };
  game?: {
    id: string;
    title: string;
    slug: string;
    coverUrl?: string | null;
  };
  review?: Review;
  diaryEntry?: DiaryEntry;
  list?: GameList;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
