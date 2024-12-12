import styles from "../../page.module.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Feed from "@/app/components/feed/Feed";
import { Box } from "@mui/material";
import Navigation from "@/app/components/navigation/Navigation";

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
          <Feed session={session} feedType="all" showNewPost={false} />
        </Box>
      </main>
      <Navigation />
    </div>
  );
}
