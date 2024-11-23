import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import SinglePostPage from "@/app/components/post/SinglePagePost";
import { auth } from "@/auth";
import { db } from "@/db";
import { images, posts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Box, Typography } from "@mui/material";
import BackButton from "@/app/components/navigation/BackButton";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ id: number }>;
}>) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const id = (await params).id;

  const result = await db
    .select({
      post_id: posts.post_id,
      postdate: posts.postdate,
      text: posts.text,
      user_id: users.user_id,
      username: users.username,
      email: users.email,
      password: users.password,
      imagePath: images.imageBlobUrl,
      imageWidth: images.width,
      imageHeight: images.height,
    })
    .from(posts)
    .innerJoin(users, eq(posts.user_id, users.user_id))
    .leftJoin(images, eq(posts.post_id, images.post_id))
    .where(eq(posts.post_id, id))
    .limit(1);

  if (result.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="20vh"
        justifyContent="center"
        alignItems="center"
      >
        <BackButton />
        <Typography variant="h5">This post cannot be found.</Typography>
      </Box>
    );
  }

  return <SinglePostPage {...result[0]} />;
}
