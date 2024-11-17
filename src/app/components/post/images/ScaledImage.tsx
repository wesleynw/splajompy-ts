import React from "react";

interface ResponsiveImageProps {
  imagePath: string;
  width: number;
  height: number;
}

export default function ResponsiveImage({
  imagePath,
  width,
  height,
}: Readonly<ResponsiveImageProps>) {
  const threshold = 2;
  const isTall = height / width > threshold;
  const isWide = width / height > threshold;
  const isNonStandardSize = isTall || isWide;

  const src = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${imagePath}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="post image"
      style={{
        objectFit: isNonStandardSize! ? "cover" : "contain",
        maxHeight: isTall ? "200px" : "510px",
        maxWidth: isTall ? "300px" : "100%",
        minWidth: "50%",
        minHeight: "100px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    />
  );
}
