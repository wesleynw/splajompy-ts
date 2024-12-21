"use client";

import { Slide, Box } from "@mui/material";
import NewPost from "./NewPost";
import { useRef } from "react";

type Props = {
  open: boolean;
  toggleOpen: () => void;
};

export default function NewPostDialog({ open, toggleOpen }: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Slide
      direction="down"
      in={open}
      mountOnEnter
      onEnter={() => inputRef.current?.focus()}
    >
      <Box
        sx={{
          position: "fixed", // Relative to viewport
          top: "60px", // Below navbar
          left: 0,
          width: "100vw", // Full width
          height: "calc(100vh - 60px)", // Height minus navbar
          backdropFilter: "blur(10px)",
          // zIndex: 99, // Explicitly lower than navbar (moved from Slide)
          display: "flex", // Flex for centering
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 24, // Optional shadow
          overflow: "hidden", // Avoid overflow
          zIndex: 1299, // Explicitly higher than navbar
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            toggleOpen();
          }
        }}
      >
        <NewPost
          onPost={toggleOpen}
          insertPostToCache={() => console.log("a")}
          inputRef={inputRef}
        />
      </Box>
    </Slide>
  );
}
