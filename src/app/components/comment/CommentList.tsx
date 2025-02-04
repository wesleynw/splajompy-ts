import { useComments } from "@/app/data/comments";
import { PublicUser } from "@/db/schema";
import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
    post_id
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

    return (
      <Typography variant="body2" sx={{ color: "textSecondary" }}>
        No comments yet.
      </Typography>
    );
  };

  return (
    <Box>
      <Divider sx={{ marginY: "10px" }} />
      <CommentInput onAddComment={addComment} />
      <Box sx={{ marginTop: 3 }}>{renderComments()}</Box>
    </Box>
  );
}
