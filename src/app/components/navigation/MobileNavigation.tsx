"use client";

import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import Link from "next/link";

export default function BottomNav({
  username,
}: Readonly<{ username: string }>) {
  const [value, setValue] = useState(0);
  return (
    <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        value={value}
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          icon={<HomeIcon />}
          LinkComponent={Link}
          href="/"
          disableRipple
        />
        <BottomNavigationAction
          icon={<PublicIcon />}
          LinkComponent={Link}
          href="/all"
          disableRipple
        />
        <BottomNavigationAction
          icon={<PersonIcon />}
          LinkComponent={Link}
          href={`/user/${username}`}
          disableRipple
        />
      </BottomNavigation>
    </Box>
  );
}
