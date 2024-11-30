"use client";

import { NoSsr, useMediaQuery, useTheme } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";
import { Session } from "next-auth";

export default function Navigation({
  session,
}: Readonly<{ session: Session }>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });

  if (!session?.user) {
    return null;
  }

  return (
    <NoSsr>
      {isMobile ? (
        <MobileNavigation username={session.user.username} />
      ) : (
        <DesktopNavigation username={session.user.username} />
      )}
    </NoSsr>
  );
}
