import { HeartIcon as HeartOutlinedIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
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
      {liked ? (
        <HeartIcon className={isComment ? "size-5" : "size-6"} />
      ) : (
        <HeartOutlinedIcon className={isComment ? "size-5" : "size-6"} />
      )}
    </button>
  );
}
