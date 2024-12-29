import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { SelectNotification } from "@/db/schema";
import { useTheme } from "@mui/material";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  notification: SelectNotification;
};

export default function Notification({ notification }: Readonly<Props>) {
  const userTimezone = dayjs.tz.guess();
  const theme = useTheme();

  return (
    <Link
      key={notification.notification_id}
      href={notification.link ?? ""}
      style={{ textDecoration: "none" }}
    >
      <Box
        key={notification.notification_id}
        sx={{
          padding: 2,
          borderRadius: "12px",
          backgroundColor: "#2a2a2a",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
          transition: "all 0.3s ease",
          border: notification.viewed
            ? "2px solid transparent"
            : `2px solid ${theme.palette.primary.main}`,
          "&:hover": {
            backgroundColor: "#333",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#ddd",
            fontWeight: 500,
          }}
        >
          {notification.message}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginTop: 1,
            color: "#bbb",
          }}
        >
          {dayjs.utc(notification.created_at).tz(userTimezone).fromNow()}
        </Typography>
      </Box>
    </Link>
  );
}
