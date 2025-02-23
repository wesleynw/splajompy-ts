import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ImagePreviewProps {
  previewFile: File | null;
  setFile: (file: File | null) => void;
  setPreviewFile: (file: File | null) => void;
}

export default function ImagePreview({
  previewFile,
  setFile,
  setPreviewFile,
}: Readonly<ImagePreviewProps>) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!previewFile) {
      setImageSrc(null);
      return;
    }

    const objectUrl = URL.createObjectURL(previewFile);
    setImageSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [previewFile]);

  const handleFileRemove = () => {
    setFile(null);
    setPreviewFile(null);
  };

  if (!imageSrc) {
    return null;
  }

  return (
    <div className="relative min-h-20 w-full">
      <Image
        src={imageSrc}
        alt="Selected preview"
        width={0}
        height={0}
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
          cursor: "pointer",
        }}
      />
      <IconButton
        onClick={handleFileRemove}
        sx={{
          position: "absolute",
          top: 4,
          right: 4,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
        }}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}
