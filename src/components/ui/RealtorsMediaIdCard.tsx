"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
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
    bgSvg: "/Id card.svg?v=4",
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
    badgeBg: "linear-gradient(135deg, rgb(204, 72, 38), rgb(235, 110, 65))",
    badgeText: "VIP ELITE PARTNER",
  },
  red: {
    bgSvg: "/Id card.svg?v=4",
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
    bgSvg: "/Id card-blue.svg?v=4",
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
    bgSvg: "/Id card-green.svg?v=4",
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

// Single-line text that shrinks its font until it fits its box (no "..." cut-off)
const FitText: React.FC<{
  text: string;
  maxSize: number;
  minSize: number;
  className?: string;
  as?: "span" | "h1";
}> = ({ text, maxSize, minSize, className = "", as: Tag = "span" }) => {
  const ref = useRef<HTMLElement>(null);
  const [size, setSize] = useState(maxSize);

  useLayoutEffect(() => {
    const fit = () => {
      const el = ref.current;
      if (!el) return;
      let s = maxSize;
      el.style.fontSize = `${s}px`;
      while (s > minSize && el.scrollWidth > el.clientWidth) {
        s -= 0.5;
        el.style.fontSize = `${s}px`;
      }
      setSize(s);
    };
    fit();
    document.fonts?.ready.then(fit);
  }, [text, maxSize, minSize]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLHeadingElement>}
      className={`block min-w-0 whitespace-nowrap overflow-hidden ${className}`}
      style={{ fontSize: `${size}px` }}
    >
      {text}
    </Tag>
  );
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

  const isEmployeeCard = employee?.cardType === "employee";

  const badgeText = isEmployeeCard
    ? "EMPLOYEE"
    : employee?.designation &&
      ["VIP ELITE PARTNER", "EXECUTIVE MEMBER", "EXECUTIVE PARTNER", "VERIFIED REALTOR"].includes(
        employee.designation.toUpperCase()
      )
      ? employee.designation.toUpperCase()
      : T.badgeText;

  // Employee cards swap the member fields for staff details; labels stay short to fit the label column
  const infoRows = isEmployeeCard
    ? [
      { label: "EMP ID", value: employee.employeeId || "RM-E-1111" },
      { label: "POSITION", value: employee.designation || "Executive" },
      { label: "DEPT", value: employee.department || "Operations" },
      { label: "ISSUED ON", value: employee.issuedDate || "01 JAN 2026" },
    ]
    : [
      { label: "FL ID", value: employee.employeeId || "RM-A-1116" },
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
        <div className="absolute left-[13px] top-[32px] z-10 w-[131px] h-[150px] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/RMLogo.png"
            alt="Realtors Media Logo"
            className="w-full h-full object-contain select-none pointer-events-none"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            3. BRAND HEADER TEXT — right-aligned inside the wave banner
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[36px] top-[38px] z-10 flex flex-col items-end text-right text-white">
          <div className="text-[44px] font-bold leading-none uppercase tracking-[1.5px] whitespace-nowrap">
            REALTORS MEDIA
          </div>
          <div className="text-[22.5px] font-normal leading-none mt-[12px] tracking-[0.5px] whitespace-nowrap">
            India&rsquo;s Real Estate Media Platform
          </div>
          <div className="text-[22.5px] font-normal leading-none mt-[8px] tracking-[0.5px] whitespace-nowrap">
            People | Properties | Possibilities
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            4. PROFILE PHOTO — left column with solid black border
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[43px] top-[218px] z-10">
          <div className="w-[238px] h-[270px] rounded-[22px] overflow-hidden border-[2.5px] border-black bg-[#F1F5F9]">
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
            5. TIER TITLE — gradient badge with rounded corners
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[46px] top-[232px] z-10 flex justify-end">
          <div
            className="px-[16px] py-[6px] rounded-[10px] shadow-sm flex items-center justify-center"
            style={{ background: T.badgeBg }}
          >
            <span className="text-[23px] font-bold uppercase leading-none text-white tracking-wide whitespace-nowrap">
              {badgeText}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            6. MEMBER NAME — solid black bold font
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[50px] top-[501px] z-10 w-[450px]">
          <FitText
            as="h1"
            text={employee.name || "Ravi Varma"}
            maxSize={40}
            minSize={22}
            className="font-bold leading-none text-black"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            7. INFO GRID (4 rows) — vertically aligned colons
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[50px] top-[555px] z-10 w-[460px]">
          {infoRows.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[176px_14px_1fr] items-baseline leading-[35.5px] text-black">
              <span className="text-[28px] font-bold uppercase">
                {label}
              </span>
              <span className="text-[28px] font-bold text-center">:</span>
              <FitText
                text={value}
                maxSize={29}
                minSize={16}
                className="pl-[18px] font-normal"
              />
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════
            8. AUTHORIZED SIGNATURE — Koti Sir signature & line
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[50px] top-[700px] z-10 w-[278px] h-[140px]">
          <div className="absolute left-[27px] top-[-18px] w-[197px] h-[118px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/KotiSirSignature-card.png"
              alt="Authorized Signature"
              className="w-full h-full object-contain object-bottom select-none pointer-events-none"
            />
          </div>
          <div className="absolute left-0 top-[103px] w-[278px] h-[2.5px] bg-black" />
          <div className="absolute left-0 top-[123px] text-[16px] font-normal uppercase leading-none text-black">
            AUTHORIZED SIGNATURE
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            9. BARCODE — right column below tier title
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[29px] top-[283px] z-10 w-[190px] h-[53px] flex items-center justify-end">
          <BarcodeSVG
            value={employee.employeeId || "RM-A-1116"}
            className="w-full h-full"
            color="#000000"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            10. SLOGAN — right-aligned regular text
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[27px] top-[347px] z-10 text-right">
          <div className="text-[24px] font-normal uppercase text-black leading-[30px]">
            BUILDING<br />
            BETTER<br />
            COMMUNITIES<br />
            TOGETHER
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            11. QR CODE — right side below slogan
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[27px] top-[487px] z-10">
          <QRCodeSVG
            value={qrValue}
            size={99}
            level="M"
            bgColor="transparent"
            fgColor="#000000"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            12. BUILDING — glass towers bleeding off the right edge
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute left-[426px] top-[613px] h-[213px] pointer-events-none z-[2]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/idcardbgimg.png"
            alt="Building"
            className="h-full w-auto max-w-none select-none pointer-events-none"
          />
        </div>

        {/* ══════════════════════════════════════════════════════════
            13. FOOTER — right-aligned contact info with black icons
           ══════════════════════════════════════════════════════════ */}
        <div className="absolute right-[25px] top-[842px] z-10 text-right text-[20.3px] font-normal text-black">
          <div className="flex items-center justify-end gap-[16px] leading-[33px]">
            <span>www.realtorsmedia.world</span>
            <span className="w-[22px] flex justify-center"><FaGlobe className="text-[22px] shrink-0" /></span>
          </div>
          <div className="flex items-center justify-end gap-[16px] leading-[33px]">
            <span>+91 8096792778, +91 9441185799</span>
            <span className="w-[22px] flex justify-center"><FaPhoneAlt className="text-[19px] shrink-0" /></span>
          </div>
          <div className="flex items-center justify-end gap-[16px] leading-[33px]">
            <span>realtorsmedia.info@gmail.com</span>
            <span className="w-[22px] flex justify-center"><FaEnvelope className="text-[21px] shrink-0" /></span>
          </div>
          <div className="flex items-center justify-end gap-[16px] leading-[25px]">
            <span>Archana Arcade,</span>
            <span className="w-[22px] flex justify-center"><FaMapMarkerAlt className="text-[22px] shrink-0" /></span>
          </div>
          <div className="pr-[38px] leading-[25px]">
            <span>South Block, 407</span>
          </div>
        </div>

      </div>
    </div>
  );
};

