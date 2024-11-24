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
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);

  const post = await db
    .select({ username: users.username, text: posts.text })
    .from(posts)
    .where(eq(posts.post_id, id))
    .innerJoin(users, eq(posts.user_id, users.user_id))
    .limit(1);

  if (post.length === 0) {
    return {
      title: "Post not found",
      description: "This post cannot be found.",
    };
  }

  return {
    title: `${post[0].username}: ${post[0].text ?? "Image"}`,
    description: post[0].text ?? "",
  };
}

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

  return (
    <SessionProvider session={session}>
      <SinglePostPage {...result[0]} />
    </SessionProvider>
  );
}
