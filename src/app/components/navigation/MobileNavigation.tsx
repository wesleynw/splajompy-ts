"use client";

import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface BottomNavProps {
  username: string;
}

export default function BottomNav({ username }: Readonly<BottomNavProps>) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/all");
    router.prefetch(`/user/${username}`);
  }, [router, username]);

  const handleNavigation = (event: React.MouseEvent, targetPath: string) => {
    if (targetPath === pathname) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(targetPath);
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation value={pathname}>
        <BottomNavigationAction
          value="/"
          icon={<HomeIcon />}
          onClick={(event) => handleNavigation(event, "/")}
          disableRipple
        />
        <BottomNavigationAction
          value="/all"
          icon={<PublicIcon />}
          onClick={(event) => handleNavigation(event, "/all")}
          disableRipple
        />
        <BottomNavigationAction
          value={`/user/${username}`}
          icon={<PersonIcon />}
          onClick={(event) => handleNavigation(event, `/user/${username}`)}
          disableRipple
        />
      </BottomNavigation>
    </Box>
  );
}
