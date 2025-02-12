import { CommentWithLike } from "@/app/lib/comments";
import { RenderMentions } from "@/app/utils/mentions";
import { SelectUser } from "@/db/schema";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Linkify from "linkify-react";
import LikeButton from "../post/LikeButton";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

type Props = {
  comment: CommentWithLike;
  user: SelectUser;
  toggleLike: () => void;
};

export default function Comment({
  comment,
  user,
  toggleLike,
}: Readonly<Props>) {
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
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", height: "100%" }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              marginBottom: 0.5,
              color: "#e0e0e0",
            }}
          >
            @{user.username}
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
                  wordBreak: "break-word",
                }}
              >
                <Linkify options={options}>
                  <RenderMentions text={comment.text} />
                </Linkify>
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
            {dayjs.utc(comment.comment_date).tz(userTimezone).fromNow()}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <LikeButton
            liked={comment.isLiked}
            toggleLike={toggleLike}
            isComment={true}
          />
        </Box>
      </Stack>
    </Box>
  );
}
