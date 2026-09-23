"use client";

import React from "react";
import {
  FaUsers,
  FaBuilding,
  FaHome,
  FaMapMarkerAlt,
  FaThLarge,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { statisticsData } from "@/data/portalData";

export const StatisticsBar: React.FC = () => {
  const getStatIcon = (iconType: string) => {
    switch (iconType) {
      case "users":
        return <FaUsers className="text-white text-[17px] sm:text-[19px]" />;
      case "properties":
        return <FaBuilding className="text-white text-[17px] sm:text-[19px]" />;
      case "projects":
        return <FaHome className="text-white text-[17px] sm:text-[19px]" />;
      case "locations":
        return <FaMapMarkerAlt className="text-white text-[17px] sm:text-[19px]" />;
      case "categories":
        return <FaThLarge className="text-white text-[17px] sm:text-[19px]" />;
      default:
        return <FaBuilding className="text-white text-[17px]" />;
    }
  };

  return (
    <section className="w-full bg-[#073F73] text-white border-y border-[#06345F] py-1 sm:py-1.2 my-0.5 px-2 sm:px-3 xl:px-4 shadow-inner flex-shrink-0">
      <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-1.5 sm:gap-2">
        {/* Five Statistics Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 flex-1 w-full">
          {statisticsData.map((stat) => (
            <div
              key={stat.id}
              className="flex items-center gap-2 py-0.2 px-1 border-r border-white/15 last:border-r-0"
            >
              <div className="flex-shrink-0">{getStatIcon(stat.iconType)}</div>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] sm:text-[9.5px] font-medium text-gray-300">
                  {stat.label}
                </span>
                <span className="text-[13px] sm:text-[14px] font-black text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Slogan & Social Media Links */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="text-center sm:text-right leading-none">
            <span className="font-script text-[#F7C900] text-[14px] sm:text-[15px] font-bold block italic">
              Together for a
            </span>
            <span className="font-script text-[#F7C900] text-[15px] sm:text-[17px] font-black block italic -mt-0.5">
              Stronger Real Estate Ecosystem!
            </span>
          </div>

          {/* Social Media Rounded Buttons */}
          <div className="flex items-center gap-1">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5.5 h-5.5 rounded-[2px] bg-[#1877F2] hover:opacity-90 flex items-center justify-center text-white transition-opacity"
              aria-label="Facebook"
            >
              <FaFacebookF className="text-[10px]" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5.5 h-5.5 rounded-[2px] bg-linear-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] hover:opacity-90 flex items-center justify-center text-white transition-opacity"
              aria-label="Instagram"
            >
              <FaInstagram className="text-[10px]" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5.5 h-5.5 rounded-[2px] bg-[#FF0000] hover:opacity-90 flex items-center justify-center text-white transition-opacity"
              aria-label="YouTube"
            >
              <FaYoutube className="text-[10px]" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-5.5 h-5.5 rounded-[2px] bg-[#0A66C2] hover:opacity-90 flex items-center justify-center text-white transition-opacity"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="text-[10px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
