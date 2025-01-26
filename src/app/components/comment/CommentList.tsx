import { Box, Typography, Skeleton } from "@mui/material";

import CommentInput from "./CommentInput";
import Comment from "./Comment";
import { insertComment } from "@/app/lib/comments";
import { useComments } from "@/app/data/comments";

interface CommentListProps {
  post_id: number;
  poster_id: number;
  commentCount: number;
  setCommentCount: (count: number) => void;
}

export default function CommentList({
  post_id,
  poster_id,
  commentCount,
  setCommentCount,
}: Readonly<CommentListProps>) {
  const { isPending, comments, toggleLiked } = useComments(post_id);

  const addComment = async (text: string) => {
    const result = await insertComment(text, post_id, poster_id);
    const newComment = result?.[0];

    if (!newComment) {
      return;
    }

    setCommentCount(commentCount + 1);
  };

  const renderComments = () => {
    if (isPending) {
      return (
        <>
          <Skeleton variant="rounded" height={80} sx={{ marginBottom: 2 }} />
          <Skeleton variant="rounded" height={60} sx={{ marginBottom: 2 }} />
          <Skeleton variant="rounded" height={50} />
        </>
      );
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
      <CommentInput onAddComment={addComment} />
      <Box sx={{ marginTop: 3 }}>{renderComments()}</Box>
    </Box>
  );
}
