"use client";

import { useSinglePost } from "@/app/data/post";
import { PublicUser } from "@/db/schema";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React from "react";
import CenteredLayout from "../layout/CenteredLayout";
import Spinner from "../loading/Spinner";
import Post from "./Post";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  user: PublicUser;
  post_id: number;
};

export default function SinglePost({ post_id, user }: Readonly<Props>) {
  const { isPending, post, toggleLiked } = useSinglePost(post_id);

  if (isPending) {
    return <Spinner />;
  }

  if (!post) {
    return (
      <CenteredLayout>
        <p className="mt-5 text-xl font-black">Post not found.</p>
      </CenteredLayout>
    );
  }

  return (
    <div>
      <CenteredLayout>
        <Post user={user} toggleLiked={toggleLiked} standaloneView {...post} />
      </CenteredLayout>
    </div>
  );
}
