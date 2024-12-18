"use client";

import React from "react";
import { likePost, unlikePost } from "@/app/lib/likes";
import { IconButton, Stack } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { PostType } from "@/app/data/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  poster_id,
  user_id,
  username,
}: Readonly<Props>) {
  const queryClient = useQueryClient();

  const mutationFn = liked
    ? () => unlikePost(post_id, user_id)
    : () => likePost(post_id, poster_id, user_id, username); // this is stupid

  const handleLike = useMutation({
    mutationFn: mutationFn,
    onMutate: async () => {
      // Optimistically update to the new value
      queryClient.setQueryData(["post", String(post_id)], (old: PostType) => ({
        ...old,
        liked: !liked,
      }));

      queryClient.setQueriesData(
        { queryKey: ["feed"] },
        (oldData: { pages: PostType[][] }) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.map((post) =>
                post.post_id === post_id ? { ...post, liked: !liked } : post
              )
            ),
          };
        }
      );
    },
  });

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton
        onClick={(e) => {
          e.preventDefault();
          handleLike.mutate();
        }}
      >
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Stack>
  );
}
