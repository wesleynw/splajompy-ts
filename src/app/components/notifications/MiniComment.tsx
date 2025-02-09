import { RenderMentions } from "@/app/utils/mentions";
import { Comment } from "@/db/schema";

type Props = {
  comment: Comment;
};

export default function MiniComment({ comment }: Readonly<Props>) {
  return (
    <div className="my-2 rounded-md bg-neutral-700 p-2 transition-all group-hover:bg-neutral-600">
      <div className="font-bold">
        <RenderMentions text={comment.text} />
      </div>
    </div>
  );
}
