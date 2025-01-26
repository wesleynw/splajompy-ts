import React from "react";
import { IconButton, Stack } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

type Props = {
  liked: boolean;
  post_id: number;
  comment_id?: number;
  toggleLike: () => void;
};

export default function LikeButton({ liked, toggleLike }: Readonly<Props>) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton
        disableRipple
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleLike();
        }}
      >
        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Stack>
  );
}
