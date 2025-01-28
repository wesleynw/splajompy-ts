import CloseIcon from "@mui/icons-material/Close";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
} from "@mui/material";
import { animated, useSpring } from "@react-spring/web";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import Image from "next/image";
import React, { useRef, useState } from "react";

const useGesture = createUseGesture([dragAction, pinchAction]);
const AnimatedImage = animated(Image);

interface ImageModalProps {
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  open: boolean;
  handleClose: () => void;
}

function ImageModalContent({
  imagePath,
  imageWidth,
  imageHeight,
  handleClose,
}: Readonly<Omit<ImageModalProps, "open">>) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${imagePath}`;
  const ref = useRef<HTMLImageElement>(null);

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));

  const resetTransformations = () => {
    api.start({
      x: 0,
      y: 0,
      scale: 1,
      rotateZ: 0,
    });
  };

  const calculateBounds = (scale: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const imageAspectRatio = imageWidth / imageHeight;
    const viewportAspectRatio = viewportWidth / viewportHeight;

    let displayWidth, displayHeight;

    if (imageAspectRatio > viewportAspectRatio) {
      displayWidth = viewportWidth;
      displayHeight = viewportWidth / imageAspectRatio;
    } else {
      displayHeight = viewportHeight;
      displayWidth = viewportHeight * imageAspectRatio;
    }

    const scaledWidth = displayWidth * scale;
    const scaledHeight = displayHeight * scale;

    const maxX = Math.max(0, (scaledWidth - viewportWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - viewportHeight) / 2);

    return { maxX, maxY, scaledWidth, scaledHeight };
  };

  useGesture(
    {
      onDrag: ({ offset: [x, y], pinching, cancel, movement: [, my] }) => {
        if (pinching) return cancel();

        const scale = style.scale.get();
        const { maxX, maxY } = calculateBounds(scale);

        // Only check for swipe-to-close when the image is at normal scale
        // if (scale <= 1.2 && my > 100 && Math.abs(x) < 50) {
        if (my > 100 && Math.abs(x) < 50) {
          handleClose();
          return;
        }

        // Normal drag behavior
        const clampedX = Math.max(Math.min(x, maxX), -maxX);
        const clampedY = Math.max(Math.min(y, maxY), -maxY);

        api.start({
          x: clampedX,
          y: clampedY,
          immediate: true,
        });
      },
      onPinch: ({ origin: [ox, oy], first, offset: [s], memo }) => {
        if (first) {
          const { width, height, x, y } = ref.current!.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const scale = Math.max(1, Math.min(s, 5));
        const x = memo[0] - (scale - 1) * memo[2];
        const y = memo[1] - (scale - 1) * memo[3];

        const { maxX, maxY } = calculateBounds(scale);

        const clampedX = Math.max(Math.min(x, maxX), -maxX);
        const clampedY = Math.max(Math.min(y, maxY), -maxY);

        api.start({ scale, x: clampedX, y: clampedY });
        return memo;
      },
      onDoubleClick: () => resetTransformations(),
    },
    {
      target: ref,
      drag: {
        from: () => [style.x.get(), style.y.get()],
        filterTaps: true,
        rubberband: true,
      },
      pinch: {
        scaleBounds: { min: 0.9, max: 5 },
        rubberband: true,
      },
    }
  );

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
        open
        sx={{
          backgroundColor: "black",
          zIndex: 2000,
          width: "100%",
          height: "100%",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {!loaded && <CircularProgress />}
        <AnimatedImage
          ref={ref}
          src={src}
          alt="Modal Image"
          width={imageWidth}
          height={imageHeight}
          priority
          unoptimized
          onLoad={() => setLoaded(true)}
          style={{
            objectFit: "contain",
            width: "96%",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            ...style,
            touchAction: "none",
            position: "absolute",
            willChange: "transform",
          }}
        />
      </Backdrop>
    </Box>
  );
}

export default function ImageModal(props: Readonly<ImageModalProps>) {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      style={{ zIndex: 10000 }}
    >
      <ImageModalContent
        imagePath={props.imagePath}
        imageWidth={props.imageWidth}
        imageHeight={props.imageHeight}
        handleClose={props.handleClose}
      />
    </Modal>
  );
}
