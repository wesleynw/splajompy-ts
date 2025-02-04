"use client";

import { deleteSessionTokenCookie } from "@/app/auth/cookies";
import { getCurrentSession, invalidateSession } from "@/app/auth/session";
import { Box, Button, Stack, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import React from "react";
import Feed from "../feed/Feed";
import FollowButton from "../follows/FollowButton";

interface Props {
  isOwnProfile: boolean;
  user: {
    user_id: number;
    email: string;
    password: string;
    username: string;
  };
}

export default function UserView({ user, isOwnProfile }: Readonly<Props>) {
  return (
    <Box>
      <Box sx={{ px: { xs: 1, md: 3 } }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: "600px",
            borderRadius: "8px",
            padding: 3,
            margin: "10px auto",
            background: "#1b1b1b",
          }}
        >
          <Stack
            direction="row"
            alignItems="left"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                wordBreak: "break-all",
                textAlign: "center",
                marginLeft: 1,
                color: "#ffffff",
              }}
            >
              @{user.username}
            </Typography>
            {isOwnProfile && (
              <Button
                variant="contained"
                size="medium"
                onClick={async () => {
                  const { session } = await getCurrentSession();
                  if (session !== null) {
                    invalidateSession(session.id);
                    deleteSessionTokenCookie();
                    redirect("/login");
                  }
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  paddingX: 2,
                  paddingY: 0.5,
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  color: "#ffffff",
                  backgroundColor: "#1DA1F2",
                  "&:hover": {
                    backgroundColor: "#0d8de6",
                  },
                }}
              >
                Sign Out
              </Button>
            )}
            <FollowButton user_id={user.user_id} show_unfollow={true} />
          </Stack>
        </Box>
      </Box>
      <Box>
        <Feed user={user} page="profile" user_id={user.user_id} />
      </Box>
    </Box>
  );
}
