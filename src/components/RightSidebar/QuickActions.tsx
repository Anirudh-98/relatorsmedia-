"use client";

import React from "react";
import Link from "next/link";
import {
  FaBolt,
  FaHome,
  FaSearch,
  FaUsers,
  FaBuilding,
  FaUserPlus,
  FaBullhorn,
  FaMobileAlt,
  FaNewspaper,
  FaChevronRight,
} from "react-icons/fa";

export const QuickActions: React.FC = () => {
  const leftActions = [
    { title: "Post Property (FREE)", icon: <FaHome className="text-[#0B4F8A]" />, href: "/post-property" },
    { title: "Search Properties", icon: <FaSearch className="text-[#0B4F8A]" />, href: "/properties" },
    { title: "Find Realtors", icon: <FaUsers className="text-[#0B4F8A]" />, href: "/realtors" },
    { title: "Find Projects", icon: <FaBuilding className="text-[#0B4F8A]" />, href: "/projects" },
  ];

  const rightActions = [
    { title: "Register as Member", icon: <FaUserPlus className="text-[#0B4F8A]" />, href: "/register" },
    { title: "Advertise With Us", icon: <FaBullhorn className="text-[#0B4F8A]" />, href: "/advertise" },
    { title: "Download Mobile App", icon: <FaMobileAlt className="text-[#0B4F8A]" />, href: "/mobile-app" },
    { title: "Latest News & Updates", icon: <FaNewspaper className="text-[#0B4F8A]" />, href: "/news" },
  ];

  return (
    <div className="w-full bg-white rounded-[4px] border border-[#C9D7E3] shadow-xs overflow-hidden flex-shrink-0">
      {/* Yellow Header */}
      <div className="bg-[#F7C900] px-2.5 py-0.5 flex items-center gap-1.5 border-b border-[#e2b800]">
        <FaBolt className="text-[#073F73] text-[11px]" />
        <h3 className="text-[11.5px] sm:text-[12px] font-black uppercase text-[#073F73] tracking-wide">
          QUICK ACTIONS
        </h3>
      </div>

      {/* 2-Column Action Grid */}
      <div className="p-1 sm:p-1.5 grid grid-cols-2 gap-1 text-[9.5px] sm:text-[10px] font-bold text-[#143B5D]">
        {/* Left Column */}
        <div className="space-y-0.5">
          {leftActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="w-full text-left bg-[#F8FAFC] hover:bg-[#EEF6FC] border border-[#E2E8F0] hover:border-[#0B4F8A] rounded-[3px] px-1.5 py-0.5 flex items-center justify-between transition-colors group cursor-pointer h-[22px] sm:h-[23px]"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-[10px] group-hover:scale-110 transition-transform">
                  {action.icon}
                </span>
                <span className="truncate leading-none">{action.title}</span>
              </div>
              <FaChevronRight className="text-[7.5px] text-gray-400 group-hover:text-[#073F73] flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-0.5">
          {rightActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="w-full text-left bg-[#F8FAFC] hover:bg-[#EEF6FC] border border-[#E2E8F0] hover:border-[#0B4F8A] rounded-[3px] px-1.5 py-0.5 flex items-center gap-1.5 transition-colors group cursor-pointer h-[22px] sm:h-[23px]"
            >
              <span className="text-[10px] group-hover:scale-110 transition-transform flex-shrink-0">
                {action.icon}
              </span>
              <span className="truncate leading-none">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
