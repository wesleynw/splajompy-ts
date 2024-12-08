"use client";

import React from "react";
import { Box, Typography, Stack, useTheme, Button } from "@mui/material";
import BackButton from "../navigation/BackButton";
import { signOut, useSession } from "next-auth/react";
import FollowButton from "../follows/FollowButton";
import Feed from "../feed/Feed";
import { useRouter } from "next/navigation";

interface Props {
  user: {
    user_id: number;
    email: string;
    password: string;
    username: string;
  };
}

export default function UserView({ user }: Readonly<Props>) {
  const { data: session } = useSession();
  const router = useRouter();
  const theme = useTheme();

  if (!session) {
    router.push("/login");
    return null;
  }

  const isOwnProfile = session?.user?.user_id === user.user_id;

  return (
    <Box>
      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            borderRadius: "8px",
            gap: 1,
            padding: 3,
            background: "linear-gradient(135deg, #ffffff, #f9f9f9)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            margin: "10px auto",
            ...theme.applyStyles("dark", {
              background: "linear-gradient(135deg, #1b1b1b, #2a2a2a)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
            }),
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <BackButton />
            {isOwnProfile && (
              <Button
                variant="contained"
                size="medium"
                onClick={() => {
                  signOut({ redirectTo: "/login" });
                }}
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  paddingX: 2,
                  paddingY: 0.5,
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  minWidth: "auto",
                  backgroundColor: "#1DA1F2",
                  color: "#ffffff",
                  ...theme.applyStyles("dark", {
                    backgroundColor: "#1DA1F2",
                  }),
                  "&:hover": {
                    backgroundColor: "#0d8de6",
                  },
                }}
              >
                Sign Out
              </Button>
            )}
            <FollowButton user_id={user.user_id} show_unfollow={true} />
          </Box>
          <Stack
            direction="row"
            alignItems="left"
            justifyContent="space-between"
            marginTop={1}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#333333",
                wordBreak: "break-all",
                textAlign: "center",
                marginLeft: 1,
                ...theme.applyStyles("dark", { color: "#ffffff" }),
              }}
            >
              @{user.username}
            </Typography>
          </Stack>
        </Box>
      </Box>
      <Box>
        <Feed
          session={session}
          feedType="profile"
          ofUser={user.user_id}
          showNewPost={false}
        />
      </Box>
    </Box>
  );
}
