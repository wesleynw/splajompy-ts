import { Box, Button } from "@mui/material";
import { useState } from "react";
import { TextInput } from "../post/new/TextInput";

interface Props {
  onAddComment: (text: string) => void;
}

export default function CommentInput({ onAddComment }: Readonly<Props>) {
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(comment);
      setComment("");
    }
  };

  return (
    <Box sx={{ marginTop: 3 }}>
      <Box sx={{ marginBottom: 2 }}>
        <TextInput
          placeholder="Add a comment..."
          value={comment}
          setTextValue={setComment}
        />
      </Box>
      <Button
        variant="contained"
        onClick={handleAddComment}
        disabled={!comment.trim()}
        sx={{
          borderRadius: "24px",
          padding: "8px 24px",
          textTransform: "none",
          backgroundColor: "#424242",
          color: "white",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#ffffff",
            color: "#424242",
          },
          "&:disabled": {
            backgroundColor: "#555555",
            color: "#888888",
          },
        }}
      >
        Post Comment
      </Button>
    </Box>
  );
}
