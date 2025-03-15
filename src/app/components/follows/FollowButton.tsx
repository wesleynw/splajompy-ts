"use client";

import {
  followUser,
  isCurrentUserFollowing,
  unfollowUser,
} from "@/app/lib/follows";
import { useEffect, useState } from "react";
import Button from "../button/Button";

type Props = {
  user_id: number;
  show_unfollow: boolean;
};

export default function FollowButton({
  user_id,
  show_unfollow,
}: Readonly<Props>) {
  const [hasFollowed, setHasFollowed] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      const result = await isCurrentUserFollowing(user_id);
      setIsFollowing(result);
      setIsLoaded(true);
    };
    checkFollowingStatus();
  }, [user_id]);

  if (
    (isLoaded && isFollowing === null) ||
    (!show_unfollow && isFollowing && !hasFollowed)
  ) {
    return null;
  }

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isFollowing) {
        await unfollowUser(user_id);
        setIsFollowing(false);
      } else {
        await followUser(user_id);
        setIsFollowing(true);
        setHasFollowed(true);
      }
    } catch (error) {
      console.error("Failed to update follow status:", error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Button onClick={handleFollow}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
