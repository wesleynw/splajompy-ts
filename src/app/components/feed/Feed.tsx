"use client";

import { Box, Typography } from "@mui/material";
import { Session } from "next-auth";
import { useEffect, useRef } from "react";
import { useFeed } from "@/app/data/posts";
import Post from "../post/Post";
import NewPost from "../post/NewPost/NewPost";

type Props = {
  session: Session;
  page: "home" | "all" | "profile";
  user_id?: number;
};

export default function Feed({ session, page, user_id }: Readonly<Props>) {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { data, hasMore, setSize, updatePost, insertPost, deletePost } =
    useFeed(page, user_id);

  useEffect(() => {
    console.log("hasMore", hasMore);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Intersecting");
          setSize((prevSize) => prevSize + 1);
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
  }, [data, setSize, hasMore]);

  if (!data) {
    return <div>loading</div>;
  }

  if (data.length === 0) {
    return <div>No posts to display</div>;
  }

  return (
    <Box
      sx={{
        marginBottom: "60px",
        px: { xs: 2, md: 4 },
        width: "100%",
      }}
    >
      {page !== "profile" && <NewPost insertPostToCache={insertPost} />}
      {data.map((posts) =>
        posts.map((post) => (
          <Post
            updatePost={updatePost}
            deletePost={deletePost}
            key={post.post_id}
            session={session}
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
          />
        ))
      )}
      <div ref={observerRef} style={{ height: "1px" }} />
      {!hasMore && page === "all" && (
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
