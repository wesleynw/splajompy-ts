import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton, Stack } from "@mui/material";
import React from "react";

type Props = {
  isComment?: boolean;
  liked: boolean;
  toggleLike: () => void;
};

export default function LikeButton({
  isComment = false,
  liked,
  toggleLike,
}: Readonly<Props>) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton
        disableRipple
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleLike();
        }}
        color="primary"
      >
        {liked ? (
          <FavoriteIcon fontSize={isComment ? "small" : "medium"} />
        ) : (
          <FavoriteBorderIcon fontSize={isComment ? "small" : "medium"} />
        )}
      </IconButton>
    </Stack>
  );
}
