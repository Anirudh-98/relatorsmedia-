"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import {
  FaHome,
  FaBullhorn,
  FaUserFriends,
  FaChartLine,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa";
import { BarcodeSVG } from "./BarcodeSVG";
import { RealtorsMediaEmployee } from "@/types";

export interface RealtorsMediaIdCardProps {
  employee?: RealtorsMediaEmployee;
  width?: number | string;
  className?: string;
  id?: string;
  cardRef?: React.Ref<HTMLDivElement>;
  interactive?: boolean;
  onClick?: () => void;
  theme?: "green" | "blue" | "orange" | "red";
}

const DEFAULT_EMPLOYEE: RealtorsMediaEmployee = {
  name: "Rohan Deshmukh",
  designation: "MEDIA EXECUTIVE",
  employeeId: "RM-B-1111",
  department: "Media & Marketing",
  location: "Pune, Maharashtra",
  issuedDate: "01 AUG 2026",
  validTill: "31 JUL 2028",
  photo: "/images/rohan_deshmukh.png",
  verificationUrl: "https://realtorsmedia.com/verify/RM-B-1111",
  theme: "blue",
};

// Internal reference design canvas size (CR80 portrait: 54mm x 85.6mm -> ratio ~ 1.585)
const CANVAS_WIDTH = 638;
const CANVAS_HEIGHT = 1011;

const THEME_CONFIGS = {
  blue: {
    topGrad: { start: "#05254A", mid: "#073A72", end: "#0C5696" },
    bottomGrad: { start: "#05254A", mid: "#073A72", end: "#0C5696" },
    skyline: "#38BDF8",
    brandMediaColor: "#38BDF8",
    taglineBorder: "border-[#38BDF8]/40",
    taglines: "#93C5FD",
    platformSubtext: "#BAE6FD",
    starAura: "#38BDF8",
    starF1: "#38BDF8",
    starF2: "#0284C7",
    starF3: "#0369A1",
    photoRing: "from-[#38BDF8] via-[#0284C7] to-[#0369A1]",
    photoShadow: "shadow-[#0284C7]/20",
    designationColor: "text-[#0284C7]",
    promoTitleColor: "text-[#073F73]",
    featureGradient: "from-[#0369A1] to-[#0284C7]",
    badgeText: "EXECUTIVE MEMBER",
    badgeClass: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]",
  },
  green: {
    topGrad: { start: "#042F24", mid: "#065F46", end: "#047857" },
    bottomGrad: { start: "#042F24", mid: "#065F46", end: "#047857" },
    skyline: "#34D399",
    brandMediaColor: "#34D399",
    taglineBorder: "border-[#34D399]/40",
    taglines: "#A7F3D0",
    platformSubtext: "#D1FAE5",
    starAura: "#34D399",
    starF1: "#34D399",
    starF2: "#059669",
    starF3: "#047857",
    photoRing: "from-[#34D399] via-[#059669] to-[#047857]",
    photoShadow: "shadow-[#059669]/20",
    designationColor: "text-[#059669]",
    promoTitleColor: "text-[#065F46]",
    featureGradient: "from-[#047857] to-[#10B981]",
    badgeText: "VERIFIED REALTOR",
    badgeClass: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
  },
  orange: {
    topGrad: { start: "#7C2D12", mid: "#C2410C", end: "#EA580C" },
    bottomGrad: { start: "#7C2D12", mid: "#C2410C", end: "#EA580C" },
    skyline: "#FB923C",
    brandMediaColor: "#FDBA74",
    taglineBorder: "border-[#FDBA74]/40",
    taglines: "#FED7AA",
    platformSubtext: "#FFEDD5",
    starAura: "#F97316",
    starF1: "#FDBA74",
    starF2: "#EA580C",
    starF3: "#9A3412",
    photoRing: "from-[#FDBA74] via-[#EA580C] to-[#9A3412]",
    photoShadow: "shadow-[#EA580C]/25",
    designationColor: "text-[#EA580C]",
    promoTitleColor: "text-[#C2410C]",
    featureGradient: "from-[#C2410C] to-[#F97316]",
    badgeText: "VIP ELITE PARTNER",
    badgeClass: "bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]",
  },
  red: {
    topGrad: { start: "#7C2D12", mid: "#C2410C", end: "#EA580C" },
    bottomGrad: { start: "#7C2D12", mid: "#C2410C", end: "#EA580C" },
    skyline: "#FB923C",
    brandMediaColor: "#FDBA74",
    taglineBorder: "border-[#FDBA74]/40",
    taglines: "#FED7AA",
    platformSubtext: "#FFEDD5",
    starAura: "#F97316",
    starF1: "#FDBA74",
    starF2: "#EA580C",
    starF3: "#9A3412",
    photoRing: "from-[#FDBA74] via-[#EA580C] to-[#9A3412]",
    photoShadow: "shadow-[#EA580C]/25",
    designationColor: "text-[#EA580C]",
    promoTitleColor: "text-[#C2410C]",
    featureGradient: "from-[#C2410C] to-[#F97316]",
    badgeText: "VIP ELITE PARTNER",
    badgeClass: "bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]",
  },
};

