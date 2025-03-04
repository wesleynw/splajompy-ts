import { XCircle } from "@phosphor-icons/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Props {
  image?: File;
  handleRemoveImage: () => void;
}

export default function ImagePreview({
  image,
  handleRemoveImage,
}: Readonly<Props>) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);

      setImageUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  if (!imageUrl) {
    return;
  }

  return (
    <div className="w-full">
      <Image
        src={imageUrl}
        alt="Selected preview"
        width={0}
        height={0}
        sizes="100vw"
        className="max-h-80 w-full object-contain"
      />
      <button
        className="absolute top-6 right-6"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleRemoveImage();
        }}
      >
        <XCircle size={30} className="text-black" />
      </button>
    </div>
  );
}
