import CloseIcon from "@mui/icons-material/Close";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import { animated, useSpring } from "@react-spring/web";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const useGesture = createUseGesture([dragAction, pinchAction]);

const AnimatedImage = animated(Image);

interface ImageModalProps {
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  open: boolean;
  handleClose: () => void;
}

export default function ImageModal({
  imagePath,
  imageWidth,
  imageHeight,
  open,
  handleClose,
}: Readonly<ImageModalProps>) {
  const [loaded, setLoaded] = useState(false);

  const src = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${imagePath}`;
  const ref = useRef<HTMLImageElement>(null);

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 0.9,
    rotateZ: 0,
  }));

  const resetTransformations = () => {
    api.start({ x: 0, y: 0, scale: 0.9, rotateZ: 0 });
  };

  useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        api.start({ x, y });
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s],
        memo,
      }) => {
        if (first) {
          const { width, height, x, y } = ref.current!.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo[0] - (ms - 1) * memo[2];
        const y = memo[1] - (ms - 1) * memo[3];
        api.start({ scale: s, x, y });
        return memo;
      },
      onDoubleClick: () => resetTransformations(),
    },
    {
      target: ref,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 0.9, max: 5 }, rubberband: true },
    }
  );

  useEffect(() => {
    if (open) {
      resetTransformations();
      setLoaded(false); // Reset the loaded state
    }
  }, [open, resetTransformations]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const link = document.createElement("a");
    link.href = src;
    link.download = imagePath.split("/").pop() ?? "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal open={open} onClose={handleClose} style={{ zIndex: 10000 }}>
      <Box sx={{ zIndex: 10001 }}>
        <IconButton
          onClick={handleDownload}
          sx={{
            position: "fixed",
            top: 16,
            right: 56,
            zIndex: 4000,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <VerticalAlignBottomIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleClose();
          }}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 4000,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Backdrop
          open={open}
          sx={{
            backgroundColor: "black",
            zIndex: 2000,
            width: "100%",
            height: "100%",
          }}
        >
          {!loaded && <CircularProgress />}
          <AnimatedImage
            ref={ref}
            src={src}
            alt="Modal Image"
            width={imageWidth}
            height={imageHeight}
            onLoad={() => setLoaded(true)}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              ...style,
              touchAction: "none",
              position: "absolute",
              willChange: "transform",
            }}
          />
        </Backdrop>
      </Box>
    </Modal>
  );
}
