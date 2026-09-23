import React from "react";
import Link from "next/link";
import { StarLogo } from "../ui/StarLogo";
import { FaPlay, FaMobileAlt, FaCheckCircle } from "react-icons/fa";

export const TopHeader: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-[#C9D7E3] py-1 sm:py-1.5 px-2 sm:px-3 xl:px-4 flex-shrink-0">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-95 transition-opacity">
          <StarLogo size={42} showText={true} showTagline={true} />
        </Link>

        {/* Center: Delicate Skyline & Cursive Slogan */}
        <div className="relative flex-1 hidden md:flex flex-col items-center justify-center px-4 min-h-[48px]">
          {/* Detailed skyline silhouette vector */}
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none opacity-20 overflow-hidden">
            <svg
              className="w-full h-9 text-[#073F73]"
              viewBox="0 0 700 80"
              fill="currentColor"
              preserveAspectRatio="none"
            >
              <rect x="10" y="35" width="18" height="45" />
              <rect x="30" y="20" width="22" height="60" />
              <polygon points="30,20 41,6 52,20" />
              <rect x="54" y="45" width="16" height="35" />
              <rect x="72" y="15" width="24" height="65" />
              <rect x="98" y="30" width="18" height="50" />
              <rect x="118" y="10" width="26" height="70" />
              <polygon points="118,10 131,2 144,10" />
              <rect x="146" y="35" width="20" height="45" />
              <rect x="168" y="25" width="24" height="55" />
              <rect x="194" y="45" width="18" height="35" />
              <rect x="214" y="15" width="28" height="65" />
              <polygon points="214,15 228,4 242,15" />
              <rect x="244" y="30" width="20" height="50" />
              <rect x="266" y="40" width="16" height="40" />
              <rect x="284" y="18" width="26" height="62" />
              <rect x="312" y="32" width="18" height="48" />
              <rect x="332" y="8" width="30" height="72" />
              <polygon points="332,8 347,0 362,8" />
              <rect x="364" y="28" width="22" height="52" />
              <rect x="388" y="45" width="18" height="35" />
              <rect x="408" y="20" width="26" height="60" />
              <rect x="436" y="35" width="20" height="45" />
              <rect x="458" y="12" width="28" height="68" />
              <polygon points="458,12 472,3 486,12" />
              <rect x="488" y="30" width="20" height="50" />
              <rect x="510" y="42" width="18" height="38" />
              <rect x="530" y="18" width="26" height="62" />
              <rect x="558" y="32" width="20" height="48" />
              <rect x="580" y="22" width="18" height="58" />
              <rect x="600" y="15" width="26" height="65" />
              <polygon points="600,15 613,4 626,15" />
              <rect x="628" y="32" width="22" height="48" />
              <rect x="652" y="45" width="18" height="35" />
              <rect x="672" y="22" width="24" height="58" />
            </svg>
          </div>

          {/* Slogan & Value Props Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="font-script text-[20px] lg:text-[23px] xl:text-[25px] font-bold text-[#073F73] tracking-wide leading-tight italic">
              Connecting Real Estate... Creating Better Communities!
            </span>
            <div className="flex items-center gap-2.5 sm:gap-5 mt-0.5 text-[11.5px] xl:text-[12px] font-extrabold text-[#143B5D]">
              <span className="flex items-center gap-1.5">
                <FaCheckCircle className="text-[#168A3A] text-[12px]" /> Right Property
              </span>
              <span className="flex items-center gap-1.5">
                <FaCheckCircle className="text-[#168A3A] text-[12px]" /> Right People
              </span>
              <span className="flex items-center gap-1.5">
                <FaCheckCircle className="text-[#168A3A] text-[12px]" /> Right Opportunities
              </span>
              <span className="flex items-center gap-1.5">
                <FaCheckCircle className="text-[#168A3A] text-[12px]" /> Right Investment
              </span>
            </div>
          </div>
        </div>

        {/* Right: Three Promotional Blocks */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 1. REALTORS MEDIA TV */}
          <Link
            href="/tv"
            className="bg-[#073F73] hover:bg-[#06345F] text-white px-2.5 py-1 rounded-[3px] border border-[#0B4F8A] shadow-2xs flex flex-col items-center justify-center min-w-[115px] cursor-pointer transition-colors"
          >
            <span className="text-[10px] font-black tracking-wide uppercase">
              REALTORS MEDIA TV
            </span>
            <div className="flex items-center gap-1 my-0.5">
              <span className="bg-[#E21F2F] text-white px-1.5 py-0.2 rounded-[2px] text-[9.5px] font-black flex items-center gap-1">
                <FaPlay className="text-[7px]" /> LIVE 24x7
              </span>
            </div>
            <span className="text-[9px] text-[#C9D7E3] font-semibold leading-none">
              Real Estate News & Updates
            </span>
          </Link>

          {/* 2. MOBILE APP */}
          <Link
            href="/mobile-app"
            className="bg-[#073F73] hover:bg-[#06345F] text-white px-2.5 py-1 rounded-[3px] border border-[#0B4F8A] shadow-2xs flex items-center gap-2 min-w-[105px] cursor-pointer transition-colors"
          >
            <div className="text-white text-[19px] flex-shrink-0">
              <FaMobileAlt />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black leading-tight uppercase tracking-wider">
                MOBILE APP
              </span>
              <span className="text-[9px] text-[#C9D7E3] font-semibold leading-tight">
                Anytime<br />Anywhere
              </span>
            </div>
          </Link>

          {/* 3. COMMUNITY */}
          <Link
            href="/community"
            className="bg-white hover:bg-[#F4F7F9] border border-[#C9D7E3] px-2.5 py-1 rounded-[3px] shadow-2xs flex flex-col items-center justify-center text-center min-w-[110px] cursor-pointer transition-colors"
          >
            <span className="text-[9px] text-[#143B5D] font-medium leading-none">
              Be a Part of
            </span>
            <span className="text-[10.5px] font-black text-[#073F73] leading-tight mt-0.5 uppercase">
              REALTORS MEDIA
            </span>
            <span className="text-[10.5px] font-extrabold text-[#073F73] leading-none">
              Community
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
