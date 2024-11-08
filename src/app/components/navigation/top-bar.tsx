"use client";

import theme from "@/theme";
import { Box, Typography } from "@mui/material";

export default function TopBar() {
  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        borderBottom: "0.5px solid rgba(160, 160, 160, 0.3)",
        ...theme.applyStyles("light", {
          backdropFilter: "blur(15px)",
          color: "#000",
        }),
        ...theme.applyStyles("dark", {
          backdropFilter: "blur(15px)",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
        }),
      }}
    >
      <Typography variant="h5" fontWeight={700} sx={{ paddingX: 2 }}>
        Splajompy
      </Typography>
    </Box>
  );
}
