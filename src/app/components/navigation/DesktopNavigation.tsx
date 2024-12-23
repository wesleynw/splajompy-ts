"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { usePathname, useRouter } from "next/navigation";
import theme from "@/theme";
import NotificationBadge from "../notifications/NotificationBadge";
import { useSession } from "next-auth/react";

export default function DesktopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

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
    {
      label: "Profile",
      href: `/user/${session?.user?.username}`,
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
                    backgroundColor: isActive ? "#ff0000" : "transparent",
                    transition: "background-color 0.3s, border-color 0.3s",
                    "&:hover": {
                      backgroundColor: isActive ? "#cc0000" : "#f5f5f5",
                    },
                    ...theme.applyStyles("dark", {
                      backgroundColor: isActive ? "#800000" : "transparent",
                      "&:hover": {
                        backgroundColor: "#660000",
                      },
                    }),
                  }}
                  disableRipple
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#ffffff" : "#333333",
                      ...theme.applyStyles("dark", {
                        color: isActive ? "#ffffff" : "#ffffff",
                      }),
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
                      color: isActive ? "#ffffff" : "#333333",
                      ...theme.applyStyles("dark", {
                        color: isActive ? "#ffffff" : "#ffffff",
                      }),
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
