import { Box, Skeleton } from "@mui/material";

export default function NotificationsPageSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 600,
        margin: "10px auto",
        padding: 3,
        gap: 1,
      }}
    >
      <Skeleton variant="rounded" width="100%" height={50} />
      <Skeleton variant="rounded" width="100%" height={50} />
      <Skeleton variant="rounded" width="100%" height={50} />
      <Skeleton variant="rounded" width="100%" height={50} />
      <Skeleton variant="rounded" width="100%" height={50} />
      <Skeleton variant="rounded" width="100%" height={50} />
      <Skeleton variant="rounded" width="100%" height={50} />
      <Skeleton variant="rounded" width="100%" height={50} />
    </Box>
  );
}
