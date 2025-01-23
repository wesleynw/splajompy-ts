"use client";

import { NoSsr, useMediaQuery } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";
import theme from "@/theme";

export default function Navigation() {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });

  return (
    <NoSsr>{isMobile ? <MobileNavigation /> : <DesktopNavigation />}</NoSsr>
  );
}
