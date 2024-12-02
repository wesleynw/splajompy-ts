import { useEffect, useState } from "react";
import { SelectComment, SelectUser } from "@/db/schema";
import { Box, Typography, Skeleton, useTheme } from "@mui/material";
import { getComments, insertComment } from "@/app/lib/actions";
import CommentInput from "./CommentInput";
import Comment from "./Comment";

interface CommentListProps {
  post_id: number;
  commentCount: number;
  setCommentCount: (count: number) => void;
}

export default function CommentList({
  post_id,
  commentCount,
  setCommentCount,
}: Readonly<CommentListProps>) {
  const theme = useTheme();
  const [comments, setComments] = useState<
    { users: SelectUser; comments: SelectComment }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getComments(post_id).then((comments) => {
      setComments(comments);
      setIsLoading(false);
    });
  }, [post_id]);

  const addComment = async (text: string) => {
    const result = await insertComment(text, post_id);
    const newComment = result?.[0];

    if (!newComment) {
      return;
    }

    setCommentCount(commentCount + 1);

    const formattedComment = {
      users: newComment.users,
      comments: newComment.comments,
    };

    setComments((prevComments) => [...prevComments, formattedComment]);
  };

  return (
    <Box>
      <CommentInput onAddComment={addComment} />
      <Box sx={{ marginTop: 3 }}>
        {isLoading ? (
          <>
            <Skeleton variant="rounded" height={80} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rounded" height={60} sx={{ marginBottom: 2 }} />
            <Skeleton variant="rounded" height={50} />
          </>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.comments.comment_id}
              comments={comment.comments} // TODO we can do this better
              users={comment.users}
            />
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{ ...theme.applyStyles("dark", { color: "textSecondary" }) }}
          >
            No comments yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
