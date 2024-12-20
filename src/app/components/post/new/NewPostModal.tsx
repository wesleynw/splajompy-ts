"use client";

import { useState } from "react";
import NewPostButton from "./NewPostButton";
import { Modal } from "@mui/material";
import NewPost from "./NewPost";

export default function NewPostModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <NewPostButton handleOpen={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
          },
        }}
      >
        <NewPost
          onPost={handleClose}
          insertPostToCache={() => console.log("a")}
        />
      </Modal>
    </>
  );
}
