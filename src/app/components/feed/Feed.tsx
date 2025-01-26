"use client";

import { useFeed } from "@/app/data/posts";
import { User } from "@/db/schema";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import Spinner from "../loading/Spinner";
import Post from "../post/Post";
import EmptyFeed from "./EmptyFeed";

type Props = {
  user: User;
  page: "home" | "all" | "profile";
  user_id?: number;
};

export default function Feed({ user, page, user_id }: Readonly<Props>) {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    status,
    updateCachedPost,
    deletePost,
    toggleLiked,
  } = useFeed(page, user_id);

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

  if (!data) {
    return <div>no data</div>;
  }

  if (data.pages.length === 1 && data.pages[0].length === 0) {
    return <EmptyFeed />;
  }

  return (
    <Box
      sx={{
        marginBottom: "60px",
        px: { xs: 2, md: 4 },
        width: "100%",
      }}
    >
      {data.pages.map((posts) =>
        posts.map((post) => (
          <Post
            updatePost={updateCachedPost}
            deletePost={deletePost}
            key={post.post_id}
            user={user}
            id={post.post_id}
            date={new Date(post.postdate + "Z")}
            user_id={post.user_id}
            poster={post.poster}
            imageHeight={post.imageHeight}
            imageWidth={post.imageWidth}
            content={post.text}
            imagePath={post.imageBlobUrl}
            comment_count={post.comment_count}
            likedByCurrentUser={post.liked}
            toggleLiked={() => toggleLiked(post.post_id)}
          />
        ))
      )}
      {isFetching && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          margin="0 auto"
          width="100%"
          maxWidth="600px"
          height="30vh"
        >
          <CircularProgress />
        </Box>
      )}
      <div ref={observerRef} style={{ height: "1px" }} />
      {!hasNextPage && page === "all" && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          margin="0 auto"
          width="100%"
          maxWidth="600px"
          height="30vh"
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "#777777",
              paddingBottom: 2,
            }}
          >
            Is that the very first post? <br />
            What came before that? <br />
            Nothing at all? <br />
            It always just{" "}
            <Box fontWeight="800" display="inline">
              Splajompy
            </Box>
            .
          </Typography>
        </Box>
      )}
    </Box>
  );
}
