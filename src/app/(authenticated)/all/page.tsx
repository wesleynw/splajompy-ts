import Feed from "@/app/components/feed/Feed";
import { Box } from "@mui/material";
import { Suspense } from "react";
import FeedSkeleton from "@/app/components/loading/FeedSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/app/auth/session";

export default async function Home() {
  const { user } = await getCurrentSession();
  if (user === null) {
    redirect("/login");
  }

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
        <Feed user={user} page="all" />
      </Suspense>
    </Box>
  );
}
