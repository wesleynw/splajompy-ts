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
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import PublicIcon from "@mui/icons-material/Public";
import PersonIcon from "@mui/icons-material/Person";
import { usePathname } from "next/navigation";
import theme from "@/theme";

export default function DesktopNavigation({
  username,
}: Readonly<{ username: string }>) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <HomeIcon fontSize="large" />,
    },
    {
      label: "Explore",
      href: "/all",
      icon: <PublicIcon fontSize="large" />,
    },
    {
      label: "Profile",
      href: `/user/${username}`,
      icon: <PersonIcon fontSize="large" />,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: "transparent",
          paddingLeft: "50px",
          borderRight: "none",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={{
                    border: "2px solid transparent",
                    margin: "2px",
                    outline: "none",
                    borderRadius: "30px",
                    backgroundColor: isActive ? "#e3f2fd" : "transparent",
                    transition: "background-color 0.3s, border-color 0.3s",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                    ...theme.applyStyles("dark", {
                      // borderColor: "transparent",
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
                    primaryTypographyProps={{
                      fontSize: "20px",
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
