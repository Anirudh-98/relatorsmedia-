"use client";

import React from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaHome,
  FaCity,
  FaIndustry,
  FaLeaf,
  FaTree,
} from "react-icons/fa";
import { MdVilla, MdHolidayVillage, MdApartment } from "react-icons/md";
import { propertyCategories } from "@/data/portalData";

export const PropertyCategories: React.FC = () => {
  const renderIcon = (type: string, color: string) => {
    switch (type) {
      case "map-pin":
        return <FaMapMarkerAlt className="text-[18px] sm:text-[20px]" style={{ color }} />;
      case "community":
        return <MdHolidayVillage className="text-[19px] sm:text-[21px]" style={{ color }} />;
      case "apartments":
        return <MdApartment className="text-[19px] sm:text-[21px]" style={{ color }} />;
      case "duplex":
        return <FaHome className="text-[18px] sm:text-[20px]" style={{ color }} />;
      case "villa":
        return <MdVilla className="text-[19px] sm:text-[21px]" style={{ color }} />;
      case "house":
        return <FaHome className="text-[18px] sm:text-[20px]" style={{ color }} />;
      case "farm":
        return <FaTree className="text-[18px] sm:text-[20px]" style={{ color }} />;
      case "commercial":
        return <FaBuilding className="text-[18px] sm:text-[20px]" style={{ color }} />;
      case "industrial":
        return <FaIndustry className="text-[18px] sm:text-[20px]" style={{ color }} />;
      case "agriculture":
        return <FaLeaf className="text-[18px] sm:text-[20px]" style={{ color }} />;
      default:
        return <FaCity className="text-[18px] sm:text-[20px]" style={{ color }} />;
    }
  };

  return (
    <section className="w-full my-0.5 sm:my-1 flex-shrink-0" aria-label="Property and Project Categories">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[12.5px] sm:text-[13px] font-black uppercase tracking-wide text-[#073F73]">
          PROPERTY & PROJECT CATEGORIES
        </h3>
        <Link
          href="/categories"
          className="bg-[#0B4F8A] hover:bg-[#073F73] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-[2px] transition-colors cursor-pointer"
        >
          View All
        </Link>
      </div>

      {/* Categories 5x2 Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-1.5">
        {propertyCategories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href || `/categories/${cat.slug || cat.id}`}
            className="bg-white hover:bg-[#EEF6FC] border border-[#C9D7E3] hover:border-[#0B4F8A] rounded-[3px] p-1 flex flex-col items-center justify-center text-center transition-all duration-150 cursor-pointer shadow-2xs group h-[46px] sm:h-[50px] xl:h-[52px]"
          >
            <div className="mb-0.5 transition-transform group-hover:scale-105 flex items-center justify-center h-[20px]">
              {renderIcon(cat.iconType, cat.iconColor)}
            </div>
            <span className="text-[10px] sm:text-[10.5px] font-black text-[#143B5D] group-hover:text-[#073F73] leading-tight line-clamp-2 px-0.5">
              {cat.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
