"use client";

import { useRef, useState } from "react";
import { insertPost } from "../../../lib/actions";
import { Box, Stack, useTheme } from "@mui/material";
import SubmitPostButton from "./SubmitPostButton";
import { TextInput } from "./TextInput";
import FileInput from "./FileInput";
import ImagePreview from "./ImagePreview";

export default function Page() {
  const ref = useRef<HTMLFormElement>(null);
  const theme = useTheme();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(ref.current!);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    await insertPost(formData);
    ref.current?.reset();
    setPreviewFile(null);
    setSelectedFile(null);
    setIsLoading(false);
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      component="form"
      ref={ref}
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        padding: 2,
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        ...theme.applyStyles("dark", {
          backgroundColor: "#1c1c1c",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        }),
      }}
      spacing={2}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={2}
        sx={{ width: "100%" }}
      >
        <TextInput />
      </Stack>

      <ImagePreview
        previewFile={previewFile}
        setPreviewFile={setPreviewFile}
        setFile={setSelectedFile}
      />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          marginTop: "16px",
        }}
      >
        <FileInput
          file={selectedFile}
          setFile={setSelectedFile}
          setPreviewFile={setPreviewFile}
        />
        <SubmitPostButton isLoading={isLoading} />
      </Box>
    </Stack>
  );
}
