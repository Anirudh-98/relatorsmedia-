import React from "react";
import Image from "next/image";

interface StarLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: "dark" | "white";
  showTagline?: boolean;
  className?: string;
}

export const StarLogo: React.FC<StarLogoProps> = ({
  size = 48,
  showText = true,
  textColor = "dark",
  showTagline = true,
  className = "",
}) => {
  const height = Math.round(size * (1159 / 1356));

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Real Realtors Media Star Logo Image */}
      <div className="relative flex-shrink-0" style={{ width: size, height }}>
        <Image
          src="/logo.webp"
          alt="Realtors Media Logo"
          width={size}
          height={height}
          className="object-contain w-auto h-full"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-baseline">
            <span className="text-[22px] sm:text-[25px] font-black tracking-tight text-[#E21F2F]">
              REALTORS
            </span>
            <span
              className={`text-[22px] sm:text-[25px] font-black tracking-tight ml-1 ${
                textColor === "white" ? "text-white" : "text-[#073F73]"
              }`}
            >
              MEDIA
            </span>
            <span
              className={`text-[11px] font-bold ml-0.5 align-super ${
                textColor === "white" ? "text-white" : "text-[#073F73]"
              }`}
            >
              ™
            </span>
          </div>
          <span className="text-[13px] sm:text-[14px] font-bold text-[#0B4F8A] -mt-0.5 tracking-wide">
            realtorsmedia.world
          </span>
          {showTagline && (
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold text-[#143B5D] tracking-tight whitespace-nowrap mt-0.5">
              Real Estate Information | People | Properties | Opportunities
            </span>
          )}
        </div>
      )}
    </div>
  );
};
