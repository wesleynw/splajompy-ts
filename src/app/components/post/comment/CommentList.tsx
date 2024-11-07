import { useEffect, useState } from "react";
import { InsertComment, SelectComment } from "@/db/schema";
import { Box, Typography, Skeleton } from "@mui/material";
import { getComments, insertComment } from "@/app/lib/actions";
import CommentInput from "./CommentInput";

interface CommentListProps {
  post_id: number;
}

export default function CommentList({ post_id }: Readonly<CommentListProps>) {
  const [comments, setComments] = useState<SelectComment[] | InsertComment[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getComments(post_id).then((comments) => {
      setComments(comments);
      setIsLoading(false);
    });
  }, [post_id]);

  const addComment = (text: string) => {
    const newComment: InsertComment = {
      user_id: 0,
      post_id: post_id,
      text: text,
    };
    setComments((prevComments) => [...prevComments, newComment]);
    insertComment(text, post_id);
  };

  return (
    <Box>
      <CommentInput onAddComment={addComment} />
      <Box sx={{ marginTop: 3 }}>
        {isLoading ? (
          <>
            <Skeleton
              variant="rectangular"
              height={40}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton
              variant="rectangular"
              height={40}
              sx={{ marginBottom: 2 }}
            />
            <Skeleton variant="rectangular" height={40} />
          </>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Box
              key={comment.comment_id}
              sx={{
                padding: 2,
                outline: "1px solid #ffffff",
              }}
            >
              <Typography variant="body2">{comment.text}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No comments yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
