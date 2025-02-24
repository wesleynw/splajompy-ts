"use client";

import { insertPost } from "@/app/lib/posts";
import { getPresignedUrl } from "@/app/lib/s3";
import { User } from "@/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RichTextareaHandle } from "rich-textarea";
import { insertImage } from "../../../lib/actions";
import CenteredLayout from "../../layout/CenteredLayout";
import FileInput from "./FileInput";
import ImagePreview from "./ImagePreview";
import SubmitPostButton from "./SubmitPostButton";
import { TextInput } from "./TextInput";

type NewPostProps = {
  user: User;
  onPost: () => void;
  inputRef: React.RefObject<RichTextareaHandle | null>;
};

export default function Page({
  user,
  onPost,
  inputRef,
}: Readonly<NewPostProps>) {
  const queryClient = useQueryClient();

  const [textValue, setTextValue] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      return;
    }

    setIsLoading(true);

    const post = await insertPost(textValue);
    if (!post) {
      return;
    }

    const img = new Image();
    if (selectedFile) {
      try {
        img.src = URL.createObjectURL(selectedFile);

        await new Promise<void>((resolve) => {
          img.onload = () => {
            resolve();
            URL.revokeObjectURL(img.src);
          };
          img.onerror = () => {
            console.error("Failed to load image");
          };
        });

        const presignedUrlData = await getPresignedUrl(
          user.user_id,
          selectedFile.type,
          selectedFile.name,
        );
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

        await insertImage(post.post_id, uniqueFilename, img.width, img.height);
      } catch (err) {
        console.error("Error processing file upload", err);
      }
    }

    setTextValue("");
    setPreviewFile(null);
    setSelectedFile(null);
    setIsLoading(false);

    queryClient.invalidateQueries({ queryKey: ["feed"] });
    onPost();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <CenteredLayout>
      <form
        className="mt-10 w-full rounded-lg bg-neutral-900 px-5 py-7"
        onSubmit={handleSubmit}
      >
        <TextInput
          placeholder="What's on your mind?"
          value={textValue}
          setTextValue={setTextValue}
          inputRef={inputRef}
        />
        <ImagePreview
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
          setFile={setSelectedFile}
        />
        <div className="align-center flex w-full justify-between pt-5">
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
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </CenteredLayout>
  );
}
