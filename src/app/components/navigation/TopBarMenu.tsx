"use client";

import { Box, IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Session } from "next-auth";

export default function TopBarMenu({
  session,
}: Readonly<{ session: Session | null }>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (
    event: React.MouseEvent<HTMLLIElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setAnchorEl(null);
  };

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
            <MenuItem disabled>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              {session.user.username ?? session.user.email}
            </MenuItem>
            <MenuItem
              onClick={() => {
                signOut();
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
