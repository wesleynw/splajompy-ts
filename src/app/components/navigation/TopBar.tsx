"use client";

import theme from "@/theme";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function TopBar({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        height: "60px",
        zIndex: 100,
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Link href="/">
          <Typography variant="h5" fontWeight={700} sx={{ paddingX: 2 }}>
            Splajompy
          </Typography>
        </Link>
      </Box>
      {/* TODO: shifts the logo slightly to the left when logged in */}
      <Box sx={{ position: "absolute", top: 10, right: 10 }}>{children}</Box>
    </Box>
  );
}
