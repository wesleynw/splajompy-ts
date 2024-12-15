import Feed from "@/app/components/feed/Feed";
import { Box } from "@mui/material";
import { Suspense } from "react";
import FeedSkeleton from "@/app/components/loading/FeedSkeleton";
import StandardWrapper from "@/app/components/loading/StandardWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
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
        <Feed session={session} page="all" />
      </Suspense>
    </Box>
  );
}
