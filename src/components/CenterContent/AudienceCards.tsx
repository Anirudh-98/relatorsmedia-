"use client";

import React from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaHome,
  FaUser,
  FaChartLine,
  FaBriefcase,
} from "react-icons/fa";
import { audienceCards } from "@/data/portalData";
import { AudienceCardItem } from "@/types";

export const AudienceCards: React.FC = () => {
  const getThemeStyles = (theme: AudienceCardItem["themeColor"]) => {
    switch (theme) {
      case "green":
        return {
          cardBorder: "border-[#A3D9B1]",
          cardBg: "bg-[#F2FAF4]",
          headerText: "text-[#168A3A]",
          iconBg: "bg-[#168A3A]",
          checkColor: "text-[#168A3A]",
          btnBg: "bg-[#168A3A] hover:bg-[#116e2e]",
        };
      case "blue":
        return {
          cardBorder: "border-[#A6CBE8]",
          cardBg: "bg-[#F0F7FD]",
          headerText: "text-[#0B4F8A]",
          iconBg: "bg-[#0B4F8A]",
          checkColor: "text-[#0B4F8A]",
          btnBg: "bg-[#0B4F8A] hover:bg-[#073F73]",
        };
      case "purple":
        return {
          cardBorder: "border-[#D4BDEB]",
          cardBg: "bg-[#F8F3FC]",
          headerText: "text-[#6637A8]",
          iconBg: "bg-[#6637A8]",
          checkColor: "text-[#6637A8]",
          btnBg: "bg-[#6637A8] hover:bg-[#522b87]",
        };
      case "red":
        return {
          cardBorder: "border-[#F5B5BC]",
          cardBg: "bg-[#FDF2F3]",
          headerText: "text-[#E21F2F]",
          iconBg: "bg-[#E21F2F]",
          checkColor: "text-[#E21F2F]",
          btnBg: "bg-[#E21F2F] hover:bg-[#c21422]",
        };
    }
  };

  const getHeaderIcon = (iconType: string) => {
    switch (iconType) {
      case "home-owner":
        return <FaHome className="text-white text-[12px]" />;
      case "buyer":
        return <FaUser className="text-white text-[11px]" />;
      case "investor":
        return <FaChartLine className="text-white text-[12px]" />;
      case "professional":
        return <FaBriefcase className="text-white text-[11px]" />;
      default:
        return <FaHome className="text-white text-[12px]" />;
    }
  };

  return (
    <section className="w-full my-0.5 sm:my-1 flex-shrink-0" aria-label="Target Audiences">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
        {audienceCards.map((card) => {
          const styles = getThemeStyles(card.themeColor);
          return (
            <div
              key={card.id}
              className={`rounded-[3px] border ${styles.cardBorder} ${styles.cardBg} flex flex-col justify-between shadow-2xs overflow-hidden transition-all duration-150`}
            >
              <div className="p-1.5 xl:p-2">
                {/* Header with Circle Icon & Title */}
                <div className="flex items-center gap-1.5 mb-1 pb-1 border-b border-black/5">
                  <div
                    className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 shadow-2xs ${styles.iconBg}`}
                  >
                    {getHeaderIcon(card.iconType)}
                  </div>
                  <h4 className={`text-[11px] sm:text-[11.5px] xl:text-[12px] font-black uppercase tracking-tight ${styles.headerText} truncate`}>
                    {card.title}
                  </h4>
                </div>

                {/* Bullets */}
                <ul className="space-y-0.5 my-1">
                  {card.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-1 text-[10px] xl:text-[10.5px] font-bold text-[#18324A] leading-tight">
                      <FaCheckCircle className={`flex-shrink-0 text-[9px] ${styles.checkColor}`} />
                      <span className="truncate">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA Button */}
              <Link
                href={card.ctaLink}
                className={`w-full ${styles.btnBg} text-white text-[9.5px] sm:text-[10px] xl:text-[10.5px] font-black py-1 px-1.5 flex items-center justify-center gap-1 transition-colors text-center uppercase tracking-wide`}
              >
                <span>{card.ctaText}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};
