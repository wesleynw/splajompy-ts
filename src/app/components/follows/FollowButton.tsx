"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { followUser, isFollowingUser, unfollowUser } from "@/app/lib/follows";
import { Button, useTheme } from "@mui/material";
import { useFeed } from "@/app/data/FeedProvider";

type Props = {
  user_id: number;
  show_unfollow: boolean;
};

export default function FollowButton({
  user_id,
  show_unfollow,
}: Readonly<Props>) {
  const [hasFollowed, setHasFollowed] = useState(false);
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const theme = useTheme();

  const { refreshPosts } = useFeed();

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (session) {
        const result = await isFollowingUser(user_id);
        setIsFollowing(result);
        setIsLoaded(true);
      }
    };
    checkFollowingStatus();
  }, [session, user_id]);

  if (
    !session ||
    (isLoaded && isFollowing === null) ||
    (!show_unfollow && isFollowing && !hasFollowed)
  ) {
    return null;
  }

  const handleFollow = async (event: React.MouseEvent) => {
    event.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
      refreshPosts(session.user.user_id);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Button
      variant="contained"
      size="medium"
      onClick={handleFollow}
      disabled={loading}
      sx={{
        textTransform: "none",
        borderRadius: "20px",
        paddingX: 2,
        paddingY: 0.5,
        fontWeight: "bold",
        fontSize: "0.875rem",
        minWidth: "auto",
        backgroundColor: "#1DA1F2",
        color: "#ffffff",
        ...theme.applyStyles("dark", {
          backgroundColor: "#1DA1F2",
        }),
        "&:hover": {
          backgroundColor: "#0d8de6",
        },
      }}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
