import { HeartStraight as HeartIcon } from "@phosphor-icons/react/dist/ssr";
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
    <button
      className="m-1.5"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike();
      }}
    >
      <HeartIcon
        className={isComment ? "size-5" : "size-7"}
        weight={liked ? "fill" : "regular"}
      />
    </button>
  );
}
