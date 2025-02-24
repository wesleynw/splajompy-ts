"use client";

import { usePosts } from "@/app/data/posts";
import { User } from "@/db/schema";
import CenteredLayout from "../layout/CenteredLayout";
import Spinner from "../loading/Spinner";
import Post from "../post/Post";
import EmptyFeed from "./EmptyFeed";
import FeedBottom from "./FeedBottom";
import ScrollObserver from "./ScrollObserver";

type Props = {
  user: User;
  target_following_only?: boolean;
  target_user_id?: number | null;
  target_post_id?: number;
};

export default function Feed({
  user,
  target_following_only = false,
  target_user_id = null,
  target_post_id,
}: Readonly<Props>) {
  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    toggleLiked,
  } = usePosts({
    target_following_only,
    target_post_id,
    target_user_id,
  });

  if (status === "pending") {
    return <Spinner />;
  }

  if (status === "error") {
    return <div>error</div>;
  }

  if (!posts) {
    return <div>no data</div>;
  }

  if (posts.pages.length === 1 && posts.pages[0].length === 0) {
    return target_user_id ? (
      <CenteredLayout>
        <p className="mt-5 text-xl font-black">No posts.</p>
      </CenteredLayout>
    ) : (
      <EmptyFeed />
    );
  }

  return (
    <>
      <CenteredLayout>
        {posts.pages.map((posts) =>
          posts.map((post) => (
            <Post
              key={post.post_id}
              user={user}
              toggleLiked={() => toggleLiked(post.post_id)}
              {...post}
            />
          )),
        )}
      </CenteredLayout>
      {isFetching && <Spinner />}
      <ScrollObserver
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
      {!hasNextPage &&
        !target_following_only &&
        !target_post_id &&
        !target_user_id && <FeedBottom />}
    </>
  );
}
