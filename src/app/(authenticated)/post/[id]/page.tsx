import { getCurrentSession } from "@/app/auth/session";
import SinglePost from "@/app/components/post/SinglePost";
import { getPostById } from "@/app/lib/posts";
import { toDisplayFormat } from "@/app/utils/mentions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Metadata } from "next";
import { redirect } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);

  const post = await getPostById(id);

  if (!post) {
    return {
      title: "Post not found",
      description: "This post cannot be found.",
    };
  }

  return {
    title: `${post.poster}: ${toDisplayFormat(post.text ?? "") || "Image"}`,
    description: toDisplayFormat(post.text ?? "") ?? "",
  };
}

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ id: number }>;
}>) {
  const { user } = await getCurrentSession();
  if (user === null) {
    redirect("/login");
  }

  const post_id = (await params).id;

  return <SinglePost post_id={post_id} user={user} />;
}
