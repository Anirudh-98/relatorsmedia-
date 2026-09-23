"use client";

import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { FaBuilding, FaTools, FaLandmark, FaDraftingCompass, FaCouch, FaHandshake, FaCheckCircle } from "react-icons/fa";

interface AssociateGroup {
  category: string;
  count: string;
  icon: React.ReactNode;
  description: string;
  partners: string[];
}

const associateGroups: AssociateGroup[] = [
  {
    category: "Builders & Developers",
    count: "450+ Active",
    icon: <FaBuilding className="text-[#073F73]" />,
    description: "Leading township developers, luxury apartment builders, and open plot layout creators.",
    partners: ["Prestige Estates", "Godrej Properties", "Kolte-Patil Developers", "Aparna Constructions", "My Home Group"],
  },
  {
    category: "Financial Institutions & Banks",
    count: "28+ National Banks",
    icon: <FaLandmark className="text-[#168A3A]" />,
    description: "Instant home loan approvals, project funding, mortgage refinancing, and escrow partnerships.",
    partners: ["State Bank of India", "HDFC Bank", "ICICI Bank Home Finance", "Axis Bank", "LIC Housing Finance"],
  },
  {
    category: "Architects & Urban Planners",
    count: "180+ Empanelled",
    icon: <FaDraftingCompass className="text-[#6637A8]" />,
    description: "Master planners, 3D elevation specialists, Vastu compliance consultants, and structural engineers.",
    partners: ["Studio Vastu Planners", "Urban Horizon Architects", "GreenScape Consultants", "Apex Structural Labs"],
  },
  {
    category: "Construction Materials & Hardware",
    count: "620+ Suppliers",
    icon: <FaTools className="text-[#D97706]" />,
    description: "Bulk cement, TMT steel, Italian marble, tiles, electrical fixtures, and heavy machinery.",
    partners: ["UltraTech Cement", "Tata Tiscon Steel", "Kajaria Ceramics", "Havells Electricals", "Asian Paints"],
  },
  {
    category: "Interior Designers & Furnishings",
    count: "310+ Studios",
    icon: <FaCouch className="text-[#0284C7]" />,
    description: "Modular kitchen designers, bespoke luxury furniture, home automation, and false ceiling teams.",
    partners: ["Livspace Partner Studio", "DesignCafe Alliance", "WoodCraft Interiors", "SmartHome Automation"],
  },
];

export default function AssociatesPage() {
  return (
    <PortalLayout
      title="Strategic Associates & Partners"
      subtitle="Connecting Certified Builders, Financial Institutions, Material Suppliers and Design Studios"
      badge="Ecosystem Partners"
      action={
        <Link
          href="/contact"
          className="bg-[#073F73] hover:bg-[#06345F] text-white text-[11px] font-bold px-3 py-1.5 rounded-md transition-colors shadow-2xs"
        >
          Partner With Us
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#073F73] via-[#0B4F8A] to-[#0284C7] text-white rounded-xl p-6 sm:p-8 shadow-md">
          <h2 className="text-[20px] sm:text-[26px] font-black mb-2">
            A Robust Synergistic Real Estate Network
          </h2>
          <p className="text-[13px] text-[#BAE6FD] max-w-3xl leading-relaxed">
            Realtors Media collaborates with verified developers, premier financial lenders, certified material vendors, and architecture bureaus across India to deliver seamless end-to-end property solutions.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {associateGroups.map((group, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-2xs flex flex-col justify-between hover:border-[#0B4F8A] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F7F9] border border-[#CBD5E1] flex items-center justify-center text-[20px]">
                    {group.icon}
                  </div>
                  <span className="text-[10px] font-black text-[#168A3A] bg-[#E7F6EA] px-2 py-0.5 rounded-full border border-[#A3D9B1]">
                    {group.count}
                  </span>
                </div>

                <h3 className="text-[16px] font-black text-[#073F73] mb-1">
                  {group.category}
                </h3>
                <p className="text-[12px] text-[#475569] leading-relaxed mb-3">
                  {group.description}
                </p>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#64748B] block mb-1.5">
                    Prominent Associates:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {group.partners.map((partner, pIdx) => (
                      <span
                        key={pIdx}
                        className="bg-[#F1F5F9] text-[#1E293B] text-[10.5px] font-bold px-2 py-0.5 rounded-md border border-gray-200"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#168A3A] flex items-center gap-1">
                  <FaCheckCircle className="text-[10px]" /> Verified Tie-Up
                </span>
                <Link
                  href="/contact"
                  className="text-[11px] font-bold text-[#0B4F8A] hover:underline"
                >
                  Join as Associate →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
