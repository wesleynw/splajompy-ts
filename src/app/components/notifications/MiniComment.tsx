import { RenderMentions } from "@/app/utils/mentions";
import { Comment } from "@/db/schema";

type Props = {
  comment: Comment;
};

export default function MiniComment({ comment }: Readonly<Props>) {
  return (
    <div className="my-2 rounded-md border-1 border-neutral-500 p-2 transition-all">
      <div className="font-bold">
        <RenderMentions text={comment.text} />
      </div>
    </div>
  );
}
