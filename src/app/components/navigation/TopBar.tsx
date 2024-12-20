import { Box, Typography } from "@mui/material";
import Link from "next/link";
import NewPostModal from "../post/new/NewPostModal";
import { SessionProvider } from "next-auth/react";

export default function TopBar() {
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
        backdropFilter: "blur(15px)",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
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
        <Box sx={{ position: "absolute", right: "20px" }}>
          <SessionProvider>
            <NewPostModal />
          </SessionProvider>
        </Box>
      </Box>
    </Box>
  );
}
