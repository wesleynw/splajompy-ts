"use client";

import { NoSsr, useMediaQuery, useTheme } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Navigation() {
  const router = useRouter();
  const theme = useTheme();
  const { data: session } = useSession();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/notifications");
    router.prefetch("/all");
    router.prefetch(`/user/${session?.user?.username}`);
  }, [router, session]);

  return (
    <NoSsr>{isMobile ? <MobileNavigation /> : <DesktopNavigation />}</NoSsr>
  );
}
