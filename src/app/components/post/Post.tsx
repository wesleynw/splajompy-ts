import { EnhancedPost } from "@/app/lib/posts";
import { PublicUser } from "@/db/schema";
import { useRouter } from "next/navigation";
import CommentCount from "../comment/CommentCount";
import CommentList from "../comment/CommentList";
import FollowButton from "../follows/FollowButton";
import ImageCarousel from "./images/ImageCarousel";
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
  displayName,
  date,
  text,
  images,
  comment_count,
  relevant_likes,
  liked,
  toggleLiked,
  standaloneView = false,
}: Readonly<Props>) {
  const router = useRouter();

  return (
    <div
      className="w-full border-t-1 border-neutral-800 p-6 transition-all last:border-b-1 hover:cursor-pointer sm:border-x-1"
      onClick={() => router.push(`/post/${post_id}`)}
    >
      <div className="relative flex flex-row justify-end">
        <div className="absolute top-0 right-0">
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
          className="text-left"
        >
          {displayName ? (
            <>
              <p className="text-xl font-black break-words hover:underline">
                {displayName}
              </p>
              <p className="text-base font-bold text-neutral-400 hover:underline">
                @{author}
              </p>
            </>
          ) : (
            <p className="text-lg font-black text-neutral-300 hover:underline">
              @{author}
            </p>
          )}
        </button>
        <div className="grow"></div>
      </div>

      <PostTextContent text={text} />

      <ImageCarousel images={images} />

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
