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

  const is_standalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches || false);

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
          height: is_standalone ? "80px" : "56px", // Custom height for standalone mode
          alignItems: "flex-start", // Align items closer to the top
        }}
      >
        <BottomNavigationAction
          value="/"
          icon={<HomeIcon />}
          onClick={(event) => handleNavigation(event, "/")}
          disableRipple
          sx={{
            paddingTop: "15px",
          }}
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
          sx={{
            paddingTop: "15px",
          }}
        />
        <BottomNavigationAction
          value="/all"
          icon={<PublicIcon />}
          onClick={(event) => handleNavigation(event, "/all")}
          disableRipple
          sx={{
            paddingTop: "15px",
          }}
        />
        <BottomNavigationAction
          value={`/user/${session?.user?.username}`}
          icon={<PersonIcon />}
          onClick={(event) =>
            handleNavigation(event, `/user/${session?.user?.username}`)
          }
          disableRipple
          sx={{
            paddingTop: "15px",
          }}
        />
      </BottomNavigation>
    </Box>
  );
}
