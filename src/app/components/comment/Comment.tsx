import { SelectComment, SelectUser } from "@/db/schema";
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
        borderColor: "#444",
        backgroundColor: "#222",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: "bold",
          marginBottom: 0.5,
          color: "#e0e0e0",
        }}
      >
        @{users.username}
      </Typography>

      <Box
        sx={{
          color: "#ffffff",
          fontWeight: "bold",
          marginBottom: 3,
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
              color: "#ccc",
            }}
          >
            <Linkify options={options}>{renderMentions(comments.text)}</Linkify>
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="caption"
        sx={{
          marginTop: 1,
          display: "block",
        }}
      >
        {dayjs.utc(comments.comment_date).tz(userTimezone).fromNow()}
      </Typography>
    </Box>
  );
}
