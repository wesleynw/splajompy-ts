import styles from "./page.module.css";
import { auth } from "@/auth";
import { SignOut } from "./components/signout-button";
import Link from "next/link";
import NewPost from "./components/NewPost";
import { redirect } from "next/navigation";
import Feed from "./components/Feed";
import { Box, Stack } from "@mui/material";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <Stack alignItems="center">
      <div>
        <main className={styles.main}>
          <NewPost />
          <Feed />
        </main>
        <footer className={styles.footer}>
          <Box paddingBottom="20px">
            {session ? (
              <div>
                <p>you are logged as</p>
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
    </Stack>
  );
}
