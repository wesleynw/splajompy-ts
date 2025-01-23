"use client";

import React from "react";
import { addLike, removeLike } from "@/app/lib/likes";
import { IconButton, Stack } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { PostType } from "@/app/data/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  liked: boolean;
  post_id: number;
  comment_id?: number;
};

export default function LikeButton({
  post_id,
  comment_id,
  liked,
}: Readonly<Props>) {
  const queryClient = useQueryClient();

  const mutationFn = liked
    ? () => removeLike(post_id, comment_id)
    : () => addLike(post_id, comment_id);

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
        disableRipple
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLike.mutate();
        }}
      >
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Stack>
  );
}
