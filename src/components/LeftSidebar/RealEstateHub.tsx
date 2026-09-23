"use client";

import React from "react";
import Link from "next/link";
import { FaFolder, FaChevronRight } from "react-icons/fa";
import { realEstateHubItems } from "@/data/portalData";

export const RealEstateHub: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-[4px] border border-[#C9D7E3] shadow-xs overflow-hidden flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="bg-[#073F73] px-3 py-1.5 text-white flex items-center justify-between border-b border-[#06345F] flex-shrink-0">
        <Link
          href="/classifieds"
          className="text-[13px] font-black uppercase tracking-wider hover:text-[#F7C900] transition-colors flex items-center gap-1.5"
          title="Open Real Estate Hub Classified Ads"
        >
          <span>REAL ESTATE HUB</span>
        </Link>
        <Link
          href="/classifieds"
          className="text-[10px] bg-[#F7C900] text-[#073F73] font-black px-1.5 py-0.5 rounded-xs hover:bg-yellow-400 transition-colors uppercase"
        >
          Ads
        </Link>
      </div>

      {/* Navigation List Items - 15 items distributed cleanly without vertical scrolling */}
      <ul className="divide-y divide-[#E6EEF5] text-[#143B5D] flex-1 min-h-0 flex flex-col justify-between">
        {realEstateHubItems.map((item) => {
          return (
            <li key={item.id} className="flex-1 min-h-0 flex items-center">
              <Link
                href={`/classifieds?category=${item.id}`}
                className="w-full text-left px-2.5 py-1 xl:py-1.2 flex items-center justify-between transition-colors group cursor-pointer h-full hover:bg-[#EEF6FC] hover:text-[#073F73]"
              >
                <div className="flex items-center gap-2 pr-1 min-w-0">
                  <FaFolder
                    className="flex-shrink-0 text-[13px] text-[#0B4F8A] group-hover:text-[#073F73]"
                  />
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-[11.5px] sm:text-[12px] xl:text-[12.5px] font-bold text-[#143B5D] group-hover:text-[#073F73] truncate">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-[9.5px] sm:text-[10px] text-gray-500 font-semibold leading-none truncate">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </div>
                <FaChevronRight
                  className="flex-shrink-0 text-[9px] text-[#94A3B8] group-hover:text-[#073F73]"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
