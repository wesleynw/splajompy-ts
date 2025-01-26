"use client";

import { useFeed } from "@/app/data/posts";
import { User } from "@/db/schema";
import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";
import Spinner from "../loading/Spinner";
import Post from "../post/Post";
import EmptyFeed from "./EmptyFeed";
import FeedBottom from "./FeedBottom";

type Props = {
  user: User;
  page: "home" | "all" | "profile";
  user_id?: number;
};

export default function Feed({ user, page, user_id }: Readonly<Props>) {
  const { posts, fetchNextPage, hasNextPage, isFetching, status, toggleLiked } =
    useFeed(page, user_id);

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
    return page == "home" || page == "all" ? (
      <EmptyFeed />
    ) : (
      <div>no posts</div>
    );
  }

  return (
    <Box
      sx={{
        marginBottom: "60px",
        px: { xs: 2, md: 4 },
        width: "100%",
      }}
    >
      {posts.pages.map((posts) =>
        posts.map((post) => (
          <Post
            key={post.post_id}
            id={post.post_id}
            user={user}
            date={new Date(post.postdate + "Z")}
            user_id={post.user_id}
            author={post.poster}
            imageUrl={post.imageBlobUrl}
            imageHeight={post.imageHeight}
            imageWidth={post.imageWidth}
            text={post.text}
            commentCount={post.comment_count}
            liked={post.liked}
            toggleLiked={() => toggleLiked(post.post_id)}
          />
        ))
      )}
      {isFetching && <Spinner />}
      <div ref={observerRef} style={{ height: "1px" }} />
      {!hasNextPage && page === "all" && <FeedBottom />}
    </Box>
  );
}
