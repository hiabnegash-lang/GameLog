"use client";

import { useState } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
}

export function FollowButton({ targetUserId, isFollowing: initialFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFollow = async () => {
    setLoading(true);
    const prevState = following;
    setFollowing(!following);

    const res = await fetch(`/api/users/${targetUserId}/follow`, { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      setFollowing(prevState);
      toast.error("Failed to update follow status");
      return;
    }

    const data = await res.json();
    setFollowing(data.following);
    toast.success(data.following ? "Following!" : "Unfollowed");
    router.refresh();
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={following ? "btn-secondary" : "btn-primary"}
    >
      {following ? (
        <>
          <UserMinus className="w-4 h-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          Follow
        </>
      )}
    </button>
  );
}
