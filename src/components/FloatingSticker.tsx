"use client";

import { useState } from "react";
import Image from "next/image";
import { audioManager } from "./AudioManager";

interface FloatingStickerProps {
  src: string;
  alt: string;
  label?: string;
  initialRotate?: number;
  width?: number;
  height?: number;
  className?: string;
  sound?: "pop" | "stamp" | "static" | "keyclick";
}

export default function FloatingSticker({
  src,
  alt,
  label,
  initialRotate = 0,
  width = 110,
  height = 110,
  className = "",
  sound = "pop",
}: FloatingStickerProps) {
  const [isPopped, setIsPopped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.play(sound);
    setIsPopped(true);
    setTimeout(() => setIsPopped(false), 400);
  };

  return (
    <div
      className={`select-none cursor-pointer z-20 group transition-transform duration-300 ${className}`}
      style={{
        transform: `rotate(${initialRotate + (isHovered ? 4 : 0)}deg) scale(${isPopped ? 1.22 : isHovered ? 1.08 : 1})`,
        animation: "floatOrganic 6s ease-in-out infinite",
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={label || alt}
    >
      <div className="relative flex flex-col items-center">
        {/* Die-cut sticker drop shadow and border effect */}
        <div
          style={{
            filter: "drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45)) drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
            transition: "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            transform: isPopped ? "scale(1.15) rotate(-6deg)" : "scale(1)",
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="pointer-events-none object-contain transition-all duration-300"
            style={{
              maxHeight: `${height}px`,
              width: "auto",
            }}
          />
        </div>

        {/* Vintage sticker label */}
        {label && (
          <div
            className="mt-1 px-2 py-0.5 bg-[#09090b]/90 border border-white/20 text-[#EDE6F2] font-mono text-[9px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md rounded-xs"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
