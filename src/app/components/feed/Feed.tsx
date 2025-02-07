"use client";

import { usePosts } from "@/app/data/posts";
import { User } from "@/db/schema";
import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";
import Spinner from "../loading/Spinner";
import Post from "../post/Post";
import EmptyFeed from "./EmptyFeed";
import FeedBottom from "./FeedBottom";

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
  const { posts, fetchNextPage, hasNextPage, isFetching, status, toggleLiked } =
    usePosts({
      target_following_only,
      target_post_id,
      target_user_id,
    });

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "400px", threshold: 0 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasNextPage, fetchNextPage]);

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
    return target_user_id ? <div>no posts</div> : <EmptyFeed />;
  }

  return (
    <Box
      sx={{
        marginBottom: "60px",
        px: { xs: 1, md: 3 },
        width: "100%",
      }}
    >
      {posts.pages.map((posts) =>
        posts.map((post) => (
          <Post
            key={post.post_id}
            user={user}
            toggleLiked={() => toggleLiked(post.post_id)}
            {...post}
          />
        ))
      )}
      {isFetching && <Spinner />}
      <div ref={observerRef} style={{ height: "1px" }} />
      {!hasNextPage &&
        !target_following_only &&
        !target_post_id &&
        !target_user_id && <FeedBottom />}
    </Box>
  );
}
