"use client";

import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { propertyCategories } from "@/data/portalData";
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaHome,
  FaCity,
  FaIndustry,
  FaLeaf,
  FaTree,
  FaArrowRight,
} from "react-icons/fa";
import { MdVilla, MdHolidayVillage, MdApartment } from "react-icons/md";

export default function CategoriesPage() {
  const renderIcon = (type: string, color: string) => {
    switch (type) {
      case "map-pin":
        return <FaMapMarkerAlt className="text-[28px]" style={{ color }} />;
      case "community":
        return <MdHolidayVillage className="text-[30px]" style={{ color }} />;
      case "apartments":
        return <MdApartment className="text-[30px]" style={{ color }} />;
      case "duplex":
        return <FaHome className="text-[28px]" style={{ color }} />;
      case "villa":
        return <MdVilla className="text-[30px]" style={{ color }} />;
      case "house":
        return <FaHome className="text-[28px]" style={{ color }} />;
      case "farm":
        return <FaTree className="text-[28px]" style={{ color }} />;
      case "commercial":
        return <FaBuilding className="text-[28px]" style={{ color }} />;
      case "industrial":
        return <FaIndustry className="text-[28px]" style={{ color }} />;
      case "agriculture":
        return <FaLeaf className="text-[28px]" style={{ color }} />;
      default:
        return <FaCity className="text-[28px]" style={{ color }} />;
    }
  };

  return (
    <PortalLayout
      title="Property & Project Categories"
      subtitle="Explore Real Estate Ventures Across 10 Specialized Segments in India"
      badge="10 Verticals"
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#073F73] via-[#0B4F8A] to-[#0284C7] rounded-xl text-white p-6 shadow-md">
          <h2 className="text-[22px] sm:text-[26px] font-black mb-1">
            Segmented Real Estate Marketplace
          </h2>
          <p className="text-[13px] text-[#BAE6FD] max-w-2xl leading-relaxed">
            From DTCP / RERA approved open plots to luxury high-rise penthouses, industrial warehouses, and organic farmland, select your desired property category below.
          </p>
        </div>

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {propertyCategories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href || `/categories/${cat.slug || cat.id}`}
              className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-[#0B4F8A] transition-all flex flex-col items-center text-center justify-between group cursor-pointer"
            >
              <div className="my-2 transition-transform group-hover:scale-110 flex items-center justify-center h-12">
                {renderIcon(cat.iconType, cat.iconColor)}
              </div>

              <div>
                <h3 className="text-[14px] font-black text-[#073F73] group-hover:text-[#0B4F8A] mb-1">
                  {cat.title}
                </h3>
                <span className="text-[11px] text-[#64748B] font-semibold">
                  Verified Listings
                </span>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100 w-full flex items-center justify-center gap-1 text-[11px] font-bold text-[#0B4F8A] group-hover:text-[#E21F2F]">
                <span>Browse Category</span>
                <FaArrowRight className="text-[9px] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
