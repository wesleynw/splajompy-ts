"use client";

import { useRef } from "react";
import { insertPost } from "../lib/actions";
import { Box, TextField, Button, Stack } from "@mui/material";

export default function Page() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      component="form"
      ref={ref}
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(ref.current!);
        await insertPost(formData);
        ref.current?.reset();
      }}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        padding: 2,
        backgroundColor: "#1e1e1e",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <TextField
        name="text"
        variant="outlined"
        placeholder="What's on your mind?"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px", // Rounded corners
            backgroundColor: "#2a2a2a", // Darker background
            color: "#ffffff",
            "& fieldset": {
              borderColor: "#3a86ff", // Custom border color
            },
            "&:hover fieldset": {
              borderColor: "#3a86ff", // Custom border color on hover
            },
          },
          "& .MuiInputBase-input": {
            color: "#ffffff", // Input text color
          },
        }}
      />

      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: "20px",
            padding: "10px 20px",
            backgroundColor: "#3a86ff",
            color: "#ffffff",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
            display: "flex",
            gap: 1,
            height: "100%",
          }}
        >
          Post
        </Button>
      </Box>
    </Stack>
  );
}