// Lucide CircleCheckBig icon requested for Verified Realtor status
const VerifiedCheckBigIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 13,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 ${className}`}
  >
    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

export const RealtorsMediaIdCard: React.FC<RealtorsMediaIdCardProps> = ({
  employee = DEFAULT_EMPLOYEE,
  width,
  className = "",
  id = "realtors-media-id-card",
  cardRef,
  interactive = false,
  onClick,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  // Measure container and scale canvas responsively without altering internal proportions
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        if (clientWidth > 0) {
          setScale(clientWidth / CANVAS_WIDTH);
        }
      }
    };

    updateScale();

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateScale);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  const mergedEmployee: RealtorsMediaEmployee = {
    ...DEFAULT_EMPLOYEE,
    ...employee,
  };

  const activeThemeKey = theme || mergedEmployee.theme || "blue";
  const currentTheme = THEME_CONFIGS[activeThemeKey] || THEME_CONFIGS.blue;
  const gradientPrefix = id.replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className} ${interactive ? "cursor-pointer transition-transform hover:scale-[1.01]" : ""
        }`}
      style={{
        width: width ? (typeof width === "number" ? `${width}px` : width) : "100%",
        aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
        maxWidth: "100%",
      }}
      onClick={onClick}
    >
      {/* Fixed Canvas scaled via CSS Transform with Equal Corner Radius */}
      <div
        id={id}
        ref={cardRef}
        style={{
          width: `${CANVAS_WIDTH}px`,
          height: `${CANVAS_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          borderRadius: "36px",
          clipPath: "inset(0 round 36px)",
          WebkitClipPath: "inset(0 round 36px)",
        }}
        className="absolute top-0 left-0 overflow-hidden bg-[#F6F8FB] text-[#081C36] font-card antialiased shadow-lg border border-[#CBD5E1]"
      >
        {/* ========================================================
            SVG DEFINITIONS: GRADIENTS & DECORATIVE WAVES
           ======================================================== */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Top Corporate Gradient */}
            <linearGradient id={`${gradientPrefix}-topNavyGrad`} x1="0" y1="0" x2="638" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={currentTheme.topGrad.start} />
              <stop offset="55%" stopColor={currentTheme.topGrad.mid} />
              <stop offset="100%" stopColor={currentTheme.topGrad.end} />
            </linearGradient>

            {/* Top Golden Ribbon Gradient */}
            <linearGradient id={`${gradientPrefix}-topGoldGrad`} x1="0" y1="240" x2="638" y2="295" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D9941C" />
              <stop offset="45%" stopColor="#F5BF4B" />
              <stop offset="85%" stopColor="#E5A627" />
              <stop offset="100%" stopColor="#C9810F" />
            </linearGradient>

            {/* Bottom Golden Ribbon Gradient */}
            <linearGradient id={`${gradientPrefix}-bottomGoldGrad`} x1="0" y1="925" x2="638" y2="885" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9810F" />
              <stop offset="35%" stopColor="#F5BF4B" />
              <stop offset="75%" stopColor="#E5A627" />
              <stop offset="100%" stopColor="#D9941C" />
            </linearGradient>

            {/* Bottom Footer Gradient */}
            <linearGradient id={`${gradientPrefix}-bottomNavyGrad`} x1="0" y1="920" x2="638" y2="1011" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={currentTheme.bottomGrad.start} />
              <stop offset="60%" stopColor={currentTheme.bottomGrad.mid} />
              <stop offset="100%" stopColor={currentTheme.bottomGrad.end} />
            </linearGradient>

            {/* Equal 36px Corner Radius Clip Path for SVG */}
            <clipPath id={`${gradientPrefix}-cardEqualClip`}>
              <rect x="0" y="0" width="638" height="1011" rx="36" ry="36" />
            </clipPath>
          </defs>

          {/* All background paths clipped to exact equal corner radius */}
          <g clipPath={`url(#${gradientPrefix}-cardEqualClip)`}>
            {/* TOP HEADER THEMED BACKGROUND */}
            <path
              d="M 0 0 L 638 0 L 638 288 C 470 293 230 251 0 240 Z"
              fill={`url(#${gradientPrefix}-topNavyGrad)`}
            />

            {/* TOP GOLDEN CURVED RIBBON */}
            <path
              d="M 0 240 C 230 251 470 293 638 288 L 638 296 C 470 301 230 259 0 248 Z"
              fill={`url(#${gradientPrefix}-topGoldGrad)`}
            />

            {/* BOTTOM GOLDEN CURVED RIBBON */}
            <path
              d="M 0 914 C 225 926 445 892 638 887 L 638 894 C 445 899 225 933 0 921 Z"
              fill={`url(#${gradientPrefix}-bottomGoldGrad)`}
            />

            {/* BOTTOM PLAIN THEMED FOOTER */}
            <path
              d="M 0 921 C 225 933 445 899 638 894 L 638 1011 L 0 1011 Z"
              fill={`url(#${gradientPrefix}-bottomNavyGrad)`}
            />
          </g>
        </svg>

        {/* ========================================================
            2. TOP BRANDING / HEADER AREA
           ======================================================== */}
        <div className="relative z-10 w-full pt-8 px-7 flex items-center justify-between">
          {/* LEFT: EMBLEM & BRANDING */}
          <div className="flex items-center gap-4">
            {/* Realtors Media Official Logo */}
            <div className="relative w-[148px] h-[126px] flex-shrink-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src="/idcard-logo.png"
                  alt="Realtors Media Logo"
                  fill
                  sizes="300px"
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Brand Titles */}
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline leading-none">
                <span className="text-white font-extrabold text-[36px] tracking-tight">
                  Realtors
                </span>
                <span
                  className="font-black text-[36px] tracking-tight ml-1"
                  style={{ color: currentTheme.brandMediaColor }}
                >
                  Media
                </span>
              </div>

              {/* Sub-label: — DIGITAL — */}
              <div className="flex items-center gap-2.5 mt-2">
                <div className="h-[1.5px] w-8 bg-white/50" />
                <span className="text-white/95 text-[13px] font-black uppercase tracking-[0.28em] leading-none">
                  DIGITAL
                </span>
                <div className="h-[1.5px] w-8 bg-white/50" />
              </div>

              {/* India's Real Estate Media Platform */}
              <span
                className="text-[15px] font-bold tracking-wide mt-2 leading-none whitespace-nowrap"
                style={{ color: currentTheme.platformSubtext }}
              >
                India&apos;s Real Estate Media Platform
              </span>
            </div>
          </div>

          {/* RIGHT: TAGLINE */}
          <div className={`text-right border-r-[2.5px] ${currentTheme.taglineBorder} pr-3.5`}>
            <div className="text-[17px] font-bold leading-[1.36]" style={{ color: currentTheme.taglines }}>
              People
            </div>
            <div className="text-[17px] font-bold leading-[1.36]" style={{ color: currentTheme.taglines }}>
              Properties
            </div>
            <div className="text-[17px] font-bold leading-[1.36]" style={{ color: currentTheme.taglines }}>
              Possibilities
            </div>
          </div>
        </div>

        {/* ========================================================
            3. MAIN BODY BACKGROUND: ARCHITECTURAL WATERMARK
           ======================================================== */}
        <div
          className="absolute right-0 top-[260px] w-[350px] h-[520px] pointer-events-none z-[2] opacity-[0.24]"
          style={{
            backgroundImage: "url('/images/building_watermark.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "top right",
            backgroundRepeat: "no-repeat",
            mixBlendMode: "multiply",
            maskImage: "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* ========================================================
            4. EMPLOYEE PHOTO & IDENTITY (LEFT COLUMN)
           ======================================================== */}
        {/* Photo Container */}
        <div className="absolute left-[44px] top-[342px] z-10">
          <div className={`w-[185px] h-[198px] rounded-[22px] p-[3.5px] bg-gradient-to-br ${currentTheme.photoRing} shadow-md ${currentTheme.photoShadow}`}>
            <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-white">
              <Image
                src={mergedEmployee.photo || "/images/rohan_deshmukh.png"}
                alt={mergedEmployee.name}
                fill
                priority
                sizes="200px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            UNIQUE BARCODE (TOP RIGHT SIDE OF IMAGE) - ONLY BARCODE
           ======================================================== */}
        <div className="absolute right-[44px] top-[350px] z-10 w-[240px] h-[60px] flex items-center justify-center">
          <BarcodeSVG
            value={mergedEmployee.employeeId}
            className="w-full h-full"
            color="#081C36"
          />
        </div>

        {/* Employee Identity & Information Grid (Unified Flow) */}
        <div className="absolute left-[44px] top-[554px] z-10 w-[325px] flex flex-col">
          {/* Subtle Tier Badge */}
          <div className="mb-1.5 flex items-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider border shadow-2xs ${currentTheme.badgeClass}`}
            >
              <VerifiedCheckBigIcon size={12} />
              <span>{currentTheme.badgeText}</span>
            </span>
          </div>

          {/* Employee Name */}
          <h1 className="text-[29px] font-black text-[#0B213D] leading-[1.1] tracking-tight">
            {mergedEmployee.name}
          </h1>

          {/* Job Title / Designation / Agency */}
          <div
            className={`text-[13px] font-black uppercase tracking-[0.14em] mt-1.5 mb-4 leading-tight truncate flex items-center gap-1.5 ${currentTheme.designationColor}`}
          >
            {(
              (mergedEmployee.agencyName || mergedEmployee.designation || "")
                .toUpperCase()
                .includes("VERIFIED REALTOR")
            ) && <VerifiedCheckBigIcon size={14} />}
            <span className="truncate">
              {mergedEmployee.agencyName
                ? `${mergedEmployee.agencyName}`
                : mergedEmployee.designation}
            </span>
          </div>

          {/* 5. EMPLOYEE INFORMATION GRID */}
          <div className="space-y-[10px] text-[14.5px] leading-tight">
            {/* EMP ID */}
            <div className="grid grid-cols-[90px_14px_1fr] items-baseline">
              <span className="font-bold text-[#475569] text-[13px] uppercase tracking-wide">EMP ID</span>
              <span className="font-extrabold text-[#64748B] text-[14px]">:</span>
              <span className="font-extrabold text-[#0F172A] text-[14.5px] tracking-normal">
                {mergedEmployee.employeeId}
              </span>
            </div>

            {/* Dept / Specialization */}
            <div className="grid grid-cols-[90px_14px_1fr] items-baseline">
              <span className="font-bold text-[#475569] text-[13px] uppercase tracking-wide">
                {mergedEmployee.specialization ? "Specialty" : "Dept"}
              </span>
              <span className="font-extrabold text-[#64748B] text-[14px]">:</span>
              <span className="font-extrabold text-[#0F172A] text-[14.5px] tracking-normal truncate">
                {mergedEmployee.specialization || mergedEmployee.department}
              </span>
            </div>

            {/* Location */}
            <div className="grid grid-cols-[90px_14px_1fr] items-baseline">
              <span className="font-bold text-[#475569] text-[13px] uppercase tracking-wide">Location</span>
              <span className="font-extrabold text-[#64748B] text-[14px]">:</span>
              <span className="font-extrabold text-[#0F172A] text-[14.5px] tracking-normal truncate">
                {mergedEmployee.location}
              </span>
            </div>

            {/* License / RERA or Issued */}
            <div className="grid grid-cols-[90px_14px_1fr] items-baseline">
              <span className="font-bold text-[#475569] text-[13px] uppercase tracking-wide">
                {mergedEmployee.licenseNumber || mergedEmployee.reraNumber ? "License" : "Issued"}
              </span>
              <span className="font-extrabold text-[#64748B] text-[14px]">:</span>
              <span className="font-extrabold text-[#0F172A] text-[14.5px] tracking-normal truncate">
                {mergedEmployee.licenseNumber || mergedEmployee.reraNumber || mergedEmployee.issuedDate}
              </span>
            </div>

            {/* Valid Till */}
            <div className="grid grid-cols-[90px_14px_1fr] items-baseline">
              <span className="font-bold text-[#475569] text-[13px] uppercase tracking-wide">Valid Till</span>
              <span className="font-extrabold text-[#64748B] text-[14px]">:</span>
              <span className="font-extrabold text-[#0F172A] text-[14.5px] tracking-normal">
                {mergedEmployee.validTill}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            6. AUTHORIZED SIGNATORY (BOTTOM LEFT)
           ======================================================== */}
        <div className="absolute left-[44px] top-[835px] z-10 w-[185px]">
          <div className="w-full h-[1.5px] bg-[#94A3B8] mb-1.5" />
          <div className="text-[12px] font-black uppercase text-[#0F172A] tracking-wider leading-none">
            Authorized Signature
          </div>
        </div>

        {/* ========================================================
            7. RIGHT PROMOTIONAL SECTION: BUILDING BETTER COMMUNITIES
           ======================================================== */}
        <div className="absolute right-[44px] top-[470px] z-10 text-right w-[240px]">
          <div className={`text-[18px] font-black uppercase leading-[1.18] tracking-tight ${currentTheme.promoTitleColor}`}>
            BUILDING
            <br />
            BETTER
            <br />
            COMMUNITIES
            <br />
            TOGETHER
          </div>

          {/* 4 Feature Badges with labels on left, themed round icon on right */}
          <div className="mt-5 space-y-3 flex flex-col items-end">
            {/* 1. LIST */}
            <div className="flex items-center gap-2.5">
              <span className="text-[12.5px] font-black uppercase text-[#0F172A] tracking-wider">
                LIST
              </span>
              <div className={`w-7.5 h-7.5 rounded-full bg-gradient-to-tr ${currentTheme.featureGradient} shadow-xs flex items-center justify-center text-white text-[13px]`}>
                <FaHome />
              </div>
            </div>

            {/* 2. PROMOTE */}
            <div className="flex items-center gap-2.5">
              <span className="text-[12.5px] font-black uppercase text-[#0F172A] tracking-wider">
                PROMOTE
              </span>
              <div className={`w-7.5 h-7.5 rounded-full bg-gradient-to-tr ${currentTheme.featureGradient} shadow-xs flex items-center justify-center text-white text-[13px]`}>
                <FaBullhorn />
              </div>
            </div>

            {/* 3. CONNECT */}
            <div className="flex items-center gap-2.5">
              <span className="text-[12.5px] font-black uppercase text-[#0F172A] tracking-wider">
                CONNECT
              </span>
              <div className={`w-7.5 h-7.5 rounded-full bg-gradient-to-tr ${currentTheme.featureGradient} shadow-xs flex items-center justify-center text-white text-[13px]`}>
                <FaUserFriends />
              </div>
            </div>

            {/* 4. GROW */}
            <div className="flex items-center gap-2.5">
              <span className="text-[12.5px] font-black uppercase text-[#0F172A] tracking-wider">
                GROW
              </span>
              <div className={`w-7.5 h-7.5 rounded-full bg-gradient-to-tr ${currentTheme.featureGradient} shadow-xs flex items-center justify-center text-white text-[13px]`}>
                <FaChartLine />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            8. QR CODE SECTION (LOWER RIGHT)
           ======================================================== */}
        <div className="absolute right-[44px] top-[736px] z-10 flex flex-col items-center">
          <div className="w-[114px] h-[114px] bg-white rounded-[14px] p-2 border border-[#94A3B8]/60 shadow-sm flex items-center justify-center">
            <QRCodeSVG
              value={
                mergedEmployee.verificationUrl ||
                `https://realtorsmedia.com/verify/${mergedEmployee.employeeId}`
              }
              size={98}
              level="M"
              bgColor="#FFFFFF"
              fgColor="#0F172A"
            />
          </div>
          <span className="text-[12.5px] font-black uppercase text-[#0F172A] tracking-wider mt-2 leading-none">
            Scan to Verify
          </span>
        </div>

        {/* ========================================================
            9. BOTTOM THEMED FOOTER DETAILS (2 HORIZONTAL LINES)
           ======================================================== */}
        <div className="absolute left-[44px] right-[44px] top-[940px] z-10 flex flex-col justify-center gap-2 text-white">
          {/* Line 1: Location (Left) & Phone (Right) */}
          <div className="flex items-center justify-between text-[11.5px] font-bold tracking-wide">
            <div className="flex items-center gap-2 min-w-0">
              <FaMapMarkerAlt className="text-[#F5BF4B] text-[13px] shrink-0" />
              <span className="truncate">Realtors Media, Pune, Maharashtra, India</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <FaPhoneAlt className="text-[#F5BF4B] text-[11px] shrink-0" />
              <span>+91 9876543210</span>
            </div>
          </div>

          {/* Line 2: Website (Left) & Email (Right) */}
          <div className="flex items-center justify-between text-[11.5px] font-bold tracking-wide">
            <div className="flex items-center gap-2 min-w-0">
              <FaGlobe className="text-[#F5BF4B] text-[12px] shrink-0" />
              <span>www.realtorsmedia.world</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <FaEnvelope className="text-[#F5BF4B] text-[11.5px] shrink-0" />
              <span>support@realtorsmedia.world</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
