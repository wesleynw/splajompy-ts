import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        maxWidth: 600,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
