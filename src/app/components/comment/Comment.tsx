import { CommentWithLike } from "@/app/lib/comments";
import { renderMentions } from "@/app/utils/mentions";
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
  const options = {
    defaultProtocol: "https",
    target: "_blank",
    className: "linkify-link",
    attributes: {
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
      },
    },
  };

  return (
    <div className="my-3 border-t-1 border-neutral-800 py-3">
      <div className="flex w-full justify-between">
        <div className="overflow-hidden break-words">
          <p className="font-extrabold">@{user.username}</p>
          <div className="mb-3">
            <Linkify as="p" options={options}>
              {renderMentions(comment.text)}
            </Linkify>
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
