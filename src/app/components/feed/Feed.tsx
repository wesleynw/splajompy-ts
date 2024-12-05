"use client";

import { Box, CircularProgress } from "@mui/material";
import NewPost from "../post/NewPost/NewPost";
import EmptyFeed from "./EmptyFeed";
import { FeedType, PostType, useFeed } from "../../data/FeedProvider";
import { SessionProvider, signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Post from "../post/Post";

export type Props = {
  session: Session;
  feedType: FeedType;
  showNewPost: boolean;
};

export default function Feed({
  session,
  feedType,
  showNewPost,
}: Readonly<Props>) {
  const router = useRouter();
  const {
    homePosts,
    allPosts,
    profilePosts,
    loading,
    error,
    fetchPosts,
    updatePost,
    insertPostToFeed,
    deletePostFromFeed,
  } = useFeed();
  useEffect(() => {
    if (!session.user.username) {
      signOut();
      router.push("/login");
    }

    const hydratePosts = async () => {
      fetchPosts(feedType, session.user.user_id);
    };

    hydratePosts(); // TODO: better name for this function?
  }, [
    router,
    fetchPosts,
    feedType,
    session.user.username,
    session.user.user_id,
  ]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="30vh"
      >
        <div>Something went wrong. Please try again later.</div>
      </Box>
    );
  }

  let currentPosts;
  switch (feedType) {
    case "home":
      currentPosts = homePosts;
      break;
    case "all":
      currentPosts = allPosts;
      break;
    case "profile":
      currentPosts = profilePosts;
      break;
    default:
      throw new Error("Invalid feed type");
  }

  const isOnlyCurrentUsersPosts = currentPosts.every(
    (post) => post.user_id === session.user.user_id
  );

  return (
    <Box sx={{ marginBottom: "60px", px: { xs: 2, md: 4 } }}>
      <SessionProvider session={session}>
        {/* this lambda is also weird, need to fix */}
        {showNewPost && (
          <NewPost
            insertPostToFeed={(post) => insertPostToFeed(feedType, post)}
          />
        )}
        {isOnlyCurrentUsersPosts && <EmptyFeed loading={loading} />}
        {currentPosts.map((post) => (
          <Post
            key={post.post_id}
            id={post.post_id}
            date={new Date(post.postdate + "Z")}
            content={post.text}
            imagePath={post.imageBlobUrl}
            {...post}
            likedByCurrentUser={post.liked}
            updateParentContext={(updatedAttributes: Partial<PostType>) => {
              updatePost(post.post_id, updatedAttributes);
            }}
            onDelete={() => deletePostFromFeed(feedType, post.post_id)}
          />
        ))}
      </SessionProvider>
    </Box>
  );
}
