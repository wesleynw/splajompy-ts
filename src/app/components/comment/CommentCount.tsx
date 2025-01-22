import { Stack } from "@mui/material";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

export default function CommentCount({ count }: Readonly<{ count: number }>) {
  return (
    <Stack direction="row" alignItems="center">
      <ChatBubbleOutlineOutlinedIcon
        sx={{ width: "16px", height: "16px", marginRight: "8px" }}
      />
      {count}
    </Stack>
  );
}
