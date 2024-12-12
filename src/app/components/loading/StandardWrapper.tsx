import { Box } from "@mui/material";

export default function StandardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
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
      {children}
    </Box>
  );
}
