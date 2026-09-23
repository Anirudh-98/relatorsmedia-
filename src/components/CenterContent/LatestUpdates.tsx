"use client";

import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { latestUpdates } from "@/data/portalData";

export const LatestUpdates: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-[4px] border border-[#C9D7E3] shadow-2xs flex items-center h-[24px] sm:h-[26px] overflow-hidden my-0.5 sm:my-1 min-w-0 flex-shrink-0">
      {/* Left Badge */}
      <Link
        href="/news"
        className="bg-[#E21F2F] hover:bg-[#c21422] text-white px-2.5 h-full flex items-center justify-center flex-shrink-0 transition-colors"
      >
        <span className="text-[9.5px] sm:text-[10px] font-black tracking-wider uppercase whitespace-nowrap">
          LATEST UPDATES
        </span>
      </Link>

      {/* Center Scrolling Ticker */}
      <Link href="/news" className="relative flex-1 min-w-0 overflow-hidden h-full flex items-center px-2 block">
        <div className="animate-ticker text-[11px] sm:text-[11.5px] font-bold text-[#143B5D] cursor-pointer">
          {latestUpdates.map((item, idx) => (
            <span key={idx} className="inline-flex items-center mx-3 hover:text-[#0B4F8A]">
              <span>{item}</span>
              <span className="ml-5 text-gray-300 font-normal">|</span>
            </span>
          ))}
          {/* Duplicate for smooth infinite loop */}
          {latestUpdates.map((item, idx) => (
            <span key={`dup-${idx}`} className="inline-flex items-center mx-3 hover:text-[#0B4F8A]">
              <span>{item}</span>
              <span className="ml-5 text-gray-300 font-normal">|</span>
            </span>
          ))}
        </div>
      </Link>

      {/* Right Action Button */}
      <div className="h-full flex items-center flex-shrink-0 pr-1 pl-1 bg-white">
        <Link
          href="/news"
          className="bg-[#0B4F8A] hover:bg-[#073F73] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-[2px] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <FaArrowRight className="text-[8px]" />
        </Link>
      </div>
    </div>
  );
};
