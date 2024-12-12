import styles from "../../page.module.css";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
import Feed from "@/app/components/feed/Feed";
import { Box } from "@mui/material";
import Navigation from "@/app/components/navigation/Navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
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
          <Suspense fallback={<div>Loading...</div>}>
            <Feed session={session} feedType="all" showNewPost={false} />
          </Suspense>
        </Box>
      </main>
      <Navigation />
    </div>
  );
}
