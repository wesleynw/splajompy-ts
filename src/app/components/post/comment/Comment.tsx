import { SelectComment, SelectUser } from "@/db/schema";
import theme from "@/theme";
import { Box, Typography } from "@mui/material";

type props = {
  comments: SelectComment;
  users: SelectUser;
};

export default function Comment({ comments, users }: Readonly<props>) {
  return (
    <Box
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
        @{users.username}
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
        {comments.text}
      </Typography>
    </Box>
  );
}
