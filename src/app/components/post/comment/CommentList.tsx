import { Box, Typography } from "@mui/material";

interface CommentListProps {
  comments: string[];
}

export default function CommentList({ comments }: CommentListProps) {
  return (
    <Box sx={{ marginTop: 3 }}>
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <Box
            key={index}
            sx={{
              padding: 2,
              outline: "1px solid #ffffff",
            }}
          >
            <Typography variant="body2">{comment}</Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No comments yet.
        </Typography>
      )}
    </Box>
  );
}
