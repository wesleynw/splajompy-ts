import styles from "../page.module.css";
import Feed from "../components/feed/Feed";
import { Box } from "@mui/material";
import { Suspense } from "react";
import FeedSkeleton from "../components/loading/FeedSkeleton";
import StandardWrapper from "../components/loading/StandardWrapper";
import { redirect } from "next/navigation";
import { getCurrentSession } from "../auth/session";

export default async function Home() {
  const { session, user } = await getCurrentSession();
  if (session === null) {
    redirect("/login");
  }

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
            <Feed user={user} page="home" />
          </Suspense>
        </Box>
      </main>
    </div>
  );
}
