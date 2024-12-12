"use client";

import styles from "../page.module.css";
import Feed from "../components/feed/Feed";
import { Box } from "@mui/material";
import { Suspense } from "react";
import FeedSkeleton from "../components/loading/FeedSkeleton";
import StandardWrapper from "../components/loading/StandardWrapper";

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
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
            <Feed feedType="home" showNewPost={true} />
          </Suspense>
        </Box>
      </main>
    </div>
  );
}
