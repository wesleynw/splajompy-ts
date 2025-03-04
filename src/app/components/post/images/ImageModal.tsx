import {
  DownloadSimple as DownloadIcon,
  XCircle as XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { animated, useSpring } from "@react-spring/web";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Portal from "./Portal";

const useGesture = createUseGesture([dragAction, pinchAction]);
const AnimatedImage = animated(Image);

type ImageModalProps = {
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
  open: boolean;
  handleClose: () => void;
};

function ImageModalContent({
  imagePath,
  imageWidth,
  imageHeight,
  handleClose,
}: Readonly<ImageModalProps>) {
  const [loaded, setLoaded] = useState(false);
  const [originalSize, setOriginalSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const src = `https://splajompy-bucket.nyc3.cdn.digitaloceanspaces.com/${imagePath}`;
  const imageRef = useRef<HTMLImageElement>(null);
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
    if (!imageRef.current) return;

    const { width, height, x, y } = imageRef.current.getBoundingClientRect();

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
      newScale,
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
          currentScale,
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
        if (first && imageRef.current) {
          const { width, height, x, y } =
            imageRef.current.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo?.[0] - (ms - 1) * memo?.[2];
        const y = memo?.[1] - (ms - 1) * memo?.[3];
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
      target: containerRef,
      drag: {
        from: () => [style.x.get(), style.y.get()],
        filterTaps: true,
        rubberband: true,
      },
      pinch: {
        scaleBounds: { min: 1, max: 5 },
        rubberband: 0.5,
      },
    },
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
    <div className="fixed inset-0 z-[9999] h-screen w-screen bg-black">
      <button
        onClick={handleDownload}
        className="fixed top-4 right-14 z-[10000] rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
      >
        <DownloadIcon size={23} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleClose();
        }}
        className="fixed top-4 right-4 z-[10000] rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
      >
        <XCircleIcon size={23} />
      </button>

      <div
        ref={containerRef}
        className="flex h-screen w-screen touch-none items-center justify-center"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {!loaded && (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        )}
        <AnimatedImage
          ref={imageRef}
          src={src}
          alt="Modal Image"
          width={imageWidth}
          height={imageHeight}
          priority
          unoptimized
          onLoad={() => {
            setLoaded(true);
            if (imageRef.current) {
              const rect = imageRef.current.getBoundingClientRect();
              setOriginalSize({ width: rect.width, height: rect.height });
            }
          }}
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
            maxWidth: "100vw",
            maxHeight: "100vh",
            ...style,
            touchAction: "none",
            willChange: "transform",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

export default function ImageModal(props: Readonly<ImageModalProps>) {
  if (!props.open) return null;

  return (
    <Portal>
      <ImageModalContent {...props} />
    </Portal>
  );
}
