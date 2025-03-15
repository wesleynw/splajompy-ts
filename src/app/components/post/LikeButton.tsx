import { HeartStraight as HeartIcon } from "@phosphor-icons/react/dist/ssr";
import React, { useRef, useState } from "react";

type Props = {
  isComment?: boolean;
  liked: boolean;
  toggleLike: () => void;
};

export default function LikeButton({
  isComment = false,
  liked,
  toggleLike,
}: Readonly<Props>) {
  const [isPulsing, setIsPulsing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsPulsing(false);

    requestAnimationFrame(() => {
      setIsPulsing(true);
      toggleLike();

      timeoutRef.current = setTimeout(() => {
        setIsPulsing(false);
        timeoutRef.current = null;
      }, 800);
    });
  };

  return (
    <button className="relative m-1.5" onClick={handleClick}>
      <div className={`relative ${isPulsing ? "pulse-animation" : ""}`}>
        <HeartIcon
          className={isComment ? "size-5" : "size-7"}
          weight={liked ? "fill" : "regular"}
        />
        {isPulsing && liked && (
          <div className="pulse-ring absolute inset-0"></div>
        )}
      </div>
      <style>{`
        .pulse-animation {
          animation: smallPulse 0.8s ease-out;
        }
        .pulse-ring {
          pointer-events: none;
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid currentColor;
          opacity: 0;
          animation: pulseRing 0.8s ease-out;
        }
        @keyframes smallPulse {
          0% {
            transform: scale(1);
          }
          15% {
            transform: scale(1.15);
          }
          30% {
            transform: scale(1);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes pulseRing {
          0% {
            transform: scale(0.7);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
