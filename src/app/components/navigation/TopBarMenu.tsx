"use client";

import { usePathname } from "next/navigation";
import { Box, IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PublicIcon from "@mui/icons-material/Public";
import HomeIcon from "@mui/icons-material/Home";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Session } from "next-auth";
import Link from "next/link";

export default function TopBarMenu({
  session,
}: Readonly<{ session: Session | null }>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const pathname = usePathname();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setAnchorEl(null);
  }, [pathname]);

  return (
    <>
      {session ? (
        <Box>
          <IconButton
            onClick={handleClick}
            aria-controls={openMenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            disableScrollLock={true}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem component={Link} href="/" onClick={handleCloseMenu}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              Home
            </MenuItem>
            <MenuItem component={Link} href="/all" onClick={handleCloseMenu}>
              <ListItemIcon>
                <PublicIcon />
              </ListItemIcon>
              All Posts
            </MenuItem>
            <MenuItem
              component={Link}
              href={`/user/${session.user.username}`}
              onClick={handleCloseMenu}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              {session.user.username}
            </MenuItem>
            <MenuItem
              onClick={() => {
                signOut();
                handleCloseMenu();
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      ) : null}
    </>
  );
}
