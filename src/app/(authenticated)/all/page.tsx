"use client";

import Feed from "@/app/components/feed/Feed";
import { Box } from "@mui/material";
import { Suspense } from "react";
import FeedSkeleton from "@/app/components/loading/FeedSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";

export default function Home() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", md: "600px" },
        margin: "auto",
        boxSizing: "border-box",
        paddingBottom: 20,
      }}
    >
      <Suspense
        fallback={
          <StandardWrapper>
            <FeedSkeleton />
          </StandardWrapper>
        }
      >
        <Feed feedType="all" showNewPost={false} />
      </Suspense>
    </Box>
  );
}
