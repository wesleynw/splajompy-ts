import styles from "../page.module.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Feed from "../components/feed/Feed";
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
            boxSizing: "border-box",
            paddingBottom: 20,
          }}
        >
          <Feed session={session} feedType="home" showNewPost={true} />
        </Box>
      </main>
    </div>
  );
}
