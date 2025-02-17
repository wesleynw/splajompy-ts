import { useComments } from "@/app/data/comments";
import { PublicUser } from "@/db/schema";
import Spinner from "../loading/Spinner";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

interface CommentListProps {
  user: PublicUser;
  post_id: number;
}

export default function CommentList({
  user,
  post_id,
}: Readonly<CommentListProps>) {
  const { isPending, comments, toggleLiked, addComment } = useComments(
    user,
    post_id,
  );

  const renderComments = () => {
    if (isPending) {
      return <Spinner />;
    }

    if (!comments) {
      return;
    }

    if (comments.length > 0) {
      return comments.map((comment) => (
        <Comment
          key={comment.comment.comment_id}
          comment={comment.comment}
          user={comment.user}
          toggleLike={() => toggleLiked(comment.comment.comment_id)}
        />
      ));
    }

    return <p className="text-center font-bold">No comments yet.</p>;
  };

  return (
    <>
      <CommentInput onAddComment={addComment} />
      <div className="mt-5">{renderComments()}</div>
    </>
  );
}
