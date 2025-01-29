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
import React, { useEffect, useRef, useState } from "react";

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
  const [originalSize, setOriginalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const src = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${imagePath}`;
  const ref = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));

  const constrainPosition = (x: number, y: number, scale: number) => {
    if (!containerRef.current || !originalSize) return { x: 0, y: 0 };

    const container = containerRef.current.getBoundingClientRect();
    const scaledWidth = originalSize.width * scale;
    const scaledHeight = originalSize.height * scale;

    const maxX = Math.max(0, (scaledWidth - container.width) / 2);
    const maxY = Math.max(0, (scaledHeight - container.height) / 2);

    return {
      x: Math.max(Math.min(x, maxX), -maxX),
      y: Math.max(Math.min(y, maxY), -maxY),
    };
  };

  const handleDoubleTap = (clientX: number, clientY: number) => {
    const { width, height, x, y } = ref.current!.getBoundingClientRect();

    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const tx = clientX - centerX;
    const ty = clientY - centerY;

    const currentScale = style.scale.get();
    const newScale = currentScale < 1.5 ? 2.5 : 1;

    const scaleDelta = newScale - currentScale;
    const newX = style.x.get() - scaleDelta * tx;
    const newY = style.y.get() - scaleDelta * ty;

    const { x: constrainedX, y: constrainedY } = constrainPosition(
      newX,
      newY,
      newScale
    );

    api.start({ scale: newScale, x: constrainedX, y: constrainedY });
  };

  useGesture(
    {
      onDrag: ({ offset: [x, y], pinching, cancel, movement: [mx, my] }) => {
        if (pinching) return cancel();

        if (
          Math.abs(my) > 100 &&
          Math.abs(mx) < 50 &&
          style.scale.get() <= 1.2
        ) {
          handleClose();
          return;
        }
        const currentScale = style.scale.get();
        const { x: constrainedX, y: constrainedY } = constrainPosition(
          x,
          y,
          currentScale
        );
        api.start({ x: constrainedX, y: constrainedY });
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
        const { x: constrainedX, y: constrainedY } = constrainPosition(x, y, s);
        api.start({ scale: s, x: constrainedX, y: constrainedY });
        return memo;
      },

      onClick: ({ event }) => {
        function isTouchEvent(e: Event): e is TouchEvent {
          return "touches" in e;
        }

        const now = Date.now();
        const delta = now - lastTapRef.current;
        lastTapRef.current = now;

        if (delta < 300 && delta > 0) {
          event.stopPropagation();
          event.preventDefault();

          if (isTouchEvent(event) && event.touches.length > 0) {
            const x = event.touches[0].clientX;
            const y = event.touches[0].clientY;
            handleDoubleTap(x, y);
          } else {
            const x = event.clientX;
            const y = event.clientY;
            handleDoubleTap(x, y);
          }
        }
      },
    },
    {
      target: ref,
      drag: {
        from: () => [style.x.get(), style.y.get()],
        filterTaps: true,
        rubberband: true,
      },
      pinch: {
        scaleBounds: { min: 0.8, max: 4 },
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
        ref={containerRef}
        open
        sx={{
          backgroundColor: "black",
          zIndex: 2000,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          onLoad={() => {
            setLoaded(true);
            if (ref.current) {
              const rect = ref.current.getBoundingClientRect();
              setOriginalSize({ width: rect.width, height: rect.height });
            }
          }}
          style={{
            objectFit: "contain",
            width: "96%",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            ...style,
            touchAction: "none",
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
