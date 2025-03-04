import { useState } from "react";
import ImageModal from "./ImageModal";
import ResponsiveImage from "./ResponsiveImage";

type Props = {
  path: string;
  height: number;
  width: number;
};

export default function ResponsiveImageModal({
  path,
  height,
  width,
}: Readonly<Props>) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <ResponsiveImage
        setOpen={setOpen}
        imagePath={path}
        height={height}
        width={width}
      />
      <ImageModal
        imagePath={path}
        imageHeight={height}
        imageWidth={width}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
}
