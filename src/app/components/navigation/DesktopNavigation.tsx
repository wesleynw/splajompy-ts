"use client";

import { useUser } from "@/app/providers/UserProvider";
import theme from "@/theme";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import SearchIcon from "../icons/SearchIcon";
import NotificationBadge from "../notifications/NotificationBadge";

export default function DesktopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <HomeIcon fontSize="large" />,
    },
    {
      label: "All",
      href: "/all",
      icon: <PublicIcon fontSize="large" />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: (
        <NotificationBadge>
          <NotificationsIcon fontSize="large" />
        </NotificationBadge>
      ),
    },
    { label: "Search", href: "/search", icon: <SearchIcon /> },
    {
      label: "Profile",
      href: `/user/${user.username}`,
      icon: <PersonIcon fontSize="large" />,
    },
  ];

  const handleNavigation = (event: React.MouseEvent, targetPath: string) => {
    if (targetPath === pathname) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(targetPath);
    }
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          backgroundColor: "transparent",
          paddingLeft: "50px",
          borderRight: "none",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", padding: "16px 8px" }}>
        <List sx={{ padding: 0 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={(event) => handleNavigation(event, item.href)}
                  sx={{
                    border: "2px solid transparent",
                    margin: "4px 0",
                    padding: "12px 16px",
                    minHeight: "48px",
                    outline: "none",
                    borderRadius: "30px",
                    backgroundColor: isActive ? "#e3f2fd" : "transparent",
                    transition: "background-color 0.3s, border-color 0.3s",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                    ...theme.applyStyles("dark", {
                      backgroundColor: isActive ? "#333333" : "transparent",
                      "&:hover": {
                        backgroundColor: "#444444",
                      },
                    }),
                  }}
                  disableRipple
                >
                  <ListItemIcon
                    sx={{
                      color: "#333333",
                      ...theme.applyStyles("dark", { color: "#ffffff" }),
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        fontSize: "20px",
                      },
                    }}
                    sx={{
                      color: "#333333",
                      ...theme.applyStyles("dark", { color: "#ffffff" }),
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
