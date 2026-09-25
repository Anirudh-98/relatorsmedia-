"use client";

import React, { useRef, useState, useEffect } from "react";
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
    bgSvg: "/Id card.svg?v=3",
    stops: [
      { offset: "0%", color: "#973620" },
      { offset: "13%", color: "#bb4126" },
      { offset: "43%", color: "#d74c27" },
      { offset: "50%", color: "#db5934" },
      { offset: "72%", color: "#e9825d" },
      { offset: "89%", color: "#f19b76" },
      { offset: "100%", color: "#f5a580" },
    ],
    gradStart: "#973620",
    gradMid: "#db5934",
    gradEnd: "#f5a580",
    accentDark: "#7A0E12",
    badgeBg: "linear-gradient(135deg, #B91C1C, #EF4444)",
    badgeText: "VIP ELITE PARTNER",
  },
  red: {
    bgSvg: "/Id card.svg?v=3",
    stops: [
      { offset: "0%", color: "#973620" },
      { offset: "13%", color: "#bb4126" },
      { offset: "43%", color: "#d74c27" },
      { offset: "50%", color: "#db5934" },
      { offset: "72%", color: "#e9825d" },
      { offset: "89%", color: "#f19b76" },
      { offset: "100%", color: "#f5a580" },
    ],
    gradStart: "#973620",
    gradMid: "#db5934",
    gradEnd: "#f5a580",
    accentDark: "#7A0E12",
    badgeBg: "linear-gradient(135deg, #B91C1C, #EF4444)",
    badgeText: "VIP ELITE PARTNER",
  },
  blue: {
    bgSvg: "/Id card-blue.svg?v=3",
    stops: [
      { offset: "0%", color: "#072B58" },
      { offset: "13%", color: "#0A3B75" },
      { offset: "43%", color: "#0D529C" },
      { offset: "50%", color: "#0284C7" },
      { offset: "72%", color: "#38BDF8" },
      { offset: "89%", color: "#7DD3FC" },
      { offset: "100%", color: "#BAE6FD" },
    ],
    gradStart: "#072B58",
    gradMid: "#0A4F96",
    gradEnd: "#0284C7",
    accentDark: "#041C3A",
    badgeBg: "linear-gradient(135deg, #073F73, #0284C7)",
    badgeText: "EXECUTIVE MEMBER",
  },
  green: {
    bgSvg: "/Id card-green.svg?v=3",
    stops: [
      { offset: "0%", color: "#064E3B" },
      { offset: "13%", color: "#065F46" },
      { offset: "43%", color: "#047857" },
      { offset: "50%", color: "#059669" },
      { offset: "72%", color: "#10B981" },
      { offset: "89%", color: "#34D399" },
      { offset: "100%", color: "#6EE7B7" },
    ],
    gradStart: "#064E3B",
    gradMid: "#059669",
    gradEnd: "#10B981",
    accentDark: "#033326",
    badgeBg: "linear-gradient(135deg, #065F46, #059669)",
    badgeText: "VERIFIED REALTOR",
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
    let rafId: number;
    const updateScale = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (containerRef.current) {
          const w = containerRef.current.clientWidth;
          if (w > 0) {
            const nextScale = w / CANVAS_WIDTH;
            setScale((prev) => (Math.abs(prev - nextScale) > 0.002 ? nextScale : prev));
          }
        }
      });
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updateScale);
    return () => {
      cancelAnimationFrame(rafId);
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
  const displayPhoto = getSafePhotoUrl(rawPhoto, employee?.employeeId);

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
    { label: "EMP ID", value: employee.employeeId || "RM-A-1116" },
    { label: "SPECIALITY", value: employee.specialization || employee.department || "All Properties" },
    { label: "LOCATION", value: employee.location || "Hyderabad" },
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
          // Inter across all card text for crisp, legible print output
          fontFamily: "var(--font-inter), Inter, Arial, Helvetica, sans-serif",
          textRendering: "optimizeLegibility",
        }}
        className="absolute top-0 left-0 overflow-hidden bg-white text-[#0F172A] antialiased shadow-xl border border-[#E2E8F0]"
      >

        {/* ══════════════════════════════════════════════════════════
            1. CARD STYLING SVG (from public/Id card.svg)
               Direct vector asset matching public/Id card.svg
           ══════════════════════════════════════════════════════════ */}
        {/* -inset-px: bleed over the 1px border so the wave reaches the card edge */}
        <div className="absolute -inset-px pointer-events-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={T.bgSvg || "/Id card.svg"}
            alt="Card Styling Background"
            className="w-full h-full object-fill select-none pointer-events-none"
            loading="eager"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            2. LOGO — sits nestled in the top-left white inlet
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[18px] top-[62px] z-10 w-[135px] h-[115px] flex items-center justify-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/idcard-logo.png"
            alt="Realtors Media Logo"
            className="w-auto h-auto max-w-full max-h-full object-contain select-none pointer-events-none"
            style={{ aspectRatio: "1356 / 1159" }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            3. BRAND HEADER TEXT — centered inside the wave banner
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[185px] right-[18px] top-[28px] z-10 flex flex-col items-center justify-center text-center">
          <div className="text-white font-black italic text-[40px] tracking-tight leading-none uppercase">
            REALTORS MEDIA
          </div>
          <div className="text-white/95 font-medium text-[18px] mt-[10px] tracking-normal leading-snug">
            India&apos;s Real Estate Media Platform
          </div>
          <div className="text-white/85 font-normal text-[16px] mt-[5px] tracking-normal leading-snug">
            People | Properties | Possibilities
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            4. PROFILE PHOTO — left column with solid black border
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[42px] top-[215px] z-10">
          <div className="w-[195px] h-[195px] rounded-[20px] overflow-hidden border-[2.5px] border-black shadow-sm bg-[#F1F5F9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayPhoto}
              data-profile-photo="true"
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
        <div className="absolute left-[30px] top-[426px] z-10 w-[220px] flex items-center justify-center">
          <div
            className="px-[18px] py-[7px] rounded-full text-center flex items-center justify-center"
            style={{ background: T.badgeBg }}
          >
            <span className="text-white text-[14px] font-black uppercase tracking-wider leading-none">
              {badgeText}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            6. MEMBER NAME — solid black bold font
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[42px] top-[486px] z-10 w-[340px]">
          <h1 className="text-[38px] font-black tracking-tight leading-tight text-black truncate">
            {employee.name || "Ravi Varma"}
          </h1>
        </div>

        {/* ══════════════════════════════════════════════════════════
            7. INFO GRID (4 rows) — vertically aligned colons
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[42px] top-[556px] z-10 w-[370px] space-y-[12px]">
          {infoRows.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[135px_18px_1fr] items-baseline">
              <span className="text-[17px] font-bold text-[#000000] uppercase tracking-wide">
                {label}
              </span>
              <span className="text-[17px] font-bold text-[#000000] text-center">:</span>
              <span className="text-[19px] font-black text-[#000000] truncate">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            8. AUTHORIZED SIGNATURE — Koti Sir signature & line
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[37px] top-[696px] z-10 w-[250px] flex flex-col items-center">
          <div className="w-[250px] h-[92px] -mb-1 flex items-end justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Koti Sir Signature.png"
              alt="Authorized Signature"
              className="w-full h-full object-contain object-bottom select-none pointer-events-none"
            />
          </div>
          <div className="w-[250px] h-[2px] bg-black mb-[6px]" />
          <div
            className="w-full text-center text-[12.5px] font-bold uppercase tracking-[0.12em] leading-none"
            style={{ color: T.gradMid }}
          >
            AUTHORIZED SIGNATURE
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            9. BARCODE — top right of body below header wave
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[36px] top-[240px] z-10 w-[195px] h-[52px] flex items-center justify-end">
          <BarcodeSVG
            value={employee.employeeId || "RM-A-1116"}
            className="w-full h-full"
            color="#000000"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            10. SLOGAN — right-aligned bold text
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[36px] top-[308px] z-10 text-right">
          <div className="text-[19px] font-black uppercase text-[#000000] tracking-tight leading-[1.3]">
            BUILDING<br />
            BETTER<br />
            COMMUNITIES<br />
            TOGETHER
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            11. QR CODE — right side below slogan
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[36px] top-[442px] z-10">
          <QRCodeSVG
            value={qrValue}
            size={106}
            level="M"
            bgColor="transparent"
            fgColor="#000000"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            12. BUILDING WATERMARK — skyscraper illustration with cloud fade
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[-10px] top-[520px] w-[290px] h-[330px] pointer-events-none z-[2] opacity-[0.4] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/city-skyline-with-building-middle-clouds.jpg.jpeg"
            alt="Building Watermark"
            className="w-full h-full object-contain object-bottom"
            style={{
              mixBlendMode: "multiply",
            }}
          />
          {/* Soft cloud/fog fade at the base of the buildings */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[80px] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,1) 100%)",
            }}
          />
          {/* Left-side fade so buildings don't have a hard left edge */}
          <div
            className="absolute top-0 left-0 bottom-0 w-[60px] pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            13. FOOTER — right-aligned contact info with black icons
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[36px] top-[826px] z-10 text-right space-y-[6.5px]">
          <div className="flex items-center justify-end gap-2.5 text-[15px] font-bold text-[#000000]">
            <span>www.realtorsmedia.world</span>
            <FaGlobe className="text-black text-[16.5px] shrink-0" />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-[15px] font-bold text-[#000000]">
            <span>+91 8096792778, +91 9441185799</span>
            <FaPhoneAlt className="text-black text-[14.5px] shrink-0" />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-[15px] font-bold text-[#000000]">
            <span>realtormedia.info@gmail.com</span>
            <FaEnvelope className="text-black text-[15.5px] shrink-0" />
          </div>
          <div className="flex items-center justify-end gap-2.5 text-[15px] font-bold text-[#000000]">
            <span>Archana arcade, IT Complex</span>
            <FaMapMarkerAlt className="text-black text-[16.5px] shrink-0" />
          </div>
          <div className="pr-[26px] text-[15px] font-bold text-[#000000]">
            <span>South Bloch, 407</span>
          </div>
        </div>

      </div>
    </div>
  );
};

