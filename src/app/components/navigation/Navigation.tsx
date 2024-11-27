"use client";

import { useMediaQuery, useTheme } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";
import { Session } from "next-auth";

export default function Navigation({ session }: { session: Session }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!session?.user) {
    return null;
  }

  return isMobile ? (
    <MobileNavigation username={session.user.username} />
  ) : (
    <DesktopNavigation username={session.user.username} />
  );
}
