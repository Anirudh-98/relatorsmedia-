"use client";

import React from "react";
import Link from "next/link";
import { FaTimes, FaHome, FaFolder } from "react-icons/fa";
import { navigationItems, realEstateHubItems } from "@/data/portalData";
import { StarLogo } from "./StarLogo";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="bg-[#073F73] text-white p-3 flex items-center justify-between border-b border-[#06345F]">
          <StarLogo size={32} textColor="white" showTagline={false} />
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-red-300 p-1 rounded-sm cursor-pointer"
            aria-label="Close navigation menu"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="p-3 border-b border-gray-200">
          <h4 className="text-[11px] font-black uppercase text-gray-500 mb-2 tracking-wider">
            Navigation
          </h4>
          <div className="space-y-1">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-[3px] text-[12px] font-bold transition-colors bg-[#E21F2F] text-white"
            >
              <FaHome />
              <span>HOME</span>
            </Link>
            <Link
              href="/classifieds"
              onClick={onClose}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-[3px] text-[12px] font-bold transition-colors text-[#073F73] bg-[#EEF6FC] hover:bg-[#E0EFFC]"
            >
              <FaFolder />
              <span>REAL ESTATE HUB / ADS</span>
            </Link>
            {navigationItems
              .filter((item) => item.label !== "HOME")
              .map((item) => (
                <Link
                  key={item.label}
                  href={item.href || "#"}
                  onClick={onClose}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-[3px] text-[12px] font-bold transition-colors text-[#143B5D] hover:bg-[#EEF6FC] hover:text-[#073F73]"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
          </div>
        </div>

        {/* Real Estate Hub Directory Accordion */}
        <div className="p-3 flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-black uppercase text-gray-500 tracking-wider">
              Real Estate Hub
            </h4>
            <Link
              href="/classifieds"
              onClick={onClose}
              className="text-[10px] text-[#073F73] font-bold underline"
            >
              View All Ads
            </Link>
          </div>
          <ul className="space-y-0.5 text-[11px] font-semibold text-[#143B5D]">
            {realEstateHubItems.map((hub) => (
              <li key={hub.id}>
                <Link
                  href={`/classifieds?category=${hub.id}`}
                  onClick={onClose}
                  className="flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-[#EEF6FC] transition-colors"
                >
                  <FaFolder className="text-[#0B4F8A] text-[10px] flex-shrink-0" />
                  <span className="truncate">{hub.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
