import { EnhancedPost } from "@/app/lib/posts";
import { PublicUser } from "@/db/schema";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CommentCount from "../comment/CommentCount";
import CommentList from "../comment/CommentList";
import FollowButton from "../follows/FollowButton";
import ImageModal from "./images/ImageModal";
import ResponsiveImage from "./images/ResponsiveImage";
import LikeButton from "./LikeButton";
import OtherLikes from "./OtherLikes";
import PostDropdown from "./PostDropdown";
import PostTextContent from "./PostTextContent";
import ShareButton from "./ShareButton";
import Timestamp from "./Timestamp";

type Props = EnhancedPost & {
  user: PublicUser;
  toggleLiked: () => void;
  standaloneView?: boolean;
};

export default function Post({
  post_id,
  user,
  user_id,
  author,
  date,
  text,
  image_blob_url,
  image_width,
  image_height,
  comment_count,
  relevant_likes,
  liked,
  toggleLiked,
  standaloneView = false,
}: Readonly<Props>) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <div
      className="m-1.5 w-full rounded-lg bg-neutral-900 p-6 transition-all hover:cursor-pointer"
      onClick={() => router.push(`/post/${post_id}`)}
    >
      <div className="relative">
        <div className="absolute right-0">
          {user.user_id === user_id ? (
            <PostDropdown post_id={post_id} />
          ) : (
            standaloneView && (
              <FollowButton user_id={user_id} show_unfollow={false} />
            )
          )}
        </div>
      </div>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/user/${author}`);
          }}
        >
          <p className="font-bold text-neutral-400 hover:underline">
            @{author}
          </p>
        </button>
        <div className="grow"></div>
      </div>

      <PostTextContent text={text} />

      {image_blob_url && image_height && image_width && (
        <div>
          <ResponsiveImage
            imagePath={image_blob_url}
            width={image_width}
            height={image_height}
            setOpen={setOpen}
          />
          <ImageModal
            imagePath={image_blob_url}
            imageWidth={image_width}
            imageHeight={image_height}
            open={open}
            handleClose={handleClose}
          />
        </div>
      )}

      <div className="flex flex-row content-center justify-center">
        <Timestamp date={date} />
        <div className="grow"></div>
        {standaloneView && <ShareButton />}
        <div className="w-5"></div>
        <CommentCount count={comment_count} />
        <LikeButton liked={liked} toggleLike={toggleLiked} />
      </div>

      <OtherLikes relevant_likes={relevant_likes} />

      {standaloneView && <CommentList post_id={post_id} user={user} />}
    </div>
  );
}
