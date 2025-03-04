import { RelevantLikesData } from "@/app/lib/likes";
import { renderMentions } from "@/app/utils/mentions";

type Props = {
  relevant_likes: RelevantLikesData;
};

export default function OtherLikes({ relevant_likes }: Readonly<Props>) {
  if (relevant_likes.likes.length == 0 && !relevant_likes.hasOtherLikes) {
    return;
  }

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="w-fit"
    >
      Liked by{" "}
      {relevant_likes?.likes.reduce<React.ReactNode[]>((acc, like, index) => {
        const mention = renderMentions(
          `{tag:${like.user_id ?? ""}:${like.username}}`,
        );
        if (index === 0) {
          return [mention];
        } else if (index === 1) {
          if (
            relevant_likes.likes.length === 2 &&
            relevant_likes.hasOtherLikes
          ) {
            return [...acc, ", ", mention];
          }
          return [...acc, " and ", mention];
        } else {
          return [...acc, ", ", mention];
        }
      }, [])}
      {relevant_likes.hasOtherLikes &&
        (relevant_likes.likes.length === 0
          ? " others"
          : relevant_likes.likes.length === 1
            ? " and others"
            : ", and others")}
    </div>
  );
}
