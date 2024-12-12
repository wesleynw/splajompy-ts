"use client";

import { NoSsr, useMediaQuery, useTheme } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";

export default function Navigation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });

  return (
    <NoSsr>{isMobile ? <MobileNavigation /> : <DesktopNavigation />}</NoSsr>
  );
}
