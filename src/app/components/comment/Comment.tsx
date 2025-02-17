import { CommentWithLike } from "@/app/lib/comments";
import { RenderMentions } from "@/app/utils/mentions";
import { SelectUser } from "@/db/schema";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Linkify from "linkify-react";
import LikeButton from "../post/LikeButton";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

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
  const userTimezone = dayjs.tz.guess();
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
          <p className="text-sm font-bold">
            {dayjs.utc(comment.comment_date).tz(userTimezone).fromNow()}
          </p>
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
