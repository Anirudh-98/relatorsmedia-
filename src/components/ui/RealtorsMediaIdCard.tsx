"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { FaPhoneAlt, FaGlobe, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { BarcodeSVG } from "./BarcodeSVG";
import { RealtorsMediaEmployee } from "@/types";
import { getSafePhotoUrl, PLACEHOLDER_PHOTO } from "@/lib/utils/imageUtils";

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
  name: "Ravi Varma",
  designation: "VIP ELITE PARTNER",
  employeeId: "RM-A-1116",
  department: "All Properties",
  specialization: "All Properties",
  location: "Hyderabad",
  issuedDate: "01 JAN 2026",
  validTill: "31 Dec 2028",
  photo: "/images/ravi_varma.jpg",
  verificationUrl: "https://www.realtorsmedia.world/verify/RM-A-1116",
  theme: "orange",
};

// CR80 portrait canvas (54mm × 85.6mm → ratio ≈ 1.5925)
const CANVAS_WIDTH = 638;
const CANVAS_HEIGHT = 1016;

const THEME_CONFIGS = {
  orange: {
    gradStart: "#A81D22",
    gradMid: "#C52227",
    gradEnd: "#DC3032",
    badgeBg: "linear-gradient(135deg, #B91C1C, #EF4444)",
    badgeText: "VIP ELITE PARTNER",
    accentDark: "#7F1519",
  },
  red: {
    gradStart: "#A81D22",
    gradMid: "#C52227",
    gradEnd: "#DC3032",
    badgeBg: "linear-gradient(135deg, #B91C1C, #EF4444)",
    badgeText: "VIP ELITE PARTNER",
    accentDark: "#7F1519",
  },
  blue: {
    gradStart: "#072C59",
    gradMid: "#0A4C8F",
    gradEnd: "#0E67BE",
    badgeBg: "linear-gradient(135deg, #073F73, #0284C7)",
    badgeText: "EXECUTIVE MEMBER",
    accentDark: "#041F3F",
  },
  green: {
    gradStart: "#064E3B",
    gradMid: "#059669",
    gradEnd: "#10B981",
    badgeBg: "linear-gradient(135deg, #065F46, #059669)",
    badgeText: "VERIFIED REALTOR",
    accentDark: "#033326",
  },
};

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

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        if (w > 0) setScale(w / CANVAS_WIDTH);
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  const empTierFromId = employee?.employeeId?.startsWith("RM-C")
    ? "green"
    : employee?.employeeId?.startsWith("RM-A")
    ? "orange"
    : employee?.employeeId?.startsWith("RM-B")
    ? "blue"
    : undefined;

  const activeThemeKey = (theme || employee?.theme || empTierFromId || "orange") as keyof typeof THEME_CONFIGS;
  const T = THEME_CONFIGS[activeThemeKey] || THEME_CONFIGS.orange;
  const gid = id.replace(/[^a-zA-Z0-9_-]/g, "");

  const rawPhoto = employee.photo || (employee as any).photoUrl || PLACEHOLDER_PHOTO;
  const displayPhoto = getSafePhotoUrl(rawPhoto);

  const qrValue = employee.employeeId
    ? `https://www.realtorsmedia.world/verify/${employee.employeeId}`
    : (employee.verificationUrl || "https://www.realtorsmedia.world")
        .replace("realtorsmedia.com", "www.realtorsmedia.world")
        .replace("https://realtorsmedia.world", "https://www.realtorsmedia.world");

  const badgeText =
    employee?.designation &&
    ["VIP ELITE PARTNER", "EXECUTIVE MEMBER", "EXECUTIVE PARTNER", "VERIFIED REALTOR"].includes(
      employee.designation.toUpperCase()
    )
      ? employee.designation.toUpperCase()
      : T.badgeText;

  const infoRows = [
    { label: "EMP ID",     value: employee.employeeId || "RM-A-1116" },
    { label: "SPECIALITY", value: employee.specialization || employee.department || "All Properties" },
    { label: "LOCATION",   value: employee.location || "Hyderabad" },
    { label: "VALID TILL", value: employee.validTill || "31 Dec 2028" },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className} ${interactive ? "cursor-pointer transition-transform hover:scale-[1.01]" : ""}`}
      style={{
        width: width ? (typeof width === "number" ? `${width}px` : width) : "100%",
        aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
        maxWidth: "100%",
      }}
      onClick={onClick}
    >
      {/* ── Fixed-size canvas scaled via CSS transform ── */}
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
        className="absolute top-0 left-0 overflow-hidden bg-white text-[#0F172A] antialiased shadow-xl border border-[#E2E8F0]"
      >

        {/* ══════════════════════════════════════════════════════════
            1. SVG BACKGROUND — top-left wave, top-right banner,
               and bottom-left layered curves matching reference
           ══════════════════════════════════════════════════════════ */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`${gid}-header-grad`} x1="195" y1="0" x2="638" y2="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={T.gradStart} />
              <stop offset="50%"  stopColor={T.gradMid} />
              <stop offset="100%" stopColor={T.gradEnd} />
            </linearGradient>
            <clipPath id={`${gid}-clip`}>
              <rect x="0" y="0" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} rx="36" ry="36" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${gid}-clip)`}>
            {/* White card base */}
            <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#FFFFFF" />

            {/* Top-left corner decorative wave */}
            <path
              d="M 0 0 L 85 0 C 50 30 25 55 0 85 Z"
              fill={`url(#${gid}-header-grad)`}
            />
            {/* Top-left corner inner accent */}
            <path
              d="M 0 0 L 45 0 C 25 18 12 35 0 52 Z"
              fill={T.accentDark}
              opacity="0.85"
            />

            {/* Top-right main header wave banner */}
            <path
              d="M 195 0 C 180 60 195 125 240 165 C 285 205 360 220 460 215 C 530 210 590 225 638 258 L 638 0 Z"
              fill={`url(#${gid}-header-grad)`}
            />

            {/* Bottom-left layered waves */}
            {/* Layer 1: Darker inner accent */}
            <path
              d="M 0 880 C 60 905 140 955 200 1016 L 0 1016 Z"
              fill={T.accentDark}
            />
            {/* Layer 2: Main outer wave */}
            <path
              d="M 0 835 C 50 855 130 910 225 970 C 270 998 305 1010 335 1016 L 0 1016 Z"
              fill={`url(#${gid}-header-grad)`}
            />
          </g>
        </svg>

        {/* ══════════════════════════════════════════════════════════
            2. LOGO — top-left on white background
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[36px] top-[42px] z-10 w-[130px] h-[110px]">
          <div className="relative w-full h-full">
            <Image
              src="/idcard-logo.png"
              alt="Realtors Media Logo"
              fill
              sizes="260px"
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            3. BRAND HEADER TEXT — inside the wave banner
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[248px] top-[42px] z-10 pr-[24px]">
          <div className="text-white font-black text-[38px] tracking-tight leading-none uppercase">
            REALTORS MEDIA
          </div>
          <div className="text-white font-medium text-[18px] mt-[10px] tracking-normal leading-snug">
            India&apos;s Real Estate Media Platform
          </div>
          <div className="text-white/90 font-normal text-[16px] mt-[6px] tracking-normal leading-snug">
            People | Properties | Possibilities
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            4. PROFILE PHOTO — left column with solid black border
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[42px] top-[212px] z-10">
          <div className="w-[195px] h-[195px] rounded-[24px] overflow-hidden border-[2.5px] border-black shadow-sm bg-[#F1F5F9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayPhoto}
              alt={employee.name || "Member Photo"}
              className="w-full h-full object-cover object-top"
              crossOrigin={displayPhoto.startsWith("http") ? "anonymous" : undefined}
              loading="eager"
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.src.includes(PLACEHOLDER_PHOTO)) t.src = PLACEHOLDER_PHOTO;
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            5. TIER PILL BADGE — directly below photo
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[42px] top-[426px] z-10 w-[195px] flex items-center justify-center">
          <div
            className="px-5 py-[6px] rounded-full shadow-xs text-center flex items-center justify-center"
            style={{ background: T.badgeBg }}
          >
            <span className="text-white text-[13.5px] font-black uppercase tracking-wider leading-none">
              {badgeText}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            6. MEMBER NAME — solid black bold font
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[42px] top-[490px] z-10 w-[320px]">
          <h1 className="text-[36px] font-black tracking-tight leading-tight text-black truncate">
            {employee.name || "Ravi Varma"}
          </h1>
        </div>

        {/* ══════════════════════════════════════════════════════════
            7. INFO GRID (4 rows) — vertically aligned colons
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[42px] top-[565px] z-10 w-[345px] space-y-[13px]">
          {infoRows.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[130px_18px_1fr] items-baseline">
              <span className="text-[17px] font-bold text-[#0F172A] uppercase tracking-wide">
                {label}
              </span>
              <span className="text-[17px] font-bold text-[#0F172A] text-center">:</span>
              <span className="text-[19px] font-black text-[#000000] truncate">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            8. AUTHORIZED SIGNATURE — line & label
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[42px] top-[792px] z-10 w-[275px]">
          <div className="w-full h-[2px] bg-black mb-2" />
          <div className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#0F172A] leading-none">
            AUTHORIZED SIGNATURE
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            9. BARCODE — top right of body below header wave
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[36px] top-[254px] z-10 w-[195px] h-[52px] flex items-center justify-end">
          <BarcodeSVG
            value={employee.employeeId || "RM-A-1116"}
            className="w-full h-full"
            color="#000000"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            10. SLOGAN — right-aligned bold text
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[36px] top-[326px] z-10 text-right">
          <div className="text-[19px] font-black uppercase text-[#000000] tracking-tight leading-[1.25]">
            BUILDING<br />
            BETTER<br />
            COMMUNITIES<br />
            TOGETHER
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            11. QR CODE — clean, framed directly on white
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[36px] top-[458px] z-10">
          <QRCodeSVG
            value={qrValue}
            size={106}
            level="M"
            bgColor="transparent"
            fgColor="#000000"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            12. BUILDING WATERMARK — skyscraper illustration with clouds
           ══════════════════════════════════════════════════════════ */}
        <div
          className="absolute right-0 top-[575px] w-[260px] h-[290px] pointer-events-none z-[2] opacity-[0.38]"
          style={{
            backgroundImage: "url('/images/building_watermark.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "top right",
            backgroundRepeat: "no-repeat",
            mixBlendMode: "multiply",
          }}
        />

        {/* ══════════════════════════════════════════════════════════
            13. FOOTER — right-aligned contact info with black icons
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[36px] top-[835px] z-10 text-right space-y-[6px]">
          <div className="flex items-center justify-end gap-2 text-[13.5px] font-semibold text-[#000000]">
            <span>www.realtorsmedia.world</span>
            <FaGlobe className="text-black text-[15px] shrink-0" />
          </div>
          <div className="flex items-center justify-end gap-2 text-[13.5px] font-semibold text-[#000000]">
            <span>+91 7981524909, +91 7981524909</span>
            <FaPhoneAlt className="text-black text-[13px] shrink-0" />
          </div>
          <div className="flex items-center justify-end gap-2 text-[13.5px] font-semibold text-[#000000]">
            <span>{employee.email || "realtorsmedia.info@gmail.com"}</span>
            <FaEnvelope className="text-black text-[14px] shrink-0" />
          </div>
          <div className="flex items-center justify-end gap-2 text-[13.5px] font-semibold text-[#000000]">
            <span>Archana arcade, IT Complex</span>
            <FaMapMarkerAlt className="text-black text-[15px] shrink-0" />
          </div>
          <div className="pr-[23px] text-[13.5px] font-semibold text-[#000000]">
            <span>South Bloch, 407</span>
          </div>
        </div>

      </div>
    </div>
  );
};
