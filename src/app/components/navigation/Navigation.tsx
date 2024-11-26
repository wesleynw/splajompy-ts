"use client";

import { useMediaQuery, useTheme } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import { useSession } from "next-auth/react";
import DesktopNavigation from "./DesktopNavigation";

export default function Navigation() {
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!session?.user) {
    return null;
  }

  return isMobile ? (
    <MobileNavigation username={session.user.username} />
  ) : (
    <DesktopNavigation username={session.user.username} />
  );
}
