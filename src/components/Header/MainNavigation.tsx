"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaHome, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { navigationItems } from "@/data/portalData";

interface MainNavigationProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
  onMobileMenuToggle,
  isMobileMenuOpen = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/properties`);
    }
  };

  return (
    <nav className="w-full bg-[#073F73] text-white shadow-xs border-b border-[#06345F] sticky top-0 z-40 flex-shrink-0">
      <div className="w-full flex items-center h-[34px] sm:h-[36px] px-3 sm:px-4">
        {/* Mobile menu hamburger toggle */}
        <div className="flex items-center lg:hidden mr-1">
          <button
            onClick={onMobileMenuToggle}
            type="button"
            className="p-1 text-white hover:bg-[#0B4F8A] rounded-[3px] focus:outline-hidden"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>

        {/* Desktop Navigation Links with margin-left and space between each link */}
        <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 h-full overflow-hidden ml-1 sm:ml-2 xl:ml-4">
          {navigationItems.map((item) => {
            const isHome = item.label === "HOME";
            const isSelected = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href || "");

            if (isHome) {
              return (
                <Link
                  key={item.label}
                  href="/"
                  className={`font-black text-[12px] xl:text-[13px] tracking-wider px-3 py-1 rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0 mr-1 ${
                    pathname === "/"
                      ? "bg-[#E21F2F] text-white shadow-xs"
                      : "bg-[#0B4F8A] hover:bg-[#E21F2F] text-white"
                  }`}
                >
                  <FaHome className="text-[12px]" />
                  <span>HOME</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href || "#"}
                className={`text-white font-extrabold text-[11px] xl:text-[12px] tracking-tight px-2 xl:px-2.5 py-1 rounded-[2px] flex items-center transition-colors hover:bg-[#0B4F8A] whitespace-nowrap cursor-pointer flex-shrink-0 ${
                  isSelected ? "bg-[#0B4F8A] underline underline-offset-4 decoration-2" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Property Search Input Bar positioned on the right side with comfortable margin */}
        <form
          onSubmit={handleSearch}
          className="flex items-center ml-auto mr-4 sm:mr-8 lg:mr-14 xl:mr-20 2xl:mr-32 w-[240px] sm:w-[270px] xl:w-[300px] flex-shrink-0"
        >
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Properties, Projects, Locations..."
              className="w-full bg-white text-[#18324A] text-[11px] xl:text-[11.5px] px-2.5 py-0.5 rounded-l-[3px] focus:outline-hidden border-0 placeholder:text-gray-500 h-[26px]"
            />
            <button
              type="submit"
              className="bg-[#E21F2F] hover:bg-[#F11D32] text-white px-3 h-[26px] rounded-r-[3px] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              aria-label="Search button"
            >
              <FaSearch className="text-[11px]" />
            </button>
          </div>
        </form>
      </div>
    </nav>
  );
};
