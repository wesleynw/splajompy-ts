import { useEffect, useState } from "react";
import { SelectComment, SelectUser } from "@/db/schema";
import { Box, Typography, Skeleton, useTheme } from "@mui/material";
import { getComments, insertComment } from "@/app/lib/actions";
import CommentInput from "./CommentInput";

interface CommentListProps {
  post_id: number;
}

export default function CommentList({ post_id }: Readonly<CommentListProps>) {
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
            <Box
              key={comment.comments.comment_id}
              sx={{
                padding: 2,
                border: "1px solid",
                borderRadius: "8px",
                marginBottom: 2,
                ...theme.applyStyles("dark", {
                  borderColor: "borderColor",
                  backgroundColor: "backgroundColor",
                }),
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  ...theme.applyStyles("dark", {
                    color: "textPrimary",
                  }),
                }}
              >
                {comment.users.username}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginBottom: 1,
                  ...theme.applyStyles("dark", {
                    color: "textSecondary",
                  }),
                }}
              >
                {comment.comments.text}
              </Typography>
            </Box>
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
