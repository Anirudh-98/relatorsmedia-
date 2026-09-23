"use client";

import React from "react";
import Link from "next/link";
import {
  FaSearch,
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaBullhorn,
  FaPlusSquare,
} from "react-icons/fa";
import { serviceItems } from "@/data/portalData";

export const ServicesSection: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FaPlusSquare className="text-white text-[15px]" />;
      case "search":
        return <FaSearch className="text-white text-[15px]" />;
      case "realtors":
        return <FaUsers className="text-white text-[15px]" />;
      case "projects":
        return <FaBuilding className="text-white text-[15px]" />;
      case "business":
        return <FaBriefcase className="text-white text-[15px]" />;
      case "advertise":
        return <FaBullhorn className="text-white text-[15px]" />;
      default:
        return <FaBuilding className="text-white text-[15px]" />;
    }
  };

  return (
    <section className="w-full my-0.5 sm:my-1 flex-shrink-0" aria-label="Services and Opportunities">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[12.5px] sm:text-[13px] font-black uppercase tracking-wide text-[#073F73]">
          SERVICES & OPPORTUNITIES
        </h3>
        <Link
          href="/services"
          className="bg-[#0B4F8A] hover:bg-[#073F73] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer"
        >
          View All
        </Link>
      </div>

      {/* 6 Horizontal Service Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 sm:gap-1.5">
        {serviceItems.map((item) => (
          <Link
            key={item.id}
            href={item.href || "/services"}
            className="bg-white hover:bg-[#EEF6FC] border border-[#C9D7E3] hover:border-[#0B4F8A] rounded-[3px] p-1 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs group h-[32px] sm:h-[34px] xl:h-[36px]"
          >
            {/* Colored Icon Box */}
            <div
              className="w-[22px] h-[22px] rounded-[2px] flex items-center justify-center flex-shrink-0 shadow-2xs"
              style={{ backgroundColor: item.iconColor }}
            >
              {getIcon(item.iconType)}
            </div>

            {/* Label */}
            <div className="flex flex-col text-left leading-tight overflow-hidden">
              <span className="text-[10px] sm:text-[10.5px] font-black text-[#143B5D] group-hover:text-[#073F73] whitespace-pre-line truncate">
                {item.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
