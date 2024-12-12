"use client";

import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import NotificationBadge from "../notifications/NotificationBadge";
import { useSession } from "next-auth/react";

export default function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const isStandalone = typeof window === "undefined";

  const handleNavigation = (event: React.MouseEvent, targetPath: string) => {
    if (targetPath === pathname) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(targetPath);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "background.paper",
        zIndex: 10,
      }}
    >
      <BottomNavigation
        value={pathname}
        sx={{
          height: isStandalone ? "72px" : "56px", // Custom height for standalone mode
        }}
      >
        <BottomNavigationAction
          value="/"
          icon={<HomeIcon />}
          onClick={(event) => handleNavigation(event, "/")}
          disableRipple
        />
        <BottomNavigationAction
          value="/notifications"
          icon={
            <NotificationBadge>
              <NotificationsIcon />
            </NotificationBadge>
          }
          onClick={(event) => handleNavigation(event, "/notifications")}
          disableRipple
        />
        <BottomNavigationAction
          value="/all"
          icon={<PublicIcon />}
          onClick={(event) => handleNavigation(event, "/all")}
          disableRipple
        />
        <BottomNavigationAction
          value={`/user/${session?.user?.username}`}
          icon={<PersonIcon />}
          onClick={(event) =>
            handleNavigation(event, `/user/${session?.user?.username}`)
          }
          disableRipple
        />
      </BottomNavigation>
    </Box>
  );
}
