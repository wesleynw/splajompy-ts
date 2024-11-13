import styles from "./page.module.css";
import { auth } from "@/auth";
import { SignOut } from "./components/signout-button";
import Link from "next/link";
import NewPost from "./components/post/NewPost/NewPost";
import { redirect } from "next/navigation";
import Feed from "./components/Feed";
import { Box } from "@mui/material";

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
          }}
        >
          <NewPost />
          <Feed />
        </Box>
      </main>
      <footer className={styles.footer} style={{ width: "100%" }}>
        <Box
          paddingBottom="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          minHeight="80px"
          width="100%"
        >
          {session ? (
            <div>
              <p>you are logged in as</p>
              <p>
                <b>{session.user?.email}</b>
              </p>
              <SignOut />
            </div>
          ) : (
            <div>
              <p>you are not signed in</p>
              <Link href="login">sign in</Link>
            </div>
          )}
        </Box>
      </footer>
    </div>
  );
}
