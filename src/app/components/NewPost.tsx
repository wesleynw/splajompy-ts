"use client";

import { useRef } from "react";
import { insertPost } from "../lib/actions";
import { Box, TextField, Button, Stack, useTheme } from "@mui/material";

export default function Page() {
  const ref = useRef<HTMLFormElement>(null);
  const theme = useTheme();

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
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        ...theme.applyStyles("dark", {
          backgroundColor: "#1c1c1c",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        }),
      }}
    >
      <TextField
        name="text"
        variant="outlined"
        placeholder="What's on your mind?"
        fullWidth
        multiline
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#f5f5f5",
            color: "#333333",
            "& fieldset": {
              borderColor: "#4a90e2",
            },
            "&:hover fieldset": {
              borderColor: "#357abf",
            },
            ...theme.applyStyles("dark", {
              backgroundColor: "#2b2b2b",
              color: "#e0e0e0",
            }),
          },
          "& .MuiInputBase-input": {
            color: "#333333",
            ...theme.applyStyles("dark", { color: "#e0e0e0" }),
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
            backgroundColor: "#4a90e2",
            color: "#ffffff",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#357abf",
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
