"use client";

interface SawtoothEdgeProps {
  position?: "top" | "bottom";
  paperColor?: string;
  className?: string;
}

export default function SawtoothEdge({
  position = "bottom",
  paperColor = "#F3EFE6",
  className = "",
}: SawtoothEdgeProps) {
  const toothWidth = 14;
  const toothHeight = 10;
  const patternId = `sawtooth-pattern-${position}`;

  if (position === "top") {
    return (
      <div
        className={`w-full overflow-hidden leading-none select-none ${className}`}
        style={{ height: `${toothHeight}px` }}
        aria-hidden="true"
      >
        <svg
          className="w-full h-full block"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id={patternId}
              width={toothWidth}
              height={toothHeight}
              patternUnits="userSpaceOnUse"
            >
              {/* Teeth pointing down into the paper from top cut */}
              <polygon
                points={`0,${toothHeight} ${toothWidth / 2},0 ${toothWidth},${toothHeight}`}
                fill={paperColor}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-hidden leading-none select-none ${className}`}
      style={{ height: `${toothHeight}px` }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={patternId}
            width={toothWidth}
            height={toothHeight}
            patternUnits="userSpaceOnUse"
          >
            {/* Teeth extending downward from paper body */}
            <polygon
              points={`0,0 ${toothWidth / 2},${toothHeight} ${toothWidth},0`}
              fill={paperColor}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
