import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Stack, Typography } from "@mui/material";

export default function CommentCount({ count }: Readonly<{ count: number }>) {
  return (
    <Stack direction="row" alignItems="center">
      <Typography sx={{ fontWeight: 800 }}>{count}</Typography>
      <ChatBubbleOutlineOutlinedIcon
        sx={{
          width: "20px",
          height: "20px",
          marginLeft: "8px",
          color: "white",
        }}
      />
    </Stack>
  );
}
