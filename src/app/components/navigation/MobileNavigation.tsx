"use client";

import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavProps {
  username: string;
}

export default function BottomNav({ username }: Readonly<BottomNavProps>) {
  const pathname = usePathname();

  return (
    <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation value={pathname}>
        <BottomNavigationAction
          value="/"
          icon={<HomeIcon />}
          component={Link}
          href="/"
          disableRipple
        />
        <BottomNavigationAction
          value="/all"
          icon={<PublicIcon />}
          component={Link}
          href="/all"
          disableRipple
        />
        <BottomNavigationAction
          value={`/user/${username}`}
          icon={<PersonIcon />}
          component={Link}
          href={`/user/${username}`}
          disableRipple
        />
      </BottomNavigation>
    </Box>
  );
}
