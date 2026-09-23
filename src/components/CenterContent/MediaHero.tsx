"use client";

import React from "react";

export const MediaHero: React.FC = () => {
  return (
    <div className="w-full rounded-[4px] border-2 border-[#0B4F8A] shadow-md overflow-hidden bg-black flex flex-col flex-shrink-0">
      {/* Real YouTube Video Embed */}
      <div className="relative w-full aspect-16/9 max-h-[190px] xl:max-h-[215px] 2xl:max-h-[235px] overflow-hidden">
        <iframe
          src="https://www.youtube-nocookie.com/embed/Ih-Fr67qdkE?rel=0&modestbranding=1"
          title="Realtors Media TV Broadcast"
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
};
