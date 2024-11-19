"use client";

import { useRef, useState } from "react";
import { Box, Stack, useTheme } from "@mui/material";
import SubmitPostButton from "./SubmitPostButton";
import { TextInput } from "./TextInput";
import FileInput from "./FileInput";
import ImagePreview from "./ImagePreview";
import { getPresignedUrl } from "@/app/lib/s3";
import { insertImage, insertPost } from "../../../lib/actions";
import { useSession } from "next-auth/react";

export default function Page() {
  const ref = useRef<HTMLFormElement>(null);
  const theme = useTheme();

  const [textValue, setTextValue] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError("You must be logged in to post.");
      return;
    }

    if (error) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData(ref.current!);

    const post_id = await insertPost(formData, selectedFile !== null);

    if (selectedFile) {
      try {
        const img = new Image();
        img.src = URL.createObjectURL(selectedFile);

        await new Promise<void>((resolve) => {
          img.onload = () => {
            resolve();
          };
          img.onerror = () => {
            console.error("Failed to load image");
          };
        });

        const presignedUrlData = await getPresignedUrl(session.user.user_id);
        if (!presignedUrlData) {
          console.error("Failed to get presigned URL");
          return;
        }
        const { url, fields, uniqueFilename } = presignedUrlData;

        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("file", selectedFile);

        const uploadResponse = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          console.error("Failed to upload image");
          return;
        }

        await insertImage(post_id, uniqueFilename, img.width, img.height);
      } catch (err) {
        console.error("Error processing file upload", err);
      }
    }

    setTextValue("");
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
        borderRadius: "8px",
        margin: "10px auto",
        maxWidth: "600px",
        padding: 2,
        paddingY: 4,
        backgroundColor: "#ffffff",
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
        <TextInput
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
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
          setError={setError}
        />
        <SubmitPostButton
          isLoading={isLoading}
          disabled={!!error || (!textValue.trim() && !selectedFile)}
        />
      </Box>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
    </Stack>
  );
}
