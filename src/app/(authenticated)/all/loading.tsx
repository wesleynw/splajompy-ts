import { Box, Skeleton } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 2,
      }}
    >
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Skeleton variant="rectangular" width="100%" height={200} />
    </Box>
  );
}
