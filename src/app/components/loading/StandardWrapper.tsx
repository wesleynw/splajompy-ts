import { Box } from "@mui/material";

export default function StandardWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 600,
        paddingX: 3,
        paddingBottom: 1,
        margin: "10px auto",
      }}
    >
      {children}
    </Box>
  );
}
