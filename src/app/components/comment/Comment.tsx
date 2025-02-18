import { CommentWithLike } from "@/app/lib/comments";
import { RenderMentions } from "@/app/utils/mentions";
import { SelectUser } from "@/db/schema";
import Linkify from "linkify-react";
import LikeButton from "../post/LikeButton";
import Timestamp from "../post/Timestamp";

type Props = {
  comment: CommentWithLike;
  user: SelectUser;
  toggleLike: () => void;
};

export default function Comment({
  comment,
  user,
  toggleLike,
}: Readonly<Props>) {
  const options = { defaultProtocol: "https", target: "_blank" };

  return (
    <div className="my-3 rounded-lg bg-neutral-800 p-3">
      <div className="flex w-full justify-between">
        <div>
          <p className="font-extrabold">@{user.username}</p>
          <div className="mb-3">
            <p className="font-normal break-all">
              <Linkify options={options}>
                <RenderMentions text={comment.text} />
              </Linkify>
            </p>
          </div>
          <Timestamp date={comment.comment_date} />
        </div>
        <LikeButton
          liked={comment.isLiked}
          toggleLike={toggleLike}
          isComment={true}
        />
      </div>
    </div>
  );
}
