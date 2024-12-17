"use client";

import React from "react";
import { likePost, unlikePost } from "@/app/lib/likes";
import { IconButton, Stack } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { PostType } from "@/app/data/posts";

type Props = {
  post_id: number;
  liked: boolean;
  updatePost: (updatedPost: Partial<PostType>) => void;
  poster_id: number;
  user_id: number;
  username: string;
};

export default function LikeButton({
  post_id,
  liked,
  updatePost,
  poster_id,
  user_id,
  username,
}: Readonly<Props>) {
  const toggleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Optimistic update
    updatePost({ post_id, liked: !liked });

    try {
      if (liked) {
        await unlikePost(post_id, user_id);
      } else {
        await likePost(post_id, poster_id, user_id, username);
      }
    } catch {
      // Revert optimistic update on failure
      updatePost({ post_id, liked });
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
