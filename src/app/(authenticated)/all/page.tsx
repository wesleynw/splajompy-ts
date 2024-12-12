import Feed from "@/app/components/feed/Feed";
import { Box } from "@mui/material";
import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FeedSkeleton from "@/app/components/loading/FeedSkeleton";

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
      <Suspense fallback={<FeedSkeleton />}>
        <Feed session={session} feedType="all" showNewPost={false} />
      </Suspense>
    </Box>
  );
}
