import { useEffect, useState } from "react";
import { getImageUrl } from "../../../lib/images";
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
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    getImageUrl(path).then((url) => {
      if (url) setSrc(url);
    });
  }, [path]);

  return (
    <div>
      <ResponsiveImage
        setOpen={setOpen}
        src={src}
        height={height}
        width={width}
      />
      <ImageModal
        imagePath={path}
        src={src}
        imageHeight={height}
        imageWidth={width}
        open={open}
        handleClose={() => setOpen(false)}
      />
    </div>
  );
}
