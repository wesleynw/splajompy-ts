import { SelectComment, SelectUser } from "@/db/schema";
import theme from "@/theme";
import { Box, Typography } from "@mui/material";

type Props = {
  comments: SelectComment;
  users: SelectUser;
};

export default function Comment({ comments, users }: Readonly<Props>) {
  return (
    <Box
      sx={{
        padding: 1.5,
        border: "1px solid",
        borderRadius: "12px",
        marginBottom: 1.5,
        ...theme.applyStyles("dark", {
          borderColor: "#444",
          backgroundColor: "#222",
        }),
        ...theme.applyStyles("light", {
          borderColor: "#ddd",
          backgroundColor: "#fff",
        }),
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: "bold",
          marginBottom: 0.5,
          ...theme.applyStyles("dark", {
            color: "#fff",
          }),
          ...theme.applyStyles("light", {
            color: "#333",
          }),
        }}
      >
        @{users.username}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.applyStyles("dark", { color: "#ccc" }),
          ...theme.applyStyles("light", {
            color: "#555",
          }),
        }}
      >
        {comments.text}
      </Typography>
    </Box>
  );
}
