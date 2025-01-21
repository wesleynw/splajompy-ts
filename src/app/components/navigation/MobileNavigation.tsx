"use client";

import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  styled,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import NotificationBadge from "../notifications/NotificationBadge";
import { useUser } from "@/app/providers/UserProvider";

const StyledBottomNavigationAction = styled(BottomNavigationAction)({
  paddingTop: "15px",
  "&.Mui-selected": {
    color: "white",
    filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.45))",
  },
});

export default function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();

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
          height: is_standalone ? "80px" : "56px",
          alignItems: "flex-start",
        }}
      >
        <StyledBottomNavigationAction
          value="/"
          icon={pathname === "/" ? <HomeIcon /> : <HomeOutlinedIcon />}
          onClick={(event) => handleNavigation(event, "/")}
          disableRipple
        />

        <StyledBottomNavigationAction
          value="/notifications"
          icon={
            <NotificationBadge>
              {pathname === "/notifications" ? (
                <NotificationsIcon />
              ) : (
                <NotificationsNoneOutlinedIcon />
              )}
            </NotificationBadge>
          }
          onClick={(event) => handleNavigation(event, "/notifications")}
          disableRipple
        />
        <StyledBottomNavigationAction
          value="/all"
          icon={<PublicIcon />}
          onClick={(event) => handleNavigation(event, "/all")}
          disableRipple
        />
        <StyledBottomNavigationAction
          value={`/user/${user.username}`}
          icon={
            pathname === `/user/${user.username}` ? (
              <PersonIcon />
            ) : (
              <PersonOutlineOutlinedIcon />
            )
          }
          onClick={(event) => handleNavigation(event, `/user/${user.username}`)}
          disableRipple
        />
      </BottomNavigation>
    </Box>
  );
}
