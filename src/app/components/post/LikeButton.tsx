"use client";

import React from "react";
import { likePost, unlikePost } from "@/app/lib/likes";
import { IconButton, Stack } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

type Props = {
  post_id: number;
  user_id: number;
  liked: boolean;
  setLiked: (liked: boolean) => void;
};

export default function LikeButton({
  post_id,
  user_id,
  liked,
  setLiked,
}: Readonly<Props>) {
  const toggleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      if (liked) {
        setLiked(false);
        await unlikePost(post_id, user_id);
      } else {
        setLiked(true);
        await likePost(post_id, user_id);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton onClick={toggleLike}>
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Stack>
  );
}
