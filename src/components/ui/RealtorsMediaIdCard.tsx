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

// CR80 portrait canvas (54mm × 86mm → ratio ≈ 1.5925)
const CANVAS_WIDTH = 638;
const CANVAS_HEIGHT = 1016;

const THEME_CONFIGS = {
  blue: {
    gradStart: "#04244A",
    gradMid: "#073A72",
    gradEnd: "#0C5696",
    badgeBg: "#073A72",
    badgeText: "EXECUTIVE MEMBER",
    nameColor: "#073A72",
    accentColor: "#0C5696",
  },
  green: {
    gradStart: "#042F24",
    gradMid: "#065F46",
    gradEnd: "#047857",
    badgeBg: "#065F46",
    badgeText: "VERIFIED REALTOR",
    nameColor: "#065F46",
    accentColor: "#047857",
  },
  orange: {
    gradStart: "#7C2D12",
    gradMid: "#C2410C",
    gradEnd: "#EA580C",
    badgeBg: "#C2410C",
    badgeText: "VIP ELITE PARTNER",
    nameColor: "#C2410C",
    accentColor: "#EA580C",
  },
  red: {
    gradStart: "#7C2D12",
    gradMid: "#C2410C",
    gradEnd: "#EA580C",
    badgeBg: "#C2410C",
    badgeText: "VIP ELITE PARTNER",
    nameColor: "#C2410C",
    accentColor: "#EA580C",
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
    return () => { ro.disconnect(); window.removeEventListener("resize", updateScale); };
  }, []);

  const empTierFromId = employee?.employeeId?.startsWith("RM-C")
    ? "green"
    : employee?.employeeId?.startsWith("RM-A")
    ? "orange"
    : employee?.employeeId?.startsWith("RM-B")
    ? "blue"
    : undefined;

  const activeThemeKey = (theme || employee?.theme || empTierFromId || "green") as keyof typeof THEME_CONFIGS;
  const T = THEME_CONFIGS[activeThemeKey] || THEME_CONFIGS.green;
  const gid = id.replace(/[^a-zA-Z0-9_-]/g, "");

  const rawPhoto = employee.photo || (employee as any).photoUrl || PLACEHOLDER_PHOTO;
  const displayPhoto = getSafePhotoUrl(rawPhoto);

  const qrValue = employee.employeeId
    ? `https://www.realtorsmedia.world/verify/${employee.employeeId}`
    : (employee.verificationUrl || "https://www.realtorsmedia.world")
        .replace("realtorsmedia.com", "www.realtorsmedia.world")
        .replace("https://realtorsmedia.world", "https://www.realtorsmedia.world");

  const infoRows = [
    { label: "EMP ID",     value: employee.employeeId },
    { label: "SPECIALITY", value: employee.specialization || employee.department || "—" },
    { label: "LOCATION",   value: employee.location },
    { label: "VALID TILL", value: employee.validTill },
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

        {/* ══════════════════════════════════════════
            1. SVG BACKGROUND — white + themed wave
           ══════════════════════════════════════════ */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`${gid}-wave`} x1="638" y1="0" x2="100" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={T.gradStart} />
              <stop offset="50%"  stopColor={T.gradMid} />
              <stop offset="100%" stopColor={T.gradEnd} />
            </linearGradient>
            <clipPath id={`${gid}-clip`}>
              <rect x="0" y="0" width="638" height="1016" rx="36" ry="36" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${gid}-clip)`}>
            {/* White card base */}
            <rect width="638" height="1016" fill="#FFFFFF" />
            {/* Themed wave blob — top right */}
            <path
              d="M 162 0 L 638 0 L 638 390 C 520 355 395 268 275 200 C 185 145 108 66 162 0 Z"
              fill={`url(#${gid}-wave)`}
            />
            {/* Subtle bottom accent line */}
            <rect x="0" y="1010" width="638" height="6" fill={T.gradMid} />
          </g>
        </svg>

        {/* ══════════════════════════════════════════
            2. LOGO — top-left on white
           ══════════════════════════════════════════ */}
        <div className="absolute left-[22px] top-[18px] z-10 w-[134px] h-[114px]">
          <div className="relative w-full h-full">
            <Image
              src="/idcard-logo.png"
              alt="Realtors Media Logo"
              fill
              sizes="280px"
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════
            3. BRAND NAME — inside the wave
           ══════════════════════════════════════════ */}
        <div className="absolute left-[178px] top-[22px] z-10 pr-[20px]">
          <div className="text-white font-black text-[46px] tracking-tight leading-none uppercase">
            REALTORS MEDIA
          </div>
          <div className="text-white/88 font-semibold text-[18px] mt-[10px] leading-snug">
            India&apos;s Real Estate Media Platform
          </div>
          <div className="text-white/75 font-semibold text-[17px] mt-[6px] leading-snug">
            People | Properties | Possibilities
          </div>
        </div>

        {/* ══════════════════════════════════════════
            4. BUILDING WATERMARK — right side
           ══════════════════════════════════════════ */}
        <div
          className="absolute right-0 top-[310px] w-[310px] h-[470px] pointer-events-none z-[2] opacity-[0.20]"
          style={{
            backgroundImage: "url('/images/building_watermark.jpg')",
            backgroundSize: "contain",
            backgroundPosition: "top right",
            backgroundRepeat: "no-repeat",
            mixBlendMode: "multiply",
            maskImage: "linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* ══════════════════════════════════════════
            5. PHOTO — left column
           ══════════════════════════════════════════ */}
        <div className="absolute left-[24px] top-[216px] z-10">
          <div
            className="w-[205px] h-[218px] rounded-[22px] overflow-hidden border-[2.5px] shadow-md"
            style={{ borderColor: T.accentColor + "55" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayPhoto}
              alt={employee.name || "Member Photo"}
              className="w-full h-full object-cover object-center"
              crossOrigin={displayPhoto.startsWith("http") ? "anonymous" : undefined}
              loading="eager"
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.src.includes(PLACEHOLDER_PHOTO)) t.src = PLACEHOLDER_PHOTO;
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════
            6. BARCODE — top right of body
           ══════════════════════════════════════════ */}
        <div className="absolute right-[24px] top-[218px] z-10 w-[265px] h-[65px] flex items-center justify-center">
          <BarcodeSVG
            value={employee.employeeId}
            className="w-full h-full"
            color="#0F172A"
          />
        </div>

        {/* ══════════════════════════════════════════
            7. BUILDING BETTER COMMUNITIES TOGETHER
           ══════════════════════════════════════════ */}
        <div className="absolute right-[24px] top-[310px] z-10 text-right">
          <div className="text-[23px] font-black text-[#0F172A] tracking-tight leading-[1.2]">
            BUILDING<br />
            BETTER<br />
            COMMUNITIES<br />
            TOGETHER
          </div>
        </div>

        {/* ══════════════════════════════════════════
            8. TIER BADGE
           ══════════════════════════════════════════ */}
        <div className="absolute left-[24px] top-[454px] z-10">
          <span
            className="inline-flex items-center px-4 py-[6px] rounded-full text-white text-[15px] font-black uppercase tracking-wider"
            style={{ backgroundColor: T.badgeBg }}
          >
            {T.badgeText}
          </span>
        </div>

        {/* ══════════════════════════════════════════
            9. MEMBER NAME
           ══════════════════════════════════════════ */}
        <div className="absolute left-[24px] top-[502px] z-10 w-[370px]">
          <h1
            className="text-[46px] font-black tracking-tight leading-none"
            style={{ color: T.nameColor }}
          >
            {employee.name}
          </h1>
        </div>

        {/* ══════════════════════════════════════════
            10. INFO GRID (4 rows)
           ══════════════════════════════════════════ */}
        <div className="absolute left-[24px] top-[580px] z-10 w-[365px] space-y-[12px]">
          {infoRows.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[128px_20px_1fr] items-baseline">
              <span className="text-[16px] font-bold text-[#64748B] uppercase tracking-wide">
                {label}
              </span>
              <span className="text-[18px] font-extrabold text-[#94A3B8]">:</span>
              <span className="text-[20px] font-extrabold text-[#0F172A] truncate">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            11. QR CODE
           ══════════════════════════════════════════ */}
        <div className="absolute right-[24px] top-[580px] z-10 flex flex-col items-center gap-2">
          <div className="w-[145px] h-[145px] bg-white rounded-[14px] p-1.5 border border-[#E2E8F0] shadow-sm flex items-center justify-center">
            <QRCodeSVG
              value={qrValue}
              size={128}
              level="M"
              bgColor="#FFFFFF"
              fgColor="#0F172A"
            />
          </div>
          <span className="text-[13px] font-black uppercase text-[#0F172A] tracking-wider">
            Scan to Verify
          </span>
        </div>

        {/* ══════════════════════════════════════════
            12. AUTHORIZED SIGNATURE
           ══════════════════════════════════════════ */}
        <div className="absolute left-[24px] top-[838px] z-10 w-[260px]">
          <div className="w-full h-[1.5px] bg-[#94A3B8] mb-2" />
          <div className="text-[14px] font-black uppercase text-[#0F172A] tracking-[0.12em] leading-none">
            Authorized Signature
          </div>
        </div>

        {/* ══════════════════════════════════════════
            13. FOOTER — right-aligned contact info
           ══════════════════════════════════════════ */}
        <div className="absolute right-[24px] top-[868px] z-10 text-right space-y-[9px]">
          <div className="flex items-center justify-end gap-2.5 text-[14px] font-semibold text-[#0F172A]">
            <span>www.realtorsmedia.world</span>
            <FaGlobe className="text-[#64748B] text-[14px] shrink-0" />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-[14px] font-semibold text-[#0F172A]">
            <span>+91 8096792778, +91 9441185799</span>
            <FaPhoneAlt className="text-[#64748B] text-[13px] shrink-0" />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-[14px] font-semibold text-[#0F172A]">
            <span>realtorsmedia.info@gmail.com</span>
            <FaEnvelope className="text-[#64748B] text-[14px] shrink-0" />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-[14px] font-semibold text-[#0F172A]">
            <span>Archana Arcade, IT Complex - South Block, 407</span>
            <FaMapMarkerAlt className="text-[#64748B] text-[14px] shrink-0" />
          </div>
        </div>

      </div>
    </div>
  );
};
