"use client";

import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { serviceItems } from "@/data/portalData";
import {
  FaPlusSquare,
  FaSearch,
  FaUsers,
  FaBuilding,
  FaBriefcase,
  FaBullhorn,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

export default function ServicesPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FaPlusSquare className="text-white text-[22px]" />;
      case "search":
        return <FaSearch className="text-white text-[22px]" />;
      case "realtors":
        return <FaUsers className="text-white text-[22px]" />;
      case "projects":
        return <FaBuilding className="text-white text-[22px]" />;
      case "business":
        return <FaBriefcase className="text-white text-[22px]" />;
      case "advertise":
        return <FaBullhorn className="text-white text-[22px]" />;
      default:
        return <FaBuilding className="text-white text-[22px]" />;
    }
  };

  const detailedServices = [
    {
      ...serviceItems[0],
      href: "/post-property",
      description: "Direct zero-brokerage property postings for landlords, builders, and verified brokers across 15 real estate hub verticals.",
      features: ["No hidden listing charges", "Instant buyer alerts", "Direct contact leads"],
    },
    {
      ...serviceItems[1],
      href: "/properties",
      description: "Verified marketplace with RERA-checked residential plots, high-rise flats, luxury villas, and prime commercial investments.",
      features: ["30-year clear title filter", "City-wise growth corridors", "Direct realtor connect"],
    },
    {
      ...serviceItems[2],
      href: "/realtors",
      description: "Connect with certified realtors carrying official Realtors Media QR-verifiable corporate identification credentials.",
      features: ["RERA certified agents", "Local area specialists", "Transparent deal closures"],
    },
    {
      ...serviceItems[3],
      href: "/projects",
      description: "Comprehensive showcase of premium townships, commercial towers, and RERA sanctioned open plot ventures across India.",
      features: ["Direct builder bookings", "Floor plans & master layouts", "Pre-launch price benefits"],
    },
    {
      ...serviceItems[4],
      href: "/business-opportunities",
      description: "High-yield real estate franchise partnerships, channel partner distribution, joint ventures, and capital syndication.",
      features: ["District franchise rights", "Tiered commission payouts", "Marketing collateral support"],
    },
    {
      ...serviceItems[5],
      href: "/advertise",
      description: "Reach thousands of real estate buyers and investors through our 24x7 TV broadcast network and high-traffic portal slots.",
      features: ["TV interview spots", "Prime banner placements", "Targeted SMS & WhatsApp campaigns"],
    },
  ];

  return (
    <PortalLayout
      title="Services & Solutions"
      subtitle="Comprehensive Real Estate Media, Marketing, Licensing, and Marketplace Infrastructure"
      badge="Our Services"
    >
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-[#073F73] via-[#0B4F8A] to-[#0284C7] rounded-xl text-white p-6 sm:p-8 shadow-md">
          <h2 className="text-[22px] sm:text-[28px] font-black mb-2">
            Integrated Real Estate Services
          </h2>
          <p className="text-[13px] text-[#BAE6FD] max-w-2xl leading-relaxed">
            Whether you are buying a home, listing an industrial park, growing your brokerage, or launching a multi-crore township, explore our customized real estate solutions.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {detailedServices.map((svc) => (
            <div
              key={svc.id}
              className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: svc.iconColor }}
                  >
                    {getIcon(svc.iconType)}
                  </div>
                  {svc.badge && (
                    <span className="text-[10px] font-black text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full border border-[#A3D9B1]">
                      {svc.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-[16px] font-black text-[#073F73] whitespace-pre-line leading-tight mb-2">
                  {svc.title.replace("\n", " ")}
                </h3>

                <p className="text-[12.5px] text-[#475569] leading-relaxed mb-3">
                  {svc.description}
                </p>

                <ul className="space-y-1.5 mb-4">
                  {svc.features.map((f, fIdx) => (
                    <li key={fIdx} className="text-[11.5px] font-semibold text-[#1E293B] flex items-center gap-1.5">
                      <FaCheckCircle className="text-[#168A3A] text-[10px] flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <Link
                  href={svc.href}
                  className="w-full bg-[#073F73] hover:bg-[#06345F] text-white text-[11.5px] font-black py-2 rounded-md uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Explore Service</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
