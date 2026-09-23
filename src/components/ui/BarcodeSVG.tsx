import React from "react";

export interface BarcodeSVGProps {
  value: string;
  className?: string;
  color?: string;
  height?: number;
}

// Standard Code 39 encoding table
// 5 bars (positions 0, 2, 4, 6, 8) and 4 spaces (positions 1, 3, 5, 7)
// 1 = wide, 0 = narrow
const CODE39_MAP: Record<string, number[]> = {
  "0": [0, 0, 0, 1, 1, 0, 1, 0, 0],
  "1": [1, 0, 0, 1, 0, 0, 0, 0, 1],
  "2": [0, 0, 1, 1, 0, 0, 0, 0, 1],
  "3": [1, 0, 1, 1, 0, 0, 0, 0, 0],
  "4": [0, 0, 0, 1, 1, 0, 0, 0, 1],
  "5": [1, 0, 0, 1, 1, 0, 0, 0, 0],
  "6": [0, 0, 1, 1, 1, 0, 0, 0, 0],
  "7": [0, 0, 0, 1, 0, 0, 1, 0, 1],
  "8": [1, 0, 0, 1, 0, 0, 1, 0, 0],
  "9": [0, 0, 1, 1, 0, 0, 1, 0, 0],
  "A": [1, 0, 0, 0, 0, 1, 0, 0, 1],
  "B": [0, 0, 1, 0, 0, 1, 0, 0, 1],
  "C": [1, 0, 1, 0, 0, 1, 0, 0, 0],
  "D": [0, 0, 0, 0, 1, 1, 0, 0, 1],
  "E": [1, 0, 0, 0, 1, 1, 0, 0, 0],
  "F": [0, 0, 1, 0, 1, 1, 0, 0, 0],
  "G": [0, 0, 0, 0, 0, 1, 1, 0, 1],
  "H": [1, 0, 0, 0, 0, 1, 1, 0, 0],
  "I": [0, 0, 1, 0, 0, 1, 1, 0, 0],
  "J": [0, 0, 0, 0, 1, 1, 1, 0, 0],
  "K": [1, 0, 0, 0, 0, 0, 0, 1, 1],
  "L": [0, 0, 1, 0, 0, 0, 0, 1, 1],
  "M": [1, 0, 1, 0, 0, 0, 0, 1, 0],
  "N": [0, 0, 0, 0, 1, 0, 0, 1, 1],
  "O": [1, 0, 0, 0, 1, 0, 0, 1, 0],
  "P": [0, 0, 1, 0, 1, 0, 0, 1, 0],
  "Q": [0, 0, 0, 0, 0, 0, 1, 1, 1],
  "R": [1, 0, 0, 0, 0, 0, 1, 1, 0],
  "S": [0, 0, 1, 0, 0, 0, 1, 1, 0],
  "T": [0, 0, 0, 0, 1, 0, 1, 1, 0],
  "U": [1, 1, 0, 0, 0, 0, 0, 0, 1],
  "V": [0, 1, 1, 0, 0, 0, 0, 0, 1],
  "W": [1, 1, 1, 0, 0, 0, 0, 0, 0],
  "X": [0, 1, 0, 0, 1, 0, 0, 0, 1],
  "Y": [1, 1, 0, 0, 1, 0, 0, 0, 0],
  "Z": [0, 1, 1, 0, 1, 0, 0, 0, 0],
  "-": [0, 1, 0, 0, 0, 0, 1, 0, 1],
  ".": [1, 1, 0, 0, 0, 0, 1, 0, 0],
  " ": [0, 1, 1, 0, 0, 0, 1, 0, 0],
  "$": [0, 1, 0, 1, 0, 1, 0, 0, 0],
  "/": [0, 1, 0, 1, 0, 0, 0, 1, 0],
  "+": [0, 1, 0, 0, 0, 1, 0, 1, 0],
  "%": [0, 0, 0, 1, 0, 1, 0, 1, 0],
  "*": [0, 1, 0, 0, 1, 0, 1, 0, 0],
};

export const BarcodeSVG: React.FC<BarcodeSVGProps> = ({
  value,
  className = "",
  color = "#0F172A",
  height = 40,
}) => {
  const cleanStr = (value || "ID")
    .toUpperCase()
    .replace(/[^0-9A-Z\-.$/+% ]/g, "-");

  const fullStr = `*${cleanStr}*`;

  const NARROW_WIDTH = 1.3;
  const WIDE_WIDTH = 3.2;
  const GAP_WIDTH = 1.3;

  let currentX = 2;
  const rects: React.ReactNode[] = [];

  for (let c = 0; c < fullStr.length; c++) {
    const char = fullStr[c];
    const pattern = CODE39_MAP[char] || CODE39_MAP["-"];

    for (let i = 0; i < pattern.length; i++) {
      const isWide = pattern[i] === 1;
      const w = isWide ? WIDE_WIDTH : NARROW_WIDTH;
      const isBar = i % 2 === 0;

      if (isBar) {
        rects.push(
          <rect
            key={`${c}-${i}`}
            x={currentX}
            y={0}
            width={w}
            height={height}
            fill={color}
          />
        );
      }
      currentX += w;
    }
    currentX += GAP_WIDTH;
  }

  const totalWidth = currentX + 2;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      preserveAspectRatio="none"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {rects}
    </svg>
  );
};
