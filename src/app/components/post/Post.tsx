import { Box, Stack, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  date: Date;
  content: string;
  poster: string;
}

export default function Post({ date, content, poster }: Props) {
  const userTimezone = dayjs.tz.guess();

  return (
    <Box
      sx={{
        maxWidth: 500,
        padding: 2,
        margin: "16px auto",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #1b1b1b, #222222)", // Subtle, smooth gradient
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        transition: "background-color 0.3s",
        "&:hover": {
          background: "linear-gradient(135deg, #222222, #2a2a2a)", // Slightly lighter on hover
        },
      }}
    >
      <Stack direction="row" alignItems="center">
        <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
          {dayjs.utc(date).tz(userTimezone).fromNow()}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <MoreHorizIcon sx={{ color: "#a0a0a0" }} />
      </Stack>

      <Typography
        variant="body1"
        sx={{ color: "#e0e0e0", fontWeight: "bold", marginBottom: 1 }}
      >
        {content}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ color: "#a0a0a0", alignSelf: "flex-end" }}
      >
        - {poster}
      </Typography>
    </Box>
  );
}
