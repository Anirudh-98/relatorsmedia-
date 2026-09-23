import React from "react";
import Link from "next/link";
import { StarLogo } from "../ui/StarLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#C9D7E3] py-1 sm:py-1.2 px-2 sm:px-3 xl:px-4 text-[#143B5D] flex-shrink-0">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-1.5 text-center md:text-left">
        {/* Left: Star Logo */}
        <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
          <StarLogo size={28} showTagline={false} />
        </Link>

        {/* Center: Community / Ecosystem links */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-[10px] sm:text-[10.5px] font-bold text-[#073F73]">
          <Link href="/properties" className="hover:text-[#E21F2F] transition-colors">
            Real Estate Information
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/realtors" className="hover:text-[#E21F2F] transition-colors">
            Professional Networking
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/business-opportunities" className="hover:text-[#E21F2F] transition-colors">
            Business Opportunities
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/community" className="hover:text-[#E21F2F] transition-colors">
            Trusted Community
          </Link>
        </div>

        {/* Right: Legal & Policy links */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-1 sm:gap-2 text-[9.5px] sm:text-[10px] font-semibold text-[#143B5D]">
          <Link href="/privacy-policy" className="hover:underline hover:text-[#073F73]">
            Privacy Policy
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/terms" className="hover:underline hover:text-[#073F73]">
            Terms & Conditions
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/help" className="hover:underline hover:text-[#073F73]">
            Help
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/contact" className="hover:underline hover:text-[#073F73]">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};
