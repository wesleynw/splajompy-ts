import styles from "./page.module.css";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Feed from "./components/feed/Feed";
import { Box } from "@mui/material";
import Navigation from "./components/navigation/Navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // if the user has an old JWT token, without their username, sign them out
  if (!session.user.username) {
    signOut();
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
          <Feed session={session} fetchAllPosts={false} showNewPost={true} />
        </Box>
        <Navigation session={session} />
      </main>
    </div>
  );
}
