import { SelectComment, SelectUser } from "@/db/schema";
import theme from "@/theme";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import Linkify from "linkify-react";
import { renderMentions } from "@/app/utils/mentions";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

type Props = {
  comments: SelectComment;
  users: SelectUser;
};

export default function Comment({ comments, users }: Readonly<Props>) {
  const userTimezone = dayjs.tz.guess();
  const options = { defaultProtocol: "https", target: "_blank" };

  return (
    <Box
      sx={{
        padding: 2,
        border: "1px solid",
        borderRadius: "12px",
        marginBottom: 2,
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
            color: "#e0e0e0",
          }),
          ...theme.applyStyles("light", {
            color: "#333",
          }),
        }}
      >
        @{users.username}
      </Typography>

      <Box
        sx={{
          color: "#333333",
          fontWeight: "bold",
          marginBottom: 3,
          ...theme.applyStyles("dark", { color: "#ffffff" }),
          whiteSpace: "pre-line",
          overflowWrap: "break-word",
          "& a": {
            color: "lightblue",
            textDecoration: "underline",
          },
          "& a:hover": {
            cursor: "pointer",
          },
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.6,
              ...theme.applyStyles("dark", { color: "#ccc" }),
            }}
          >
            <Linkify options={options}>{renderMentions(comments.text)}</Linkify>
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{
          ...theme.applyStyles("light", { color: "#888" }),
          marginTop: 1,
          display: "block",
        }}
      >
        {dayjs.utc(comments.comment_date).tz(userTimezone).fromNow()}
      </Typography>
    </Box>
  );
}
