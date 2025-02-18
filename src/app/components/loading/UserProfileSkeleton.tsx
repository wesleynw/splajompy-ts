"use client";
import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";

export default function UserViewSkeleton() {
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
            margin: "10px auto",
            background: "linear-gradient(135deg, #1b1b1b, #2a2a2a)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Box display="flex" alignItems="center" gap={2}>
              <Skeleton variant="rectangular" width={100} height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          </Box>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Skeleton
              variant="text"
              width={150}
              height={40}
              sx={{ bgcolor: "grey.800" }}
            />
          </Stack>
        </Box>
      </Box>

      <Box>
        {[1, 2, 3].map((item) => (
          <Box
            key={item}
            sx={{
              width: "100%",
              maxWidth: 600,
              margin: "10px auto",
              padding: 2,
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Skeleton variant="circular" width={50} height={50} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
