"use client";

import { NoSsr, useMediaQuery } from "@mui/material";
import MobileNavigation from "./MobileNavigation";
import DesktopNavigation from "./DesktopNavigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import theme from "@/theme";
import { useUser } from "@/app/providers/UserProvider";

export default function Navigation() {
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const user = useUser();

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/notifications");
    router.prefetch("/all");
    router.prefetch(`/user/${user.username}`);
  }, [router]);

  return (
    <NoSsr>{isMobile ? <MobileNavigation /> : <DesktopNavigation />}</NoSsr>
  );
}
